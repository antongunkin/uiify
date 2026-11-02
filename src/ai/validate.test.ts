import { describe, expect, it, vi } from "vitest";
import { uiParts, type UiChild, type UiNode } from "./catalog.generated.js";
import { filterDocument, pricingDocument, settingsDocument } from "./test-utils/documents.js";
import { UiDocumentError } from "./types.js";
import { validateDocument } from "./validate.js";

type Json = Record<string, unknown>;

function issuesOf(value: unknown) {
  const result = validateDocument(value);
  if (result.ok) throw new Error("expected the document to be invalid");
  return result.issues;
}

function single(value: unknown) {
  const issues = issuesOf(value);
  expect(issues).toHaveLength(1);
  return issues[0] as (typeof issues)[number];
}

const button = (props: Json = {}): Json => ({ type: "Button", props, children: ["Go"] });
const form = (...children: unknown[]): Json => ({ type: "form", props: {}, children });
const fieldRoot = (id: string, ...children: unknown[]): Json => ({
  type: "Field.Root",
  props: { id },
  children,
});
const fieldLabel = (fieldId: string): Json => ({
  type: "Field.Label",
  props: { fieldId },
  children: ["Name"],
});

describe("validateDocument", () => {
  it.each([
    ["filterDocument", filterDocument],
    ["settingsDocument", settingsDocument],
    ["pricingDocument", pricingDocument],
  ])("accepts %s", (_name, document) => {
    expect(validateDocument(document).ok).toBe(true);
  });

  it("wraps a bare node and keeps a versioned document", () => {
    const bare = validateDocument(filterDocument);
    const wrapped = validateDocument({ version: 1, root: filterDocument });
    expect(bare.ok && bare.document.version).toBe(1);
    expect(bare.ok && bare.document.root).toBe(filterDocument);
    expect(wrapped.ok && wrapped.document.version).toBe(1);
  });

  it("uses only parts that exist in the catalog", () => {
    const types = new Set<string>();
    const walk = (node: UiNode): void => {
      types.add(node.type);
      for (const child of (node as { children?: readonly UiChild[] }).children ?? [])
        if (typeof child !== "string") walk(child);
    };
    for (const document of [filterDocument, settingsDocument, pricingDocument]) walk(document);
    for (const type of types) expect(uiParts).toHaveProperty(type);
  });

  describe("schema errors", () => {
    it("rejects an unknown type", () => {
      const issue = single(form({ type: "Buton", props: {} }));
      expect(issue.breadcrumb).toBe("form › Buton.type");
      expect(issue.path).toBe("/children/0/type");
      expect(issue.message).toContain('unknown type "Buton"');
      expect(issue.allowed).toContain("Button");
    });

    it("rejects an unknown prop", () => {
      const issue = single(form(button({ colour: "red" })));
      expect(issue.breadcrumb).toBe("form › Button.props.colour");
      expect(issue.message).toContain('unknown prop "colour"');
    });

    it("rejects a value outside a closed set", () => {
      const issue = single({ version: 1, root: form(button({ variant: "primary" })) });
      expect(issue.path).toBe("/root/children/0/props/variant");
      expect(issue.breadcrumb).toBe("form › Button.props.variant");
      expect(issue.message).toContain('"primary"');
      expect(issue.allowed).toEqual(["secondary", "outline", "ghost", "destructive", "link"]);
    });

    it("rejects a missing required prop", () => {
      const issue = single(fieldRoot("a", { type: "Field.Label", props: {}, children: ["Name"] }));
      expect(issue.breadcrumb).toBe("Field.Root › Field.Label.props.fieldId");
      expect(issue.message).toContain('missing required prop "fieldId"');
    });

    it("rejects children on a leaf part", () => {
      const issue = single({
        type: "Select.Root",
        props: {},
        children: [{ type: "Select.Separator", props: {}, children: ["x"] }],
      });
      expect(issue.breadcrumb).toBe("Select.Root › Select.Separator");
      expect(issue.message).toBe("Select.Separator takes no children");
    });

    it("rejects an unsafe URL scheme", () => {
      const issue = single(
        form({ type: "a", props: { href: "javascript:alert(1)" }, children: ["x"] }),
      );
      expect(issue.breadcrumb).toBe("form › a.props.href");
      expect(issue.message).toContain("not an allowed URL");
    });

    it("rejects an unsafe URL scheme on Avatar src", () => {
      const issue = single({
        type: "Avatar",
        props: { name: "Ada", fallback: "A", src: "javascript:alert(1)" },
      });
      expect(issue.breadcrumb).toBe("Avatar.props.src");
      expect(issue.message).toContain("not an allowed URL");
      expect(
        validateDocument({ type: "Avatar", props: { name: "Ada", fallback: "A", src: "/ada.png" } })
          .ok,
      ).toBe(true);
    });

    it("reports a cyclic or BigInt value instead of throwing", () => {
      const cyclic: Json = {};
      cyclic.self = cyclic;
      for (const variant of [cyclic, 10n]) {
        const issue = single(form(button({ variant })));
        expect(issue.breadcrumb).toBe("form › Button.props.variant");
        expect(issue.allowed).toHaveLength(5);
      }
    });

    it.each([
      " javascript:alert(1)",
      "\tjavascript:x",
      "\u0001javascript:x",
      "\u0000javascript:x",
      "java\tscript:alert(1)",
      "java\nscript:x",
      "java\rscript:x",
      " data:text/html,<script>alert(1)</script>",
      "/docs\n",
      " https://example.com",
    ])("rejects the URL %j, which a browser reads with its whitespace removed", (href) => {
      const issue = single(form({ type: "a", props: { href }, children: ["x"] }));
      expect(issue.breadcrumb).toBe("form › a.props.href");
      expect(issue.message).toContain("not an allowed URL");
    });

    it.each(["/docs", "./docs", "#top", "?page=2", "https://example.com", "mailto:a@b.c"])(
      "accepts the URL %s",
      (href) => {
        expect(validateDocument(form({ type: "a", props: { href }, children: ["x"] })).ok).toBe(
          true,
        );
      },
    );

    describe("values that reach a style attribute", () => {
      const injection = "#fff;x;position:fixed;inset:0;z-index:2147483647;background:url(x)";
      const colorPicker = (props: Json): Json => ({
        type: "ColorPicker",
        props: { label: "Brand", ...props },
      });
      const popup = (id: string): Json => ({
        type: "Popup.Root",
        props: { id },
        children: [
          { type: "Popup.Trigger", props: {}, children: ["Open"] },
          { type: "Popup.Content", props: {}, children: ["Body"] },
        ],
      });

      it("rejects a ColorPicker color that is not #rrggbb", () => {
        for (const defaultValue of [injection, "red", "#fff", "#12345g", "#123456 "]) {
          const issue = single(colorPicker({ defaultValue }));
          expect(issue.breadcrumb).toBe("ColorPicker.props.defaultValue");
          expect(issue.message).toContain("#rrggbb");
        }
      });

      it("accepts a #rrggbb ColorPicker color", () => {
        for (const defaultValue of ["#3366ff", "#ABCDEF"]) {
          expect(validateDocument(colorPicker({ defaultValue })).ok).toBe(true);
        }
      });

      it("rejects a Popup.Root id that would leave the anchor custom property", () => {
        for (const id of ["a;position:fixed", "a}b", "x{", "1abc", "has space", ""]) {
          const issue = single(popup(id));
          expect(issue.breadcrumb).toBe("Popup.Root.props.id");
          expect(issue.message).toContain("not a valid id");
        }
        expect(validateDocument(popup("menu-1")).ok).toBe(true);
      });

      it("checks every id reference against the id token", () => {
        const trigger = (target: string): Json => ({
          type: "ModalTrigger",
          props: { target },
          children: ["Open"],
        });
        expect(single(trigger("a;b")).breadcrumb).toBe("ModalTrigger.props.target");
        expect(single(fieldRoot("a", fieldLabel("a;b"))).message).toContain("not a valid id");
        expect(
          single({ type: "label", props: { htmlFor: "a b" }, children: ["x"] }).message,
        ).toContain("not a valid id");
        expect(validateDocument(trigger("order:details.v2_x")).ok).toBe(true);
      });

      it("accepts space-separated ids in aria-labelledby and aria-describedby only", () => {
        const section = (props: Json): Json => ({ type: "section", props, children: ["x"] });
        expect(validateDocument(section({ "aria-labelledby": "title subtitle" })).ok).toBe(true);
        for (const value of ["title;x", " title", "title  subtitle", "title "]) {
          const issue = single(section({ "aria-labelledby": value }));
          expect(issue.message).toContain("list of ids");
        }
        expect(
          single({ type: "Button", props: { "aria-describedby": "a{b" }, children: ["x"] }).message,
        ).toContain("list of ids");
      });
    });

    describe("controlled props", () => {
      it.each([
        ["Input", { value: "fixed" }],
        ["Textarea", { value: "fixed" }],
        ["Checkbox", { id: "c", checked: true }],
        ["Switch", { checked: true }],
        ["Toggle", { id: "t", label: "Bold", pressed: true }],
        ["Slider", { value: 5 }],
        ["ColorPicker", { label: "Brand", value: "#336699" }],
        ["Pagination.Root", { count: 5, page: 2 }],
        ["Drawer.Root", { open: true }],
        ["Drawer.Root", { activeSnapPoint: 1 }],
      ])("rejects the controlled prop of %s, which has its default form", (type, props) => {
        const issue = single({ type, props });
        expect(issue.message).toMatch(/^unknown prop/);
      });

      it.each([
        ["Input", { defaultValue: "start" }],
        ["Textarea", { defaultValue: "start" }],
        ["Checkbox", { id: "c", defaultChecked: true, value: "yes" }],
        ["Switch", { defaultChecked: true, value: "on" }],
        ["Toggle", { id: "t", label: "Bold", defaultPressed: true }],
        ["Slider", { defaultValue: 5 }],
        ["ColorPicker", { label: "Brand", defaultValue: "#336699" }],
        ["Pagination.Root", { count: 5, defaultPage: 2 }],
        ["Drawer.Root", { defaultOpen: true, defaultActiveSnapPoint: 1 }],
      ])("accepts the default form on %s", (type, props) => {
        expect(validateDocument({ type, props }).ok).toBe(true);
      });
    });

    it("rejects a child that is neither text nor a node", () => {
      const issue = single(form(5));
      expect(issue.breadcrumb).toBe("form › children[0]");
      expect(issue.message).toContain("a child must be a string or a node object");
    });

    it("reports a node without a type once", () => {
      const issue = single(form({ props: {} }));
      expect(issue.message).toContain('missing required property "type"');
    });

    it("rejects a document that is not an object", () => {
      expect(single(5).breadcrumb).toBe("document");
      expect(single({ version: 1, root: "x" }).breadcrumb).toBe("root");
    });

    it("reports a nested precise error without the union noise", () => {
      const issue = single(
        form({ type: "Stack", props: {}, children: [button({ size: "huge" })] }),
      );
      expect(issue.breadcrumb).toBe("form › Stack › Button.props.size");
    });
  });

  describe("rules", () => {
    it("rejects a part outside its root", () => {
      const issue = single(form(fieldLabel("status")));
      expect(issue.breadcrumb).toBe("form › Field.Label");
      expect(issue.message).toContain(uiParts["Field.Label"].rootType);
      expect(issue.message).toContain("Field.Root");
    });

    it("accepts a part inside its root through layout nodes", () => {
      const stack = { type: "Stack", props: {}, children: [fieldLabel("status")] };
      expect(validateDocument(fieldRoot("status", stack)).ok).toBe(true);
    });

    it("rejects a fieldId that names another root", () => {
      const issue = single({ version: 1, root: fieldRoot("status", fieldLabel("other")) });
      expect(issue.path).toBe("/root/children/0/props/fieldId");
      expect(issue.breadcrumb).toBe("Field.Root › Field.Label.props.fieldId");
      expect(issue.message).toContain('"other"');
      expect(issue.allowed).toEqual(["status"]);
    });

    it("uses the nearest root for fieldId", () => {
      const inner = fieldRoot("inner", fieldLabel("inner"));
      expect(validateDocument(fieldRoot("outer", inner)).ok).toBe(true);
      expect(single(fieldRoot("outer", fieldRoot("inner", fieldLabel("outer")))).message).toContain(
        '"inner"',
      );
    });

    it("rejects a duplicate id", () => {
      const issue = single({ version: 1, root: form(fieldRoot("same"), fieldRoot("same")) });
      expect(issue.path).toBe("/root/children/1/props/id");
      expect(issue.breadcrumb).toBe("form › Field.Root.props.id");
      expect(issue.message).toContain('duplicate id "same"');
      expect(issue.message).toContain("/root/children/0");
    });

    describe("nesting", () => {
      const node = (type: string, ...children: unknown[]): Json => ({
        type,
        props: {},
        children,
      });
      const row = (id: string, ...children: unknown[]): Json => ({
        ...node("Table.Row", ...children),
        props: { id },
      });

      it.each([
        ["Stack in p", node("p", node("Stack", "x")), "p › Stack", "p"],
        ["Button in h2", node("h2", button()), "h2 › Button", "h2"],
        ["section in strong", node("strong", node("section", "x")), "strong › section", "strong"],
        ["ul in label", node("label", node("ul", node("li", "x"))), "label › ul", "label"],
        ["Grid in legend", node("legend", node("Grid", "x")), "legend › Grid", "legend"],
        ["p in dt", node("dl", node("dt", node("p", "x"))), "dl › dt › p", "dt"],
      ])("rejects %s, which the HTML parser moves out", (_name, value, breadcrumb, parent) => {
        const issue = single(value);
        expect(issue.breadcrumb).toBe(breadcrumb);
        expect(issue.message).toContain(`inside ${parent}`);
      });

      it("rejects a form inside a form, through any depth", () => {
        const issue = single(form(node("Stack", form())));
        expect(issue.breadcrumb).toBe("form › Stack › form");
        expect(issue.message).toContain("form");
        expect(single(form({ type: "Form", props: {}, children: ["x"] })).breadcrumb).toBe(
          "form › Form",
        );
      });

      it("rejects an interactive part or link inside a link", () => {
        const link = (...children: unknown[]): Json => ({
          type: "a",
          props: { href: "/x" },
          children,
        });
        expect(single(link(button())).breadcrumb).toBe("a › Button");
        expect(single(link(node("strong", link("x")))).breadcrumb).toBe("a › strong › a");
        expect(single(link(node("em", node("label", "x")))).breadcrumb).toBe("a › em › label");
      });

      it("rejects text and non-item children directly in a list", () => {
        expect(single(node("ul", "x")).breadcrumb).toBe("ul › children[0]");
        expect(single(node("ol", node("p", "x"))).breadcrumb).toBe("ol › p");
        expect(single(node("dl", node("li", "x"))).breadcrumb).toBe("dl › li");
        expect(single(node("ul", node("li", "x"), "y")).path).toBe("/children/1");
      });

      it.each(["ul", "ol"])("accepts Item as a native li inside %s", (type) => {
        expect(validateDocument(node(type, node("Item", node("ItemContent", "Name")))).ok).toBe(
          true,
        );
      });

      it.each(["dl", "DescriptionList"])("accepts description parts inside %s", (type) => {
        expect(
          validateDocument(
            node(type, node("DescriptionTerm", "Status"), node("DescriptionDetails", "Active")),
          ).ok,
        ).toBe(true);
        expect(validateDocument(node(type, node("Item", "Wrong"))).ok).toBe(false);
      });

      it("rejects component buttons nested through physical or transparent parts", () => {
        expect(single(node("Button", node("Stack", button()))).message).toContain("button");
        const tooltip = node(
          "Tooltip.Provider",
          node("Tooltip.Root", node("Tooltip.Trigger", button())),
        );
        expect(single(tooltip).breadcrumb).toBe(
          "Tooltip.Provider › Tooltip.Root › Tooltip.Trigger › Button",
        );
        const nested = node(
          "Button",
          node("Tooltip.Provider", node("Tooltip.Root", node("Tooltip.Trigger", "Help"))),
        );
        expect(single(nested).message).toContain("button");
        expect(validateDocument(node("Button", node("button", "Native"))).ok).toBe(false);
      });

      it.each([
        node("Table.Root", row("row", node("Table.Cell", "x"))),
        node("Table.Root", node("Table.Cell", "x")),
        node("Table.Root", node("Stack", node("Table.Body"))),
        node("Table.Root", node("Table.Body", node("Table.Cell", "x"))),
        node("Table.Root", node("Table.Body", row("row", node("Stack", node("Table.Cell", "x"))))),
        node("Table.Root", node("Table.Body", node("Table.Header"))),
        node("Table.Root", node("Table.Body", "text")),
        node("Table.Root", node("Table.Body", row("row", "text"))),
      ])("rejects table anatomy the HTML parser rewrites: %j", (value) => {
        expect(validateDocument(value).ok).toBe(false);
      });

      it("uses effective parents through transparent parts without inventing wrappers", () => {
        const table = node(
          "Table.Root",
          node(
            "Tooltip.Provider",
            node(
              "Tooltip.Root",
              node("Table.Caption", "Users"),
              node(
                "Table.Header",
                row("head", {
                  type: "Table.ColumnHeader",
                  props: { id: "name" },
                  children: ["Name"],
                }),
              ),
              node(
                "Table.Body",
                row("body", node("Table.RowHeader", "Ada"), node("Table.Cell", "Active")),
              ),
              node("Table.Footer", row("foot", node("Table.Cell", "Total"))),
            ),
          ),
        );
        expect(validateDocument(table).ok).toBe(true);
        expect(
          validateDocument(
            node("ul", node("Tooltip.Provider", node("Tooltip.Root", node("Item", "Name")))),
          ).ok,
        ).toBe(true);
        expect(validateDocument(node("ul", node("Tooltip.Provider", "text"))).ok).toBe(false);
        expect(
          validateDocument(
            node(
              "Select.Root",
              node("Select.Content", {
                type: "Select.Item",
                props: { value: "a" },
                children: ["A"],
              }),
            ),
          ).ok,
        ).toBe(true);
      });

      it("accepts phrasing natives and text in phrasing parents", () => {
        const link = { type: "a", props: { href: "/x" }, children: [node("strong", "x"), "y"] };
        expect(validateDocument(node("p", node("em", "a"), link, "b")).ok).toBe(true);
        expect(validateDocument(node("h1", node("strong", "a"))).ok).toBe(true);
        expect(validateDocument(node("label", node("em", "a"))).ok).toBe(true);
        expect(
          validateDocument(node("ul", node("li", node("p", "x"), node("Stack", button())))).ok,
        ).toBe(true);
        expect(validateDocument(node("dl", node("dt", "a"), node("dd", node("p", "b")))).ok).toBe(
          true,
        );
      });
    });

    it("lets a props object be reused", () => {
      const props = { variant: "outline" };
      expect(
        validateDocument(
          form(
            { type: "Button", props, children: ["a"] },
            { type: "Button", props, children: ["b"] },
          ),
        ).ok,
      ).toBe(true);
    });
  });

  describe("limits", () => {
    const nest = (depth: number): Json => {
      let node: Json = { type: "p", props: {}, children: ["leaf"] };
      for (let level = 1; level < depth; level += 1)
        node = { type: "Stack", props: {}, children: [node] };
      return node;
    };

    it("allows depth 32 and rejects depth 33", () => {
      expect(validateDocument(nest(32)).ok).toBe(true);
      expect(validateDocument({ version: 1, root: nest(32) }).ok).toBe(true);
      const issue = single(nest(33));
      expect(issue.message).toContain("deeper than 32");
      expect(issue.breadcrumb).toBe(
        [...Array.from({ length: 32 }, () => "Stack"), "p"].join(" › "),
      );
    });

    it("allows 2000 nodes and rejects 2001", () => {
      const list = (count: number): Json => ({
        type: "ul",
        props: {},
        children: Array.from({ length: count - 1 }, () => ({ type: "li", props: {} })),
      });
      expect(validateDocument(list(2000)).ok).toBe(true);
      const issue = single({ version: 1, root: list(2001) });
      expect(issue.message).toContain("more than 2000 nodes");
      expect(issue.path).toBe("/root/children/1999");
      expect(issue.breadcrumb).toBe("ul › li");
    });

    it("counts text children toward the node limit", () => {
      const texts = (count: number): Json => ({
        type: "p",
        props: {},
        children: Array.from({ length: count }, () => "x"),
      });
      expect(validateDocument(texts(1999)).ok).toBe(true);
      const issue = single(texts(2000));
      expect(issue.message).toContain("more than 2000 nodes");
      expect(issue.breadcrumb).toBe("p › children[1999]");
    });

    it("rejects a string over 10000 characters", () => {
      expect(validateDocument(form("x".repeat(10_000))).ok).toBe(true);
      const issue = single({ version: 1, root: form("x".repeat(10_001)) });
      expect(issue.path).toBe("/root/children/0");
      expect(issue.breadcrumb).toBe("form › children[0]");
      expect(issue.message).toContain("10001 characters");
    });

    it("rejects a long string in a prop", () => {
      const issue = single(form(button({ title: "x".repeat(10_001) })));
      expect(issue.path).toBe("/children/0/props/title");
      expect(issue.breadcrumb).toBe("form › Button.props.title");
    });

    it("names the document when the whole value is too long", () => {
      expect(single("x".repeat(10_001)).breadcrumb).toBe("document");
    });
  });

  describe("untrusted input", () => {
    it("rejects __proto__ and constructor props without touching Object.prototype", () => {
      const value = JSON.parse('{"type":"Button","props":{"__proto__":{"x":1},"constructor":"y"}}');
      const issues = issuesOf(value);
      const messages = issues.map((issue) => issue.message).join("\n");
      expect(messages).toContain('"__proto__"');
      expect(messages).toContain('"constructor"');
      expect(({} as { x?: unknown }).x).toBeUndefined();
    });

    it("rejects a node that appears twice, quickly", () => {
      const shared = { type: "p", props: {}, children: ["x"] };
      const started = performance.now();
      const issue = single(form(shared, shared));
      expect(issue.path).toBe("/children/1");
      expect(issue.message).toContain("shared and circular");
      expect(performance.now() - started).toBeLessThan(100);
    });

    it("rejects a node that contains itself, quickly", () => {
      const loop: { type: string; props: object; children: unknown[] } = {
        type: "Stack",
        props: {},
        children: [],
      };
      loop.children.push(loop);
      const started = performance.now();
      const issue = single(loop);
      expect(issue.path).toBe("/children/0");
      expect(performance.now() - started).toBeLessThan(100);
    });

    it("rejects a children list that contains itself", () => {
      const children: unknown[] = [];
      children.push(children);
      expect(single({ type: "Stack", props: {}, children }).message).toContain(
        "shared and circular",
      );
    });

    it("stops on cyclic props", () => {
      const props: Json = {};
      props.a = props;
      props.b = props;
      expect(validateDocument({ type: "Button", props }).ok).toBe(false);
    });

    it("rejects a function value without calling it", () => {
      const title = vi.fn(() => "x");
      expect(validateDocument({ type: "Button", props: { title } }).ok).toBe(false);
      expect(title).not.toHaveBeenCalled();
    });
  });

  describe("version", () => {
    it("rejects an unsupported version with one issue", () => {
      const issue = single({ version: 2, root: form(button({ variant: "primary" })) });
      expect(issue.message).toContain("unsupported version 2");
      expect(issue.path).toBe("/version");
    });

    it("rejects a missing version", () => {
      expect(single({ root: form() }).message).toContain("version");
    });
  });

  it("provides stable codes without losing repair locations or allowed values", () => {
    expect(single(button({ variant: "wrong" }))).toMatchObject({
      code: "schema.enum",
      path: "/props/variant",
      allowed: expect.arrayContaining(["ghost"]),
    });
    expect(single(fieldLabel("missing"))).toMatchObject({ code: "root.missing", path: "" });
    expect(single(fieldRoot("a", fieldLabel("b"))).code).toBe("fieldId.mismatch");
    expect(single(form(fieldRoot("a"), fieldRoot("a"))).code).toBe("id.duplicate");
    expect(single(form("x".repeat(10_001))).code).toBe("limit.string");
    expect(single({ type: "Button", props: {}, children: [button()] }).code).toBe("nesting");
    expect(single({ version: 2, root: button() }).code).toBe("version.unsupported");
  });
});

describe("UiDocumentError", () => {
  it("carries the issues and lists them in the message", () => {
    const issues = issuesOf(form({ type: "Buton", props: {} }));
    const error = new UiDocumentError(issues);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("UiDocumentError");
    expect(error.issues).toBe(issues);
    expect(error.message).toContain("form › Buton.type");
  });
});

import { act, Suspense } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToReadableStream } from "react-dom/server";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { UiNode, UiNodeInput } from "./index.js";
import { loadDocument, UiDocument, UiDocumentError } from "./index.js";
import { uiLoaders } from "./loaders.generated.js";
import { filterDocument, pricingDocument, settingsDocument } from "./test-utils/documents.js";
import { renderDocumentHtml } from "./test-utils/render-html.js";

// Tell React these tests drive it through `act`, so suspended retries run in the act queue.
const actEnvironment = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean | undefined };
const previousActEnvironment = actEnvironment.IS_REACT_ACT_ENVIRONMENT;
beforeAll(() => {
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
});
afterAll(() => {
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

/** Stream-renders `node` and collects what the server reports to `onError`. */
async function renderReportingErrors(node: unknown): Promise<{ html: string; errors: unknown[] }> {
  const errors: unknown[] = [];
  const stream = await renderToReadableStream(
    <Suspense>
      <UiDocument node={node} />
    </Suspense>,
    { onError: (error: unknown) => void errors.push(error) },
  );
  await stream.allReady;
  return { html: await new Response(stream).text(), errors };
}

const fixtures = [
  ["filterDocument", filterDocument],
  ["settingsDocument", settingsDocument],
  ["pricingDocument", pricingDocument],
] as const;

describe("UiDocument", () => {
  it("renders the filter document", async () => {
    const html = await renderDocumentHtml(filterDocument);
    // Fizz writes a form's method after its other attributes, so match them in any order.
    expect(html).toMatch(/<form(?=[^>]*\bmethod="get")(?=[^>]*\brole="search")[^>]*>/);
    expect(html).toMatch(/<select[^>]*\bname="status"/);
    expect(html).toMatch(/<button[^>]*type="submit"[^>]*>Apply<\/button>/);
  });

  it("loads only the components a document uses", async () => {
    const loaders = uiLoaders as Record<string, () => Promise<unknown>>;
    const originals = { ...loaders };
    const spies = Object.fromEntries(
      Object.entries(originals).map(([type, load]) => [type, vi.fn(load)]),
    );
    Object.assign(loaders, spies);
    try {
      await loadDocument(filterDocument);
    } finally {
      Object.assign(loaders, originals);
    }
    const called = Object.entries(spies)
      .filter(([, spy]) => spy.mock.calls.length > 0)
      .map(([type]) => type)
      .sort();
    expect(called).toEqual(["Button", "NativeSelect", "NativeSelectOption"]);
    for (const type of called) expect(spies[type]).toHaveBeenCalledTimes(1);
  });

  it("rejects an invalid document", async () => {
    const error: unknown = await loadDocument({ type: "Buton", props: {} }).catch(
      (reason: unknown) => reason,
    );
    expect(error).toBeInstanceOf(UiDocumentError);
    expect((error as UiDocumentError).issues[0]?.breadcrumb).toBe("Buton.type");
  });

  it.each(fixtures)("hydrates a JSON round trip of %s without mismatch", async (_name, fixture) => {
    const parsed: unknown = JSON.parse(JSON.stringify(fixture));
    const serverHtml = await renderDocumentHtml(fixture);
    expect(await renderDocumentHtml(parsed)).toBe(serverHtml);

    const container = document.createElement("div");
    container.innerHTML = serverHtml;
    document.body.append(container);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;
    // The browser parses its own copy, which the server render never saw, and its loaders
    // resolve only after hydration has started: hold every loader until released.
    const clientCopy: unknown = JSON.parse(JSON.stringify(fixture));
    const loaders = uiLoaders as Record<string, () => Promise<unknown>>;
    const originals = { ...loaders };
    let release = (): void => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    for (const [type, load] of Object.entries(originals)) loaders[type] = () => gate.then(load);
    const first = container.firstElementChild;
    const hydrated = (): boolean =>
      Object.keys(first ?? {}).some((key) => key.startsWith("__reactFiber$"));

    try {
      await act(async () => {
        root = hydrateRoot(
          container,
          <Suspense>
            <UiDocument node={clientCopy} />
          </Suspense>,
          { onRecoverableError },
        );
      });
      // The boundary suspended on the loaders and kept the server nodes, not yet hydrated.
      expect(hydrated()).toBe(false);
      await act(async () => {
        release();
        await gate;
      });
      expect(hydrated()).toBe(true);
    } finally {
      Object.assign(loaders, originals);
    }

    expect(container.firstElementChild).toBe(first);
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError.mock.calls.map((call) => call.map(String).join(" "))).toEqual([]);
    await act(async () => root?.unmount());
  });

  it("server-renders an invalid document as an error, never as markup", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const { html, errors } = await renderReportingErrors({
      type: "form",
      props: {},
      children: [{ type: "Buton", props: {}, children: ["Pay"] }],
    });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toBeInstanceOf(UiDocumentError);
    expect((errors[0] as UiDocumentError).issues[0]?.breadcrumb).toBe("form › Buton.type");
    expect(html).not.toMatch(/<(form|button|Buton)\b/i);
    expect(html).not.toContain(">Pay<");
    consoleError.mockRestore();
  });

  it.each([5, "text", null, undefined, true])(
    "server-renders the primitive node %j as an error",
    async (node) => {
      const { html, errors } = await renderReportingErrors(node);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBeInstanceOf(UiDocumentError);
      expect(html).not.toMatch(/<(?!template|!--)[a-z]/i);
    },
  );

  it("never writes a style value from a rejected color or id", async () => {
    const injected = "#fff;x;position:fixed;inset:0;z-index:2147483647;background:url(x)";
    for (const node of [
      { type: "ColorPicker", props: { label: "Brand", defaultValue: injected } },
      { type: "PopoverContent", props: { id: "p;position:fixed" }, children: ["Body"] },
    ]) {
      const { html, errors } = await renderReportingErrors(node);
      expect(errors[0]).toBeInstanceOf(UiDocumentError);
      // A development server puts the error message in the fallback `<template>`; no element
      // and no style attribute is rendered.
      expect(html).not.toMatch(/\sstyle=/);
      expect(html).not.toMatch(/<(?!template|!--|\/template)[a-z]/i);
    }
  });

  it("writes an allowed color into its custom property", async () => {
    expect(
      await renderDocumentHtml({
        type: "ColorPicker",
        props: { label: "Brand", defaultValue: "#336699" },
      }),
    ).toContain("--uiify-color-picker-value:#336699");
  });

  it("renders the document as validated, whatever happens to the object later", async () => {
    const node = JSON.parse(JSON.stringify(filterDocument)) as {
      children: { children: { type: string; props: Record<string, unknown> }[] }[];
    };
    const before = await renderDocumentHtml(node);
    const button = node.children[0]!.children[2]!;
    button.type = "a";
    button.props = { href: "javascript:alert(1)" };
    const after = await renderDocumentHtml(node);
    expect(after).toBe(before);
    expect(after).not.toContain("javascript:");
  });

  it("loads a deep-frozen copy and ignores later changes to the input", async () => {
    const node = JSON.parse(JSON.stringify(filterDocument)) as {
      props: Record<string, unknown>;
      children: { props: Record<string, unknown>; children: unknown[] }[];
    };
    const loaded = await loadDocument(node);
    expect(loaded.root).not.toBe(node);
    node.props.method = "post";
    node.children[0]!.children.push({ type: "Buton", props: {} });
    const root = loaded.root as unknown as typeof node;
    expect(root.props.method).toBe("get");
    expect(root.children[0]!.children).toHaveLength(3);
    expect(Object.isFrozen(root.props)).toBe(true);
    expect(Object.isFrozen(root.children[0]!.children)).toBe(true);
  });

  it("rejects a value structuredClone cannot copy as not plain data", async () => {
    const error: unknown = await loadDocument({
      type: "Button",
      props: { title: () => "x" },
    }).catch((reason: unknown) => reason);
    expect(error).toBeInstanceOf(UiDocumentError);
    expect((error as UiDocumentError).issues[0]?.message).toContain("plain data");
  });

  it("renders a Tooltip with its Provider outside the Root", async () => {
    const node = {
      type: "Tooltip.Provider",
      props: {},
      children: [
        {
          type: "Tooltip.Root",
          props: { id: "tip" },
          children: [
            { type: "Tooltip.Trigger", props: {}, children: ["Help"] },
            { type: "Tooltip.Content", props: {}, children: ["More detail"] },
          ],
        },
      ],
    } satisfies UiNodeInput;
    const html = await renderDocumentHtml(node);
    expect(html).toContain("Help");
    expect(html).toContain("More detail");
  });

  it("rejects a valid-looking Proxy instead of rendering the live object", async () => {
    let reads = 0;
    const props = new Proxy(
      { id: "menu" },
      // The first read (validation) sees a valid id; later reads would inject CSS.
      {
        get: (target, key) =>
          key === "id" && reads++ > 0 ? "a;position:fixed" : Reflect.get(target, key),
      },
    );
    const node = { type: "PopoverContent", props, children: [] };
    const error: unknown = await loadDocument(node).catch((reason: unknown) => reason);
    expect(error).toBeInstanceOf(UiDocumentError);
    expect((error as UiDocumentError).issues[0]?.message).toContain("plain data");
  });

  it("renders document text as text, never as markup", async () => {
    const node = {
      type: "p",
      props: {},
      children: ["<script>alert(1)</script>"],
    } satisfies UiNode;
    const html = await renderDocumentHtml(node);
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script");
  });
});

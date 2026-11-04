import { createRef, useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Combobox } from "./Combobox.js";
import type {
  ComboboxFormControlProps,
  ComboboxRootSingleProps,
  ComboboxRootMultiProps,
} from "./types.js";

const items = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "", label: "Empty ID" },
];

function Picker(
  props: (Omit<ComboboxRootSingleProps, "items"> | Omit<ComboboxRootMultiProps, "items">) & {
    bridge?: ComboboxFormControlProps;
  },
) {
  const { bridge, ...root } = props;
  return (
    <Combobox.Root items={items} {...root}>
      <Combobox.Input aria-label="Fruit" />
      <Combobox.Tags />
      {bridge && <Combobox.FormControl {...bridge} />}
      <Combobox.Content>
        {(filtered) => filtered.map((item) => <Combobox.Item key={item.value} item={item} />)}
      </Combobox.Content>
    </Combobox.Root>
  );
}
Picker.displayName = "Picker";

function proxy(container: HTMLElement): HTMLSelectElement {
  const element = container.querySelector("select");
  if (!element) throw new Error("Missing form proxy");
  return element;
}

describe("Combobox FormControl", () => {
  it("exports an optional form bridge", () => {
    expect(typeof Combobox.FormControl).toBe("function");
    const { container } = render(<Picker />);
    expect(container.querySelector("select")).toBeNull();
  });

  it.each([null, "", "a", "missing"])("submits exact single ID %j", (value) => {
    const { container } = render(
      <form>
        <Picker defaultValue={value} bridge={{ name: "fruit" }} />
      </form>,
    );
    const form = container.querySelector("form")!;
    const select = proxy(container);
    expect(new FormData(form).getAll("fruit")).toEqual(value === null ? [] : [value]);
    expect(select.options.length).toBe(value === null ? 0 : 1);
    expect(select.multiple).toBe(true);
    expect(select.hidden).toBe(true);
    expect(select.tabIndex).toBe(-1);
    expect(select.getAttribute("aria-hidden")).toBe("true");
  });

  it("serializes multiple IDs in selection order with only selected options", () => {
    const { container } = render(
      <form>
        <Picker multiple defaultValue={["missing", "", "b"]} bridge={{ name: "fruit" }} />
      </form>,
    );
    expect(new FormData(container.querySelector("form")!).getAll("fruit")).toEqual([
      "missing",
      "",
      "b",
    ]);
    expect([...proxy(container).options].map((option) => option.text)).toEqual([
      "missing",
      "Empty ID",
      "Banana",
    ]);
  });

  it("renders selected native entries in SSR", () => {
    const markup = renderToStaticMarkup(<Picker defaultValue="a" bridge={{ name: "fruit" }} />);
    const host = document.createElement("div");
    host.innerHTML = markup;
    expect(proxy(host).selectedOptions[0]?.value).toBe("a");
  });

  it("preserves native consumer props, refs, external owner and the query name", () => {
    const ref = createRef<HTMLSelectElement>();
    const { container } = render(
      <>
        <form id="external" />
        <Combobox.Root items={items} defaultValue="a">
          <Combobox.Input name="query" aria-label="Fruit" />
          <Combobox.FormControl
            ref={ref}
            name="fruit"
            form="external"
            className="consumer"
            style={{ opacity: 0.5 }}
            data-custom="yes"
          />
        </Combobox.Root>
      </>,
    );
    expect(ref.current).toBe(proxy(container));
    expect(ref.current?.className).toBe("consumer");
    expect(ref.current?.style.opacity).toBe("0.5");
    expect(ref.current?.dataset.custom).toBe("yes");
    expect(screen.getByRole("combobox").getAttribute("name")).toBe("query");
    expect(new FormData(container.querySelector("form")!).getAll("fruit")).toEqual(["a"]);
  });

  it("validates selection rather than query and clears attempted error on valid selection", () => {
    const { container } = render(<Picker defaultOpen bridge={{ name: "fruit", required: true }} />);
    const input = screen.getByRole("combobox");
    const select = proxy(container);
    expect(select.validity.valid).toBe(false);
    expect(input.getAttribute("aria-required")).toBe("true");
    expect(input.hasAttribute("aria-invalid")).toBe(false);
    fireEvent.change(input, { target: { value: "Banana" } });
    expect(select.validity.valid).toBe(false);
    act(() => {
      expect(select.checkValidity()).toBe(false);
    });
    expect(document.activeElement).toBe(input);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    fireEvent.click(screen.getByRole("option", { name: "Banana" }));
    expect(select.validity.valid).toBe(true);
    expect(input.hasAttribute("aria-invalid")).toBe(false);
  });

  it("lets consumers cancel invalid focus and override default input ARIA", () => {
    const onInvalid = vi.fn((event: React.InvalidEvent<HTMLSelectElement>) =>
      event.preventDefault(),
    );
    const { container } = render(
      <Combobox.Root items={items}>
        <Combobox.Input aria-label="Fruit" aria-required={false} aria-invalid="grammar" />
        <Combobox.FormControl required onInvalid={onInvalid} />
      </Combobox.Root>,
    );
    act(() => {
      proxy(container).checkValidity();
    });
    expect(onInvalid).toHaveBeenCalledTimes(1);
    expect(document.activeElement).not.toBe(screen.getByRole("combobox"));
    expect(screen.getByRole("combobox").getAttribute("aria-required")).toBe("false");
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("grammar");
  });

  it("clears stale invalid semantics when required or disabled changes", () => {
    const { container, rerender } = render(<Picker bridge={{ required: true }} />);
    act(() => {
      proxy(container).checkValidity();
    });
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("true");
    rerender(<Picker bridge={{ required: false }} />);
    expect(screen.getByRole("combobox").hasAttribute("aria-invalid")).toBe(false);
    rerender(<Picker bridge={{ required: true }} />);
    expect(screen.getByRole("combobox").hasAttribute("aria-invalid")).toBe(false);
    act(() => {
      proxy(container).checkValidity();
    });
    rerender(<Picker disabled bridge={{ required: true }} />);
    expect(proxy(container).disabled).toBe(true);
    expect(screen.getByRole("combobox").hasAttribute("aria-invalid")).toBe(false);
  });

  it("rejects a second form bridge per Root", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <Combobox.Root items={items}>
          <Combobox.FormControl />
          <Combobox.FormControl />
        </Combobox.Root>,
      ),
    ).toThrow(/one.*FormControl/i);
    error.mockRestore();
  });
});

async function reset(form: HTMLFormElement) {
  await act(async () => {
    form.reset();
    await Promise.resolve();
  });
}

describe("Combobox form reset", () => {
  it("restores initial defaults, clears active state and closes the popup", async () => {
    const changes = vi.fn();
    const queries = vi.fn();
    const { container, rerender } = render(
      <form>
        <Picker
          defaultValue="a"
          defaultOpen
          onValueChange={changes}
          onInputValueChange={queries}
          bridge={{ name: "fruit" }}
        />
      </form>,
    );
    const form = container.querySelector("form")!;
    const input = screen.getByRole("combobox");
    fireEvent.click(screen.getByRole("option", { name: "Banana" }));
    fireEvent.change(input, { target: { value: "draft" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    rerender(
      <form>
        <Picker
          defaultValue="b"
          defaultInputValue="changed default"
          defaultOpen
          onValueChange={changes}
          onInputValueChange={queries}
          bridge={{ name: "fruit" }}
        />
      </form>,
    );
    changes.mockClear();
    queries.mockClear();
    await reset(form);
    expect((input as HTMLInputElement).value).toBe("Apple");
    expect(new FormData(form).getAll("fruit")).toEqual(["a"]);
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(input.hasAttribute("aria-activedescendant")).toBe(false);
    expect(changes).toHaveBeenCalledExactlyOnceWith("a");
    expect(queries).toHaveBeenCalledExactlyOnceWith("Apple");
    changes.mockClear();
    queries.mockClear();
    await reset(form);
    expect(changes).not.toHaveBeenCalled();
    expect(queries).not.toHaveBeenCalled();
  });

  it("restores an explicit initial query and snapshots selected arrays", async () => {
    const defaults = ["a"];
    const { container, rerender } = render(
      <form>
        <Picker
          multiple
          defaultValue={defaults}
          defaultInputValue="initial query"
          bridge={{ name: "fruit" }}
        />
      </form>,
    );
    defaults.push("b");
    rerender(
      <form>
        <Picker
          multiple
          defaultValue={defaults}
          defaultInputValue="later query"
          bridge={{ name: "fruit" }}
        />
      </form>,
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "edited query" } });
    await reset(container.querySelector("form")!);
    expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("initial query");
    expect(new FormData(container.querySelector("form")!).getAll("fruit")).toEqual(["a"]);
  });

  it("clears validation attempts but leaves an empty required model native-invalid", async () => {
    const { container } = render(
      <form>
        <Picker bridge={{ name: "fruit", required: true }} />
      </form>,
    );
    const select = proxy(container);
    act(() => {
      select.checkValidity();
    });
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("true");
    await reset(container.querySelector("form")!);
    expect(screen.getByRole("combobox").hasAttribute("aria-invalid")).toBe(false);
    expect(select.validity.valid).toBe(false);
    act(() => {
      select.checkValidity();
    });
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("true");
  });

  it("respects cancellation from a late reset listener without callbacks", async () => {
    const changes = vi.fn();
    const queries = vi.fn();
    const open = vi.fn();
    const { container } = render(
      <form>
        <Picker
          defaultValue="a"
          onValueChange={changes}
          onInputValueChange={queries}
          onOpenChange={open}
          bridge={{ name: "fruit" }}
        />
      </form>,
    );
    const form = container.querySelector("form")!;
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "draft" } });
    changes.mockClear();
    queries.mockClear();
    open.mockClear();
    form.addEventListener("reset", (event) => event.preventDefault());
    await reset(form);
    expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("draft");
    expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("true");
    expect(changes).not.toHaveBeenCalled();
    expect(queries).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
  });

  it("resynchronizes refused controlled values even when React state stays unchanged", async () => {
    const changes = vi.fn();
    const queries = vi.fn();
    const open = vi.fn();
    const { container, rerender } = render(
      <form>
        <Picker
          defaultValue="a"
          value="a"
          defaultInputValue="initial query"
          inputValue="kept query"
          open
          onValueChange={changes}
          onInputValueChange={queries}
          onOpenChange={open}
          bridge={{ name: "fruit" }}
        />
      </form>,
    );
    rerender(
      <form>
        <Picker
          defaultValue="a"
          value="b"
          defaultInputValue="initial query"
          inputValue="kept query"
          open
          onValueChange={changes}
          onInputValueChange={queries}
          onOpenChange={open}
          bridge={{ name: "fruit" }}
        />
      </form>,
    );
    await reset(container.querySelector("form")!);
    expect(new FormData(container.querySelector("form")!).getAll("fruit")).toEqual(["b"]);
    expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("kept query");
    expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("true");
    expect(changes).toHaveBeenCalledExactlyOnceWith("a");
    expect(queries).toHaveBeenCalledExactlyOnceWith("initial query");
    expect(open).toHaveBeenCalledTimes(1);
  });

  it("uses the current external owner, including late mount and changing form IDs", async () => {
    const { container } = render(
      <Picker defaultValue="a" bridge={{ name: "fruit", form: "late" }} />,
    );
    const owner = document.createElement("form");
    owner.id = "late";
    document.body.append(owner);
    const other = document.createElement("form");
    other.id = "other";
    document.body.append(other);
    const input = screen.getByRole("combobox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "draft" } });
    await reset(other);
    expect(input.value).toBe("draft");
    owner.id = "renamed";
    await reset(owner);
    expect(input.value).toBe("draft");
    proxy(container).setAttribute("form", "renamed");
    await reset(owner);
    expect(input.value).toBe("Apple");
    owner.remove();
    other.remove();
  });

  it("resets inside a disabled fieldset and restores an empty multiple selection", async () => {
    const changes = vi.fn();
    const { container, rerender } = render(
      <form>
        <fieldset>
          <Picker multiple defaultOpen onValueChange={changes} bridge={{ name: "fruit" }} />
        </fieldset>
      </form>,
    );
    fireEvent.click(screen.getByRole("option", { name: "Banana" }));
    rerender(
      <form>
        <fieldset disabled>
          <Picker multiple defaultOpen onValueChange={changes} bridge={{ name: "fruit" }} />
        </fieldset>
      </form>,
    );
    await reset(container.querySelector("form")!);
    expect([...proxy(container).selectedOptions]).toHaveLength(0);
    expect(screen.queryAllByRole("button", { name: /Remove/ })).toHaveLength(0);
    expect(changes).toHaveBeenLastCalledWith([]);
  });
});

function ControlledPicker({
  acceptValue,
  acceptQuery,
  acceptOpen,
}: {
  acceptValue: boolean;
  acceptQuery: boolean;
  acceptOpen: boolean;
}) {
  const [value, setValue] = useState<string | null>("b");
  const [query, setQuery] = useState("kept query");
  const [open, setOpen] = useState(true);
  return (
    <form>
      <Picker
        value={value}
        inputValue={query}
        open={open}
        defaultValue="a"
        defaultInputValue="initial query"
        onValueChange={(next) => {
          if (acceptValue) setValue(next);
        }}
        onInputValueChange={(next) => {
          if (acceptQuery) setQuery(next);
        }}
        onOpenChange={(next) => {
          if (acceptOpen) setOpen(next);
        }}
        bridge={{ name: "fruit" }}
      />
    </form>
  );
}
ControlledPicker.displayName = "ControlledPicker";

it.each([
  [true, false, false],
  [false, true, false],
  [false, false, true],
  [true, true, true],
])(
  "settles independent controlled reset owners: %s/%s/%s",
  async (acceptValue, acceptQuery, acceptOpen) => {
    const { container } = render(
      <ControlledPicker
        acceptValue={acceptValue}
        acceptQuery={acceptQuery}
        acceptOpen={acceptOpen}
      />,
    );
    await reset(container.querySelector("form")!);
    expect(new FormData(container.querySelector("form")!).getAll("fruit")).toEqual([
      acceptValue ? "a" : "b",
    ]);
    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe(acceptQuery ? "initial query" : "kept query");
    expect(input.getAttribute("aria-expanded")).toBe(acceptOpen ? "false" : "true");
  },
);

it("keeps one tree-root reset listener across queries and removes it on unmount", () => {
  const add = vi.spyOn(document, "addEventListener");
  const remove = vi.spyOn(document, "removeEventListener");
  const { unmount } = render(<Picker bridge={{ name: "fruit" }} />);
  const listeners = add.mock.calls.filter(([event]) => event === "reset");
  expect(listeners).toHaveLength(1);
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "draft" } });
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "draft again" } });
  expect(add.mock.calls.filter(([event]) => event === "reset")).toHaveLength(1);
  unmount();
  expect(remove.mock.calls.filter(([event]) => event === "reset")).toEqual(listeners);
  add.mockRestore();
  remove.mockRestore();
});

it("takes a new default snapshot on remount and releases bridge registration", async () => {
  const { container, rerender } = render(
    <form>
      <Picker key="first" defaultValue="a" bridge={{ name: "fruit" }} />
    </form>,
  );
  rerender(
    <form>
      <Picker key="second" defaultValue="b" bridge={{ name: "fruit" }} />
    </form>,
  );
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "edited" } });
  await reset(container.querySelector("form")!);
  expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("Banana");
  expect(new FormData(container.querySelector("form")!).getAll("fruit")).toEqual(["b"]);
});

it("subscribes to the proxy shadow tree and ignores a queued reset after unmount", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  const shadow = host.attachShadow({ mode: "open" });
  const container = document.createElement("div");
  shadow.append(container);
  const changes = vi.fn();
  const view = render(
    <form>
      <Picker defaultValue="a" value="b" onValueChange={changes} bridge={{ name: "fruit" }} />
    </form>,
    { container },
  );
  await reset(container.querySelector("form")!);
  expect(changes).toHaveBeenCalledExactlyOnceWith("a");
  changes.mockClear();
  await act(async () => {
    container.querySelector("form")!.reset();
    view.unmount();
    await Promise.resolve();
  });
  expect(changes).not.toHaveBeenCalled();
  host.remove();
});

it("settles accepted uncontrolled reset FormData by the next queued microtask", async () => {
  const { container } = render(
    <form>
      <Picker defaultValue="a" defaultOpen bridge={{ name: "fruit" }} />
    </form>,
  );
  fireEvent.click(screen.getByRole("option", { name: "Banana" }));
  const form = container.querySelector("form")!;
  await act(async () => {
    form.reset();
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    expect(new FormData(form).getAll("fruit")).toEqual(["a"]);
  });
});

it("settles accepted controlled reset FormData by the next queued microtask", async () => {
  const { container } = render(<ControlledPicker acceptValue acceptQuery acceptOpen />);
  const form = container.querySelector("form")!;
  await act(async () => {
    form.reset();
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    expect(new FormData(form).getAll("fruit")).toEqual(["a"]);
  });
});

it.each(["click", "keyboard", "label commit"])(
  "submits a known empty multiple ID selected by %s",
  (method) => {
    const changes = vi.fn();
    const { container } = render(
      <form>
        <Picker
          multiple
          defaultOpen
          onValueChange={changes}
          bridge={{ name: "fruit", required: true }}
        />
      </form>,
    );
    const input = screen.getByRole("combobox");
    if (method === "click") fireEvent.click(screen.getByRole("option", { name: "Empty ID" }));
    else if (method === "keyboard") {
      fireEvent.keyDown(input, { key: "ArrowUp" });
      fireEvent.keyDown(input, { key: "Enter" });
    } else {
      fireEvent.change(input, { target: { value: "Empty ID" } });
      fireEvent.keyDown(input, { key: "Enter" });
    }
    expect(changes).toHaveBeenCalledExactlyOnceWith([""]);
    expect(new FormData(container.querySelector("form")!).getAll("fruit")).toEqual([""]);
    expect(proxy(container).validity.valid).toBe(true);
  },
);

it("keeps whitespace-bearing known IDs distinct and validates their raw identity", () => {
  const validate = vi.fn(() => true);
  const changes = vi.fn();
  render(
    <Combobox.Root
      multiple
      defaultOpen
      defaultValue={["a"]}
      maxValues={2}
      validateValue={validate}
      items={[
        { value: " a ", label: "Spaced ID" },
        { value: "", label: "Empty ID" },
      ]}
      onValueChange={changes}
    >
      <Combobox.Input aria-label="Fruit" />
      <Combobox.Content>
        {(filtered) => filtered.map((item) => <Combobox.Item key={item.value} item={item} />)}
      </Combobox.Content>
    </Combobox.Root>,
  );
  fireEvent.click(screen.getByRole("option", { name: "Spaced ID" }));
  expect(changes).toHaveBeenCalledExactlyOnceWith(["a", " a "]);
  expect(validate).toHaveBeenCalledExactlyOnceWith(" a ");
  fireEvent.click(screen.getByRole("option", { name: "Empty ID" }));
  expect(changes).toHaveBeenCalledTimes(1);
});

it("preserves blank custom rejection and validation refusal for known empty IDs", () => {
  const changes = vi.fn();
  render(
    <Picker
      multiple
      defaultOpen
      allowCustomValue
      validateValue={() => false}
      onValueChange={changes}
      bridge={{ name: "fruit" }}
    />,
  );
  fireEvent.click(screen.getByRole("option", { name: "Empty ID" }));
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "   " } });
  fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
  expect(changes).not.toHaveBeenCalled();
});

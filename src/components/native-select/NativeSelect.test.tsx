import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createRenderCounter } from "../test-utils/RenderCounter.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  NativeSelect,
  NativeSelectContent,
  NativeSelectOptGroup,
  NativeSelectOption,
  NativeSelectSeparator,
} from "./NativeSelect.js";

it("does not create a change handler for a native server render", () => {
  const element = NativeSelect({ defaultValue: "native" });
  expect(element?.props).not.toHaveProperty("onChange", expect.any(Function));
});

describe("Select", () => {
  it("fires onValueChange when the selection changes", () => {
    const onValueChange = vi.fn();
    render(
      <NativeSelect defaultValue="" name="plan" onValueChange={onValueChange}>
        <NativeSelectContent>
          <NativeSelectOption disabled value="">
            Pick
          </NativeSelectOption>
          <NativeSelectOption value="a">A</NativeSelectOption>
          <NativeSelectOption value="b">B</NativeSelectOption>
        </NativeSelectContent>
      </NativeSelect>,
    );

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "a" } });
    expect(onValueChange).toHaveBeenCalledWith("a");
  });

  it("participates in form submission with name and value", () => {
    render(
      <form data-testid="form">
        <NativeSelect defaultValue="a" name="plan">
          <NativeSelectContent>
            <NativeSelectOption value="a">A</NativeSelectOption>
            <NativeSelectOption value="b">B</NativeSelectOption>
          </NativeSelectContent>
        </NativeSelect>
      </form>,
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.name).toBe("plan");
    expect(select.value).toBe("a");
  });

  it("uses a disabled empty option as a placeholder", () => {
    render(
      <NativeSelect defaultValue="" name="plan">
        <NativeSelectContent>
          <NativeSelectOption disabled value="">
            Pick
          </NativeSelectOption>
          <NativeSelectOption value="a">A</NativeSelectOption>
        </NativeSelectContent>
      </NativeSelect>,
    );

    const placeholder = screen.getByRole("option", { name: "Pick" }) as HTMLOptionElement;
    expect(placeholder.disabled).toBe(true);
    expect(placeholder.value).toBe("");
  });

  it("rerenders only the select owner on selection", () => {
    const { Wrapper, getCommitCount, reset } = createRenderCounter();
    function Owner() {
      return (
        <NativeSelect defaultValue="a" name="plan">
          <NativeSelectContent>
            <NativeSelectOption value="a">A</NativeSelectOption>
            <NativeSelectOption value="b">B</NativeSelectOption>
          </NativeSelectContent>
        </NativeSelect>
      );
    }
    Owner.displayName = "Owner";

    render(
      <Wrapper>
        <Owner />
      </Wrapper>,
    );
    reset();
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "b" } });
    expect(getCommitCount()).toBeLessThanOrEqual(1);
  });

  it("owns data-disabled; consumer cannot override it", () => {
    render(
      <NativeSelect defaultValue="a" name="plan" disabled data-disabled="no">
        <NativeSelectContent>
          <NativeSelectOption value="a">A</NativeSelectOption>
        </NativeSelectContent>
      </NativeSelect>,
    );
    expect(screen.getByRole("combobox").getAttribute("data-disabled")).toBe("");
  });

  it("composes its recipe class with consumer styling props", () => {
    render(
      <NativeSelect
        aria-label="Plan"
        className="consumer-select"
        data-layout="compact"
        data-uiify-native-select="consumer-value"
      >
        <NativeSelectContent>
          <NativeSelectOption value="a">A</NativeSelectOption>
        </NativeSelectContent>
      </NativeSelect>,
    );
    const select = screen.getByRole("combobox");
    expect(select.getAttribute("class")).toBe("uiify-native-select consumer-select");
    expect(select.getAttribute("data-layout")).toBe("compact");
    expect(select.getAttribute("data-uiify-native-select")).toBe("consumer-value");
  });

  it("lets a consumer onChange veto the internal value sync (policy #1: form-control change veto)", () => {
    const onValueChange = vi.fn();
    const consumerCalls: string[] = [];
    render(
      <NativeSelect
        defaultValue="a"
        name="plan"
        onValueChange={onValueChange}
        onChange={(event) => {
          consumerCalls.push("consumer");
          event.preventDefault();
        }}
      >
        <NativeSelectContent>
          <NativeSelectOption value="a">A</NativeSelectOption>
          <NativeSelectOption value="b">B</NativeSelectOption>
        </NativeSelectContent>
      </NativeSelect>,
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "b" } });
    expect(consumerCalls).toEqual(["consumer"]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(
      <NativeSelect defaultValue="" name="plan">
        <NativeSelectContent>
          <NativeSelectOption disabled value="">
            Pick
          </NativeSelectOption>
          <NativeSelectOption value="a">A</NativeSelectOption>
        </NativeSelectContent>
      </NativeSelect>,
    );
    expect(markup).toContain("<select");
    expect(markup).toContain('name="plan"');
    expect(markup).toContain("<option");
  });

  it("renders Separator as an hr with its recipe class", () => {
    const html = renderToStaticMarkup(
      <NativeSelect defaultValue="a" name="plan">
        <NativeSelectContent>
          <NativeSelectOption value="a">A</NativeSelectOption>
          <NativeSelectSeparator />
          <NativeSelectOption value="b">B</NativeSelectOption>
        </NativeSelectContent>
      </NativeSelect>,
    );

    expect(html).toContain('<hr class="uiify-native-select-separator"/>');
    // The hr must sit between the options so the picker renders it in place.
    expect(html.indexOf("<hr")).toBeGreaterThan(html.indexOf('value="a"'));
    expect(html.indexOf("<hr")).toBeLessThan(html.indexOf('value="b"'));
  });

  it("Group emits the native fallback label without an invalid legend child", () => {
    const html = renderToStaticMarkup(
      <NativeSelect defaultValue="apple" name="fruit">
        <NativeSelectContent>
          <NativeSelectOptGroup label="Fruit">
            <NativeSelectOption value="apple">Apple</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelectContent>
      </NativeSelect>,
    );

    expect(html).toContain('<optgroup class="uiify-native-select-group" label="Fruit"');
    expect(html).not.toContain("<legend");
  });

  it("tracks the controlled value on the native option", () => {
    const html = renderToStaticMarkup(
      <NativeSelect value="cat" name="pet" onValueChange={() => {}}>
        <NativeSelectContent>
          <NativeSelectOption value="cat">Cat</NativeSelectOption>
          <NativeSelectOption value="dog">Dog</NativeSelectOption>
        </NativeSelectContent>
      </NativeSelect>,
    );

    expect(html).not.toContain("<selectedcontent");
    expect(html).toContain(
      '<option class="uiify-native-select-item" value="cat" selected="">Cat</option>',
    );
  });

  it("reports every selected value from a native multiple select", () => {
    const onValueChange = vi.fn();
    render(
      <NativeSelect multiple defaultValue={["a"]} name="tags" onValueChange={onValueChange}>
        <NativeSelectContent>
          <NativeSelectOption value="a">A</NativeSelectOption>
          <NativeSelectOption value="b">B</NativeSelectOption>
          <NativeSelectOption value="c">C</NativeSelectOption>
        </NativeSelectContent>
      </NativeSelect>,
    );

    const select = screen.getByRole("listbox") as HTMLSelectElement;
    expect(select.multiple).toBe(true);
    select.options[2]!.selected = true;
    fireEvent.change(select);
    expect(onValueChange).toHaveBeenCalledWith(["a", "c"]);
  });

  it("reflects a controlled array value on a multiple select", () => {
    render(
      <NativeSelect multiple value={["a", "c"]} name="tags" onValueChange={() => {}}>
        <NativeSelectContent>
          <NativeSelectOption value="a">A</NativeSelectOption>
          <NativeSelectOption value="b">B</NativeSelectOption>
          <NativeSelectOption value="c">C</NativeSelectOption>
        </NativeSelectContent>
      </NativeSelect>,
    );

    const select = screen.getByRole("listbox") as HTMLSelectElement;
    expect(Array.from(select.selectedOptions, (option) => option.value)).toEqual(["a", "c"]);
  });

  it("submits every selected value through FormData", () => {
    render(
      <form data-testid="form">
        <NativeSelect multiple defaultValue={["a", "b"]} name="tag">
          <NativeSelectContent>
            <NativeSelectOption value="a">A</NativeSelectOption>
            <NativeSelectOption value="b">B</NativeSelectOption>
            <NativeSelectOption value="c">C</NativeSelectOption>
          </NativeSelectContent>
        </NativeSelect>
      </form>,
    );

    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(new FormData(form).getAll("tag")).toEqual(["a", "b"]);
  });

  it("server-renders the native multiple attribute and selected options", () => {
    const multiple = renderToStaticMarkup(
      <NativeSelect multiple defaultValue={["a"]} name="tags">
        <NativeSelectContent>
          <NativeSelectOption value="a">A</NativeSelectOption>
          <NativeSelectOption value="b">B</NativeSelectOption>
        </NativeSelectContent>
      </NativeSelect>,
    );
    expect(multiple).toContain('multiple=""');
    expect(multiple).toContain(
      '<option class="uiify-native-select-item" value="a" selected="">A</option>',
    );

    const single = renderToStaticMarkup(
      <NativeSelect defaultValue="a" name="tags">
        <NativeSelectContent>
          <NativeSelectOption value="a">A</NativeSelectOption>
        </NativeSelectContent>
      </NativeSelect>,
    );
    expect(single).not.toContain("multiple");
  });

  it("keeps a scalar value and callback for a single select", () => {
    const onValueChange = vi.fn();
    render(
      <NativeSelect defaultValue="a" name="plan" onValueChange={onValueChange}>
        <NativeSelectContent>
          <NativeSelectOption value="a">A</NativeSelectOption>
          <NativeSelectOption value="b">B</NativeSelectOption>
        </NativeSelectContent>
      </NativeSelect>,
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.multiple).toBe(false);
    fireEvent.change(select, { target: { value: "b" } });
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("keeps the native select tree valid in React clients", () => {
    const html = renderToStaticMarkup(
      <NativeSelect defaultValue="dog" name="pet">
        <NativeSelectContent>
          <NativeSelectOptGroup label="Pets">
            <NativeSelectOption value="dog">Dog</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelectContent>
      </NativeSelect>,
    );

    expect(html).not.toMatch(/<select[^>]*><button/);
    expect(html).not.toContain("<legend");
    expect(html).not.toMatch(/<option[^>]*>[^<]*<(?:span|svg)/);
    expect(html).toContain(
      '<optgroup class="uiify-native-select-group" label="Pets"><option class="uiify-native-select-item" value="dog" selected="">Dog</option>',
    );
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createRenderCounter } from "../test-utils/RenderCounter.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Select } from "./Select.js";

describe("Select", () => {
  it("fires onValueChange when the selection changes", () => {
    const onValueChange = vi.fn();
    render(
      <Select.Root defaultValue="" name="plan" onValueChange={onValueChange}>
        <Select.Content>
          <Select.Item disabled value="">
            Pick
          </Select.Item>
          <Select.Item value="a">A</Select.Item>
          <Select.Item value="b">B</Select.Item>
        </Select.Content>
      </Select.Root>,
    );

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "a" } });
    expect(onValueChange).toHaveBeenCalledWith("a");
  });

  it("participates in form submission with name and value", () => {
    render(
      <form data-testid="form">
        <Select.Root defaultValue="a" name="plan">
          <Select.Content>
            <Select.Item value="a">A</Select.Item>
            <Select.Item value="b">B</Select.Item>
          </Select.Content>
        </Select.Root>
      </form>,
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.name).toBe("plan");
    expect(select.value).toBe("a");
  });

  it("uses a disabled empty option as a placeholder", () => {
    render(
      <Select.Root defaultValue="" name="plan">
        <Select.Content>
          <Select.Item disabled value="">
            Pick
          </Select.Item>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select.Root>,
    );

    const placeholder = screen.getByRole("option", { name: "Pick" }) as HTMLOptionElement;
    expect(placeholder.disabled).toBe(true);
    expect(placeholder.value).toBe("");
  });

  it("rerenders only the select owner on selection", () => {
    const { Wrapper, getCommitCount, reset } = createRenderCounter();
    function Owner() {
      return (
        <Select.Root defaultValue="a" name="plan">
          <Select.Content>
            <Select.Item value="a">A</Select.Item>
            <Select.Item value="b">B</Select.Item>
          </Select.Content>
        </Select.Root>
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
      <Select.Root defaultValue="a" name="plan" disabled data-disabled="no">
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    expect(screen.getByRole("combobox").getAttribute("data-disabled")).toBe("");
  });

  it("forwards consumer styling props and owns its identity marker", () => {
    render(
      <Select.Root
        aria-label="Plan"
        className="consumer-select"
        data-layout="compact"
        data-uiify-select="consumer-value"
      >
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    const select = screen.getByRole("combobox");
    expect(select.getAttribute("class")).toBe("consumer-select");
    expect(select.getAttribute("data-layout")).toBe("compact");
    expect(select.getAttribute("data-uiify-select")).toBe("");
  });

  it("lets a consumer onChange veto the internal value sync (policy #1: form-control change veto)", () => {
    const onValueChange = vi.fn();
    const consumerCalls: string[] = [];
    render(
      <Select.Root
        defaultValue="a"
        name="plan"
        onValueChange={onValueChange}
        onChange={(event) => {
          consumerCalls.push("consumer");
          event.preventDefault();
        }}
      >
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
          <Select.Item value="b">B</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "b" } });
    expect(consumerCalls).toEqual(["consumer"]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(
      <Select.Root defaultValue="" name="plan">
        <Select.Content>
          <Select.Item disabled value="">
            Pick
          </Select.Item>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    expect(markup).toContain("<select");
    expect(markup).toContain('name="plan"');
    expect(markup).toContain("<option");
  });

  it("renders Separator as an hr with a stable data-part", () => {
    const html = renderToStaticMarkup(
      <Select.Root defaultValue="a" name="plan">
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
          <Select.Separator />
          <Select.Item value="b">B</Select.Item>
        </Select.Content>
      </Select.Root>,
    );

    expect(html).toContain('<hr data-part="separator"/>');
    // The hr must sit between the options so the picker renders it in place.
    expect(html.indexOf("<hr")).toBeGreaterThan(html.indexOf('value="a"'));
    expect(html.indexOf("<hr")).toBeLessThan(html.indexOf('value="b"'));
  });

  it("Group emits the native fallback label without an invalid legend child", () => {
    const html = renderToStaticMarkup(
      <Select.Root defaultValue="apple" name="fruit">
        <Select.Content>
          <Select.Group label="Fruit">
            <Select.Item value="apple">Apple</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>,
    );

    expect(html).toContain('<optgroup label="Fruit"');
    expect(html).not.toContain("<legend");
  });

  it("tracks the controlled value on the native option", () => {
    const html = renderToStaticMarkup(
      <Select.Root value="cat" name="pet" onValueChange={() => {}}>
        <Select.Content>
          <Select.Item value="cat">Cat</Select.Item>
          <Select.Item value="dog">Dog</Select.Item>
        </Select.Content>
      </Select.Root>,
    );

    expect(html).not.toContain("<selectedcontent");
    expect(html).toContain('<option value="cat" selected="">Cat</option>');
  });

  it("keeps the native select tree valid in React clients", () => {
    const html = renderToStaticMarkup(
      <Select.Root defaultValue="dog" name="pet">
        <Select.Content>
          <Select.Group label="Pets">
            <Select.Item value="dog">Dog</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>,
    );

    expect(html).not.toMatch(/<select[^>]*><button/);
    expect(html).not.toContain("<legend");
    expect(html).not.toMatch(/<option[^>]*>[^<]*<(?:span|svg)/);
    expect(html).toContain('<optgroup label="Pets"><option value="dog" selected="">Dog</option>');
  });
});

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createRenderCounter } from "../test-utils/RenderCounter.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Textarea } from "./Textarea.js";

describe("Textarea", () => {
  it("sets data-autosize without reading scrollHeight", () => {
    render(<Textarea autoSize aria-label="Notes" />);
    expect(screen.getByRole("textbox", { name: "Notes" }).hasAttribute("data-autosize")).toBe(true);
    const source = readFileSync(join(import.meta.dirname, "Textarea.tsx"), "utf8");
    expect(source).not.toContain("scrollHeight");
  });

  it("mirrors Input value control semantics", () => {
    const onValueChange = vi.fn();
    const { Wrapper, getCommitCount } = createRenderCounter();

    render(
      <Wrapper>
        <Textarea defaultValue="" onValueChange={onValueChange} aria-label="Notes" />
      </Wrapper>,
    );

    const textarea = screen.getByRole("textbox", { name: "Notes" }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Line" } });
    expect(textarea.value).toBe("Line");
    expect(onValueChange).toHaveBeenCalledWith("Line");
    expect(getCommitCount()).toBe(1);
  });

  it("owns aria-invalid, data-autosize, data-disabled, data-readonly and data-invalid; consumer cannot override them", () => {
    render(
      <Textarea
        autoSize
        disabled
        readOnly
        invalid
        aria-invalid={false}
        data-autosize="no"
        data-disabled="no"
        data-readonly="no"
        data-invalid="no"
        aria-label="Notes"
      />,
    );
    const textarea = screen.getByRole("textbox", { name: "Notes" });
    expect(textarea.getAttribute("aria-invalid")).toBe("true");
    expect(textarea.getAttribute("data-autosize")).toBe("");
    expect(textarea.getAttribute("data-disabled")).toBe("");
    expect(textarea.getAttribute("data-readonly")).toBe("");
    expect(textarea.getAttribute("data-invalid")).toBe("");
  });

  it("forwards consumer styling props and owns its identity marker", () => {
    render(
      <Textarea
        aria-label="Notes"
        className="consumer-textarea"
        data-layout="compact"
        data-uiify-textarea="consumer-value"
        style={{ marginBlock: "1rem" }}
      />,
    );
    const textarea = screen.getByRole("textbox", { name: "Notes" });
    expect(textarea.getAttribute("class")).toBe("consumer-textarea");
    expect(textarea.getAttribute("data-layout")).toBe("compact");
    expect(textarea.getAttribute("data-uiify-textarea")).toBe("");
    expect(textarea.style.marginBlock).toBe("1rem");
  });

  it("lets a consumer onChange veto the internal value sync (policy #1: form-control change veto)", () => {
    const onValueChange = vi.fn();
    const consumerCalls: string[] = [];
    render(
      <Textarea
        defaultValue=""
        onValueChange={onValueChange}
        onChange={(event) => {
          consumerCalls.push("consumer");
          event.preventDefault();
        }}
        aria-label="Notes"
      />,
    );
    const textarea = screen.getByRole("textbox", { name: "Notes" }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Line" } });
    expect(consumerCalls).toEqual(["consumer"]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(<Textarea autoSize defaultValue="Hi" aria-label="Notes" />);
    expect(markup).toContain("data-autosize");
    expect(markup).toContain("Hi");
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { splitTags } from "./tags-input-store.js";
import { TagsInput } from "./TagsInput.js";

describe("tags-input-store", () => {
  it("splits pasted text on delimiters", () => {
    expect(splitTags("a,b,c", [","])).toEqual(["a", "b", "c"]);
    expect(splitTags("a\nb", ["\n"])).toEqual(["a", "b"]);
  });
});

describe("TagsInput", () => {
  it("renders the initial tags in the server output", () => {
    render(
      <TagsInput.Root defaultValue={["Design", "React"]}>
        <TagsInput.List>
          <TagsInput.Input placeholder="Add tag" />
        </TagsInput.List>
      </TagsInput.Root>,
    );

    expect(screen.getByText("Design")).toBeTruthy();
    expect(screen.getByText("React")).toBeTruthy();
  });

  it("adds a tag on Enter", () => {
    const onChange = vi.fn();
    render(
      <TagsInput.Root onChange={onChange}>
        <TagsInput.List>
          <TagsInput.Input placeholder="Add tag" />
        </TagsInput.List>
      </TagsInput.Root>,
    );

    const input = screen.getByPlaceholderText("Add tag");
    fireEvent.change(input, { target: { value: "react" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(["react"]);
  });

  it("removes the last tag on Backspace when input is empty", () => {
    const onChange = vi.fn();
    render(
      <TagsInput.Root defaultValue={["a", "b"]} onChange={onChange}>
        <TagsInput.List>
          <TagsInput.Input placeholder="Add tag" />
        </TagsInput.List>
      </TagsInput.Root>,
    );

    const input = screen.getByPlaceholderText("Add tag");
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith(["a"]);
  });

  it("dedupes tags by default", () => {
    const onChange = vi.fn();
    render(
      <TagsInput.Root onChange={onChange}>
        <TagsInput.Input placeholder="Add tag" />
      </TagsInput.Root>,
    );

    const input = screen.getByPlaceholderText("Add tag");
    fireEvent.change(input, { target: { value: "dup" } });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.change(input, { target: { value: "dup" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("respects maxTags", () => {
    const onChange = vi.fn();
    render(
      <TagsInput.Root maxTags={2} onChange={onChange}>
        <TagsInput.Input placeholder="Add tag" />
      </TagsInput.Root>,
    );

    const input = screen.getByPlaceholderText("Add tag");
    for (const tag of ["a", "b", "c"]) {
      fireEvent.change(input, { target: { value: tag } });
      fireEvent.keyDown(input, { key: "Enter" });
    }
    expect(onChange).toHaveBeenLastCalledWith(["a", "b"]);
  });

  it("rejects invalid tags via validate", () => {
    const onChange = vi.fn();
    render(
      <TagsInput.Root onChange={onChange} validate={(tag) => tag.length >= 3}>
        <TagsInput.Input placeholder="Add tag" />
      </TagsInput.Root>,
    );

    const input = screen.getByPlaceholderText("Add tag");
    fireEvent.change(input, { target: { value: "ab" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("splits pasted text", () => {
    const onChange = vi.fn();
    render(
      <TagsInput.Root onChange={onChange}>
        <TagsInput.Input placeholder="Add tag" />
      </TagsInput.Root>,
    );

    const input = screen.getByPlaceholderText("Add tag");
    fireEvent.paste(input, {
      clipboardData: { getData: () => "one,two" },
    });
    expect(onChange).toHaveBeenCalledWith(["one", "two"]);
  });

  it("owns Input's role, aria-controls, aria-expanded, and value regardless of consumer override", () => {
    render(
      <TagsInput.Root>
        <TagsInput.List>
          <TagsInput.Input
            placeholder="Add tag"
            role="textbox"
            aria-controls="bogus"
            aria-expanded="true"
            value="bogus"
          />
        </TagsInput.List>
      </TagsInput.Root>,
    );

    const input = screen.getByPlaceholderText("Add tag") as HTMLInputElement;
    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-controls")).not.toBe("bogus");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(input.value).toBe("");
  });

  it("lets a consumer onChange veto input sync, leaving the committed value unchanged (policy #1: form-control change veto)", () => {
    render(
      <TagsInput.Root>
        <TagsInput.Input placeholder="Add tag" onChange={(event) => event.preventDefault()} />
      </TagsInput.Root>,
    );

    const input = screen.getByPlaceholderText("Add tag") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "react" } });
    expect(input.value).toBe("");
  });

  it("lets a consumer onKeyDown veto Enter tag-commit without suppressing text entry", () => {
    const onChange = vi.fn();
    render(
      <TagsInput.Root onChange={onChange}>
        <TagsInput.Input
          placeholder="Add tag"
          onKeyDown={(event) => {
            if (event.key === "Enter") event.preventDefault();
          }}
        />
      </TagsInput.Root>,
    );

    const input = screen.getByPlaceholderText("Add tag") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "react" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
    expect(input.value).toBe("react");
  });

  it("lets a consumer onKeyDown veto Backspace tag-removal", () => {
    const onChange = vi.fn();
    render(
      <TagsInput.Root defaultValue={["a", "b"]} onChange={onChange}>
        <TagsInput.Input
          placeholder="Add tag"
          onKeyDown={(event) => {
            if (event.key === "Backspace") event.preventDefault();
          }}
        />
      </TagsInput.Root>,
    );

    fireEvent.keyDown(screen.getByPlaceholderText("Add tag"), { key: "Backspace" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("lets a consumer onPaste veto paste-splitting", () => {
    const onChange = vi.fn();
    render(
      <TagsInput.Root onChange={onChange}>
        <TagsInput.Input placeholder="Add tag" onPaste={(event) => event.preventDefault()} />
      </TagsInput.Root>,
    );

    fireEvent.paste(screen.getByPlaceholderText("Add tag"), {
      clipboardData: { getData: () => "one,two" },
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("owns Tag's role and data-value regardless of consumer override", () => {
    const { container } = render(
      <TagsInput.Root defaultValue={["react"]}>
        <TagsInput.List>
          <TagsInput.Tag
            index={0}
            value="react"
            role="button"
            data-value="bogus"
            data-testid="tag-react"
          >
            react
          </TagsInput.Tag>
        </TagsInput.List>
      </TagsInput.Root>,
    );

    const tag = container.querySelector("[data-testid='tag-react']");
    expect(tag?.getAttribute("role")).toBe("listitem");
    expect(tag?.getAttribute("data-value")).toBe("react");
  });

  it("lets a consumer onKeyDown veto Backspace/Delete tag removal without suppressing roving-focus arrow navigation (policy #2: roving-focus arrow-nav veto)", () => {
    const onChange = vi.fn();
    const { container } = render(
      <TagsInput.Root defaultValue={["alpha", "beta"]} onChange={onChange}>
        <TagsInput.List>
          <TagsInput.Tag
            index={0}
            value="alpha"
            data-testid="tag-alpha"
            onKeyDown={(event) => {
              if (event.key === "Backspace" || event.key === "Delete") event.preventDefault();
            }}
          >
            alpha
          </TagsInput.Tag>
          <TagsInput.Tag index={1} value="beta" data-testid="tag-beta">
            beta
          </TagsInput.Tag>
        </TagsInput.List>
      </TagsInput.Root>,
    );

    const alphaTag = container.querySelector("[data-testid='tag-alpha']") as HTMLElement;
    alphaTag.focus();
    fireEvent.keyDown(alphaTag, { key: "Backspace" });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.keyDown(alphaTag, { key: "ArrowRight" });
    const betaTag = container.querySelector("[data-testid='tag-beta']");
    expect(document.activeElement).toBe(betaTag);
  });
});

import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Portal } from "./portal.js";

describe("Portal", () => {
  it("mounts into the default document body after the layout effect", () => {
    render(
      <Portal>
        <span>Portaled</span>
      </Portal>,
    );
    expect(screen.getByText("Portaled").parentElement).toBe(document.body);
  });

  it("supports a lazy custom container", () => {
    const container = document.createElement("section");
    document.body.append(container);
    render(<Portal container={() => container}>Custom portal</Portal>);
    expect(container.textContent).toBe("Custom portal");
  });

  it("supports a document fragment", () => {
    const fragment = document.createDocumentFragment();
    render(<Portal container={fragment}>Fragment portal</Portal>);
    expect(fragment.textContent).toBe("Fragment portal");
  });

  it("renders no server markup", () => {
    expect(renderToString(<Portal>Server portal</Portal>)).toBe("");
  });
});

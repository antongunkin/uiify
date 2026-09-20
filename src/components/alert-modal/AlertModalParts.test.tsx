import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  AlertModalAction,
  AlertModalCancel,
  AlertModalContent,
  AlertModalTrigger,
} from "./AlertModalParts.js";

describe("AlertModal native parts", () => {
  it("renders an alertdialog opened by show-modal and closed by request-close", () => {
    const html = renderToStaticMarkup(
      <>
        <AlertModalTrigger target="delete">Delete</AlertModalTrigger>
        <AlertModalContent aria-labelledby="delete-title" id="delete">
          <h2 id="delete-title">Delete item?</h2>
          <AlertModalCancel target="delete" value="cancel">
            Cancel
          </AlertModalCancel>
          <AlertModalAction target="delete" value="confirm">
            Confirm
          </AlertModalAction>
        </AlertModalContent>
      </>,
    );

    expect(html).toContain('command="show-modal"');
    expect(html).toContain('commandfor="delete"');
    expect(html).toContain('role="alertdialog"');
    expect(html).toContain('data-uiify-alert-dialog-content=""');
    expect(html).toContain('value="cancel"');
    expect(html).toContain('value="confirm"');
    expect((html.match(/command="request-close"/g) ?? []).length).toBe(2);
    expect(html).not.toContain("popover=");
    expect(html).not.toContain("<form");
  });

  it("forwards refs and marks each part", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <AlertModalAction ref={ref} target="delete">
        Confirm
      </AlertModalAction>,
    );
    const button = screen.getByRole("button", { name: "Confirm" });
    expect(ref.current).toBe(button);
    expect(button.hasAttribute("data-uiify-alert-dialog-action")).toBe(true);
    expect(button.getAttribute("type")).toBe("button");
  });
});

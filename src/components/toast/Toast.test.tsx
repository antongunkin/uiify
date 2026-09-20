import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from "./ToastElements.js";

const Toast = {
  Action: ToastAction,
  Close: ToastClose,
  Description: ToastDescription,
  Provider: ToastProvider,
  Root: ToastRoot,
  Title: ToastTitle,
  Viewport: ToastViewport,
};

describe("Toast server shell", () => {
  it("renders authored toast markup inside the viewport without live announcers", () => {
    render(
      <Toast.Provider>
        <Toast.Viewport>
          <Toast.Root
            toast={{
              id: "saved",
              duration: 4000,
              priority: "polite",
              title: "Saved",
              description: "Profile updated",
              action: {
                label: "Undo",
                onClick: vi.fn(),
              },
            }}
          />
        </Toast.Viewport>
      </Toast.Provider>,
    );

    expect(screen.getByRole("region", { name: "Notifications" })).toBeTruthy();
    expect(screen.getByText("Saved")).toBeTruthy();
    expect(screen.getByText("Profile updated")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();
    expect(document.querySelector("[aria-live='polite']")).toBeNull();
    expect(document.querySelector("[aria-live='assertive']")).toBeNull();
  });

  it("renders static SSR markup for server-authored toasts", () => {
    const markup = renderToStaticMarkup(
      <Toast.Provider>
        <Toast.Viewport>
          <Toast.Root
            toast={{
              id: "saved",
              duration: 0,
              priority: "assertive",
              title: "Saved",
              description: "Profile updated",
            }}
          />
        </Toast.Viewport>
      </Toast.Provider>,
    );

    expect(markup).toContain("<section");
    expect(markup).toContain("Saved");
    expect(markup).toContain("Profile updated");
    expect(markup).not.toContain("aria-live");
  });

  it("owns ToastClose's computed aria-label and does not let a consumer override it with string children", () => {
    render(<Toast.Close aria-label="consumer-label">Dismiss</Toast.Close>);
    const button = screen.getByRole("button", { name: "Dismiss" });
    expect(button.getAttribute("aria-label")).toBe("Dismiss");
  });

  it("falls back to the default 'Close' aria-label on non-string children, ignoring a consumer override", () => {
    render(
      <Toast.Close aria-label="consumer-label">
        <span aria-hidden="true">x</span>
      </Toast.Close>,
    );
    const button = screen.getByRole("button", { name: "Close" });
    expect(button.getAttribute("aria-label")).toBe("Close");
  });
});

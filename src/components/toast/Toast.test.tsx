import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { ToastClose, ToastProvider, Toast, ToastViewport } from "./ToastElements.js";

describe("Toast server shell", () => {
  it("renders authored toast markup inside the viewport without live announcers", () => {
    render(
      <ToastProvider>
        <ToastViewport slotProps={{ item: { className: "client-generated-card" } }}>
          <Toast
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
        </ToastViewport>
      </ToastProvider>,
    );

    expect(screen.getByRole("region", { name: "Notifications" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Notifications" }).hasAttribute("slotprops")).toBe(
      false,
    );
    expect(screen.getByText("Saved")).toBeTruthy();
    expect(screen.getByText("Profile updated")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();
    expect(screen.getByText("Saved").classList.contains("uiify-toast-title")).toBe(true);
    expect(screen.getByText("Profile updated").classList.contains("uiify-toast-description")).toBe(
      true,
    );
    expect(
      screen.getByRole("button", { name: "Undo" }).classList.contains("uiify-toast-action"),
    ).toBe(true);
    expect(
      screen.getByRole("button", { name: "Close" }).classList.contains("uiify-toast-close"),
    ).toBe(true);
    expect(document.querySelector("[aria-live='polite']")).toBeNull();
    expect(document.querySelector("[aria-live='assertive']")).toBeNull();
  });

  it("renders static SSR markup for server-authored toasts", () => {
    const markup = renderToStaticMarkup(
      <ToastProvider>
        <ToastViewport>
          <Toast
            toast={{
              id: "saved",
              duration: 0,
              priority: "assertive",
              title: "Saved",
              description: "Profile updated",
            }}
          />
        </ToastViewport>
      </ToastProvider>,
    );

    expect(markup).toContain("<section");
    expect(markup).toContain("Saved");
    expect(markup).toContain("Profile updated");
    expect(markup).not.toContain("aria-live");
  });

  it("forwards slot props and consumer marker overrides to server-authored toast nodes", () => {
    render(
      <Toast
        toast={{
          id: "static-toast",
          duration: 0,
          priority: "polite",
          title: "Static toast",
          description: "Static description",
          action: { label: "Undo", onClick: vi.fn() },
        }}
        className="static-item"
        style={{ order: 2 }}
        data-testid="static-item"
        data-part="consumer-override"
        slotProps={{
          title: {
            className: "static-title-common",
            byItemValue: {
              "static-toast": { className: "static-title", "data-testid": "static-title" },
            },
          },
          description: { "data-testid": "static-description" },
          action: { "data-testid": "static-action" },
          close: { "data-testid": "static-close" },
        }}
      />,
    );

    expect(screen.getByTestId("static-item").getAttribute("data-part")).toBe("consumer-override");
    expect(screen.getByTestId("static-item").className).toContain("static-item");
    expect(screen.getByTestId("static-item").getAttribute("style")).toContain("order: 2");
    expect(screen.getByTestId("static-title").className).toContain(
      "static-title-common static-title",
    );
    expect(screen.getByTestId("static-description")).toBeTruthy();
    expect(screen.getByTestId("static-action")).toBeTruthy();
    expect(screen.getByTestId("static-close")).toBeTruthy();
  });

  it("allows localized labels while keeping explicit viewport labels and toast titles ahead", () => {
    render(
      <ToastViewport
        aria-label="Alertes"
        labels={{
          region: "Notifications traduites",
          notification: "Notification traduite",
          close: "Fermer",
        }}
      >
        <Toast
          labels={{ notification: "Notification traduite", close: "Fermer" }}
          toast={{ id: "untitled", duration: 0, priority: "polite" }}
        />
        <Toast
          labels={{ notification: "Notification traduite", close: "Fermer" }}
          toast={{ id: "titled", duration: 0, priority: "polite", title: "Saved" }}
        />
      </ToastViewport>,
    );
    expect(screen.getByRole("region", { name: "Alertes" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Notification traduite" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Saved" })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Fermer" })).toHaveLength(2);
  });

  it("lets consumers replace ToastClose's computed aria-label", () => {
    render(<ToastClose aria-label="consumer-label">Dismiss</ToastClose>);
    const button = screen.getByRole("button", { name: "consumer-label" });
    expect(button.getAttribute("aria-label")).toBe("consumer-label");
  });

  it("lets consumers replace the fallback close label with non-string children", () => {
    render(
      <ToastClose aria-label="consumer-label">
        <span aria-hidden="true">x</span>
      </ToastClose>,
    );
    const button = screen.getByRole("button", { name: "consumer-label" });
    expect(button.getAttribute("aria-label")).toBe("consumer-label");
  });
});

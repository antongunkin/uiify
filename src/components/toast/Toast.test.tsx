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
        <Toast.Viewport slotProps={{ item: { className: "client-generated-card" } }}>
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
    expect(screen.getByRole("region", { name: "Notifications" }).hasAttribute("slotprops")).toBe(
      false,
    );
    expect(screen.getByText("Saved")).toBeTruthy();
    expect(screen.getByText("Profile updated")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();
    expect(screen.getByText("Saved").getAttribute("data-part")).toBe("title");
    expect(screen.getByText("Profile updated").getAttribute("data-part")).toBe("description");
    expect(screen.getByRole("button", { name: "Undo" }).getAttribute("data-part")).toBe("action");
    expect(screen.getByRole("button", { name: "Close" }).getAttribute("data-part")).toBe("close");
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

  it("forwards slot props to server-authored toast nodes and protects owned markers", () => {
    const unsafeRootProps = {
      dangerouslySetInnerHTML: { __html: "<b>unsafe root</b>" },
    } as unknown as Parameters<typeof Toast.Root>[0];
    render(
      <Toast.Root
        {...unsafeRootProps}
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
        data-part={"consumer-override" as never}
        slotProps={
          {
            title: {
              className: "static-title-common",
              dangerouslySetInnerHTML: { __html: "<b>unsafe title</b>" },
              byItemValue: {
                "static-toast": { className: "static-title", "data-testid": "static-title" },
              },
            },
            description: { "data-testid": "static-description" },
            action: { "data-testid": "static-action" },
            close: { "data-testid": "static-close" },
          } as never
        }
      />,
    );

    expect(screen.getByTestId("static-item").getAttribute("data-part")).toBe("item");
    expect(screen.getByTestId("static-item").className).toBe("static-item");
    expect(screen.getByTestId("static-item").getAttribute("style")).toContain("order: 2");
    expect(screen.getByTestId("static-title").className).toBe("static-title-common static-title");
    expect(screen.getByTestId("static-description")).toBeTruthy();
    expect(screen.getByTestId("static-action")).toBeTruthy();
    expect(screen.getByTestId("static-close")).toBeTruthy();
  });

  it("allows localized labels while keeping explicit viewport labels and toast titles ahead", () => {
    render(
      <Toast.Viewport
        aria-label="Alertes"
        labels={{
          region: "Notifications traduites",
          notification: "Notification traduite",
          close: "Fermer",
        }}
      >
        <Toast.Root
          labels={{ notification: "Notification traduite", close: "Fermer" }}
          toast={{ id: "untitled", duration: 0, priority: "polite" }}
        />
        <Toast.Root
          labels={{ notification: "Notification traduite", close: "Fermer" }}
          toast={{ id: "titled", duration: 0, priority: "polite", title: "Saved" }}
        />
      </Toast.Viewport>,
    );
    expect(screen.getByRole("region", { name: "Alertes" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Notification traduite" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Saved" })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Fermer" })).toHaveLength(2);
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

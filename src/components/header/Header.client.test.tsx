import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "./Header.js";
import { installDialogPrototypePatch, patchDialogElements } from "./test-utils.js";
import type { HeaderMobileMode } from "./types.js";

beforeAll(() => {
  installDialogPrototypePatch();
});

beforeEach(() => {
  patchDialogElements();
  document.documentElement.style.overflow = "";
});

function renderHeader(
  mobileMode: HeaderMobileMode,
  rootProps: Omit<ComponentProps<typeof Header.Root>, "mobileMode"> = {},
) {
  return render(
    <Header.Root mobileMode={mobileMode} {...rootProps}>
      <Header.Toggle />
      <Header.MobileNav {...(mobileMode === "collapse" ? { forceMount: true } : {})}>
        <a href="/docs">Docs</a>
      </Header.MobileNav>
    </Header.Root>,
  );
}

describe("Header client behavior", () => {
  it("defaults closeOnSelect to false for mobileMode=none", () => {
    const onOpenChange = vi.fn();
    render(
      <Header.Root mobileMode="none" defaultOpen onOpenChange={onOpenChange}>
        <Header.MobileNav>
          <a href="/docs">Docs</a>
        </Header.MobileNav>
      </Header.Root>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Docs" }));

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("respects closeOnSelect=false", () => {
    const onOpenChange = vi.fn();
    render(
      <Header.Root
        mobileMode="collapse"
        defaultOpen
        closeOnSelect={false}
        onOpenChange={onOpenChange}
      >
        <Header.MobileNav forceMount>
          <a href="/docs">Docs</a>
        </Header.MobileNav>
      </Header.Root>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Docs" }));

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("closes collapse navigation from a button", () => {
    const onOpenChange = vi.fn();
    render(
      <Header.Root mobileMode="collapse" defaultOpen onOpenChange={onOpenChange}>
        <Header.MobileNav forceMount>
          <Header.Close>Dismiss</Header.Close>
        </Header.MobileNav>
      </Header.Root>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("delegates to Drawer.Close in drawer mode", () => {
    const onOpenChange = vi.fn();
    render(
      <Header.Root mobileMode="drawer" defaultOpen onOpenChange={onOpenChange}>
        <Header.MobileNav>
          <Header.Close>Close menu</Header.Close>
        </Header.MobileNav>
      </Header.Root>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Close menu", hidden: true }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("supports controlled open state", () => {
    const onOpenChange = vi.fn();
    renderHeader("collapse", { open: false, onOpenChange });

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("closes drawer on Escape and restores focus to toggle", async () => {
    const onOpenChange = vi.fn();
    renderHeader("drawer", { defaultOpen: true, onOpenChange });
    const toggle = screen.getByRole("button", { name: "Close navigation" });
    toggle.focus();

    fireEvent(
      screen.getByRole("dialog", { hidden: true }),
      new Event("cancel", { bubbles: false, cancelable: true }),
    );

    await waitFor(() => expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false));
    await waitFor(() => expect(document.activeElement).toBe(toggle));
  });

  it("closes mobile nav when a link is selected and closeOnSelect=true", () => {
    const onOpenChange = vi.fn();
    renderHeader("collapse", { defaultOpen: true, onOpenChange });

    fireEvent.click(screen.getByRole("link", { name: "Docs" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

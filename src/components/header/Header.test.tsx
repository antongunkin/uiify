import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { Header, type HeaderMobileMode, type HeaderPlacement } from "./Header.js";
import { installDialogPrototypePatch, patchDialogElements } from "./test-utils.js";
import type { HeaderBehavior } from "./types.js";

const placements = ["static", "sticky", "fixed"] as const satisfies readonly HeaderPlacement[];
const behaviors = [
  "none",
  "elevate-on-scroll",
  "solid-on-scroll",
  "hide-on-scroll-down",
] as const satisfies readonly HeaderBehavior[];
const mobileModes = [
  "none",
  "collapse",
  "drawer",
  "sheet",
  "fullscreen",
] as const satisfies readonly HeaderMobileMode[];

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

describe("Header.Root", () => {
  it.each(placements)("sets data-placement=%s", (placement) => {
    render(
      <Header.Root data-testid="root" placement={placement}>
        <Header.Toggle />
      </Header.Root>,
    );
    expect(screen.getByTestId("root").getAttribute("data-placement")).toBe(placement);
  });

  it.each(behaviors)("sets data-behavior=%s", (behavior) => {
    render(
      <Header.Root data-testid="root" behavior={behavior}>
        <Header.Toggle />
      </Header.Root>,
    );
    expect(screen.getByTestId("root").getAttribute("data-behavior")).toBe(behavior);
  });

  it.each(mobileModes)("sets data-mobile-mode=%s", (mobileMode) => {
    render(
      <Header.Root data-testid="root" mobileMode={mobileMode}>
        <Header.Toggle />
        {mobileMode !== "none" ? (
          <Header.MobileNav {...(mobileMode === "collapse" ? { forceMount: true } : {})}>
            <a href="/docs">Docs</a>
          </Header.MobileNav>
        ) : null}
      </Header.Root>,
    );
    expect(screen.getByTestId("root").getAttribute("data-mobile-mode")).toBe(mobileMode);
  });

  it("sets data-scrolled when scrolled prop is true", () => {
    render(
      <Header.Root data-testid="root" scrolled>
        <Header.Toggle />
      </Header.Root>,
    );
    expect(screen.getByTestId("root").getAttribute("data-scrolled")).toBe("");
  });

  it("sets data-hidden when hidden prop is true", () => {
    render(
      <Header.Root data-testid="root" hidden>
        <Header.Toggle />
      </Header.Root>,
    );
    expect(screen.getByTestId("root").getAttribute("data-hidden")).toBe("");
  });

  it("sets data-open when mobile navigation is open", () => {
    render(
      <Header.Root mobileMode="collapse" defaultOpen data-testid="root">
        <Header.Toggle />
        <Header.MobileNav forceMount>
          <a href="/docs">Docs</a>
        </Header.MobileNav>
      </Header.Root>,
    );
    expect(screen.getByTestId("root").getAttribute("data-open")).toBe("");
  });

  it("forwards consumer HTML attributes", () => {
    render(
      <Header.Root className="custom-root" data-testid="root">
        <Header.Toggle />
      </Header.Root>,
    );
    const root = screen.getByTestId("root");
    expect(root.className).toContain("custom-root");
  });

  it("defaults modal to true for drawer modes", () => {
    renderHeader("drawer", { defaultOpen: true });
    expect(document.documentElement.style.overflow).toBe("hidden");
  });

  it("respects modal=false for drawer modes", () => {
    renderHeader("drawer", { defaultOpen: true, modal: false });
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("respects lockScroll=false via data-lock-scroll attribute", () => {
    render(
      <Header.Root data-testid="root" mobileMode="drawer" defaultOpen modal lockScroll={false}>
        <Header.Toggle />
        <Header.MobileNav>
          <a href="/docs">Docs</a>
        </Header.MobileNav>
      </Header.Root>,
    );
    expect(screen.getByTestId("root").getAttribute("data-lock-scroll")).toBeNull();
  });

  it("sets data-lock-scroll only when modal drawer is open and lockScroll is enabled", () => {
    const { rerender } = render(
      <Header.Root data-testid="root" mobileMode="drawer" defaultOpen modal lockScroll>
        <Header.Toggle />
        <Header.MobileNav>
          <a href="/docs">Docs</a>
        </Header.MobileNav>
      </Header.Root>,
    );
    expect(screen.getByTestId("root").getAttribute("data-lock-scroll")).toBe("");

    rerender(
      <Header.Root data-testid="root" mobileMode="drawer" open={false} modal lockScroll>
        <Header.Toggle />
        <Header.MobileNav>
          <a href="/docs">Docs</a>
        </Header.MobileNav>
      </Header.Root>,
    );
    expect(screen.getByTestId("root").getAttribute("data-lock-scroll")).toBeNull();
  });
});

describe("Header.Toggle", () => {
  it("uses default open and close labels", () => {
    renderHeader("collapse");
    expect(screen.getByRole("button", { name: "Open navigation" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(screen.getByRole("button", { name: "Close navigation" })).toBeTruthy();
  });

  it("respects openLabel and closeLabel", () => {
    render(
      <Header.Root mobileMode="collapse" defaultOpen>
        <Header.Toggle openLabel="Show menu" closeLabel="Hide menu" />
      </Header.Root>,
    );
    expect(screen.getByRole("button", { name: "Hide menu" })).toBeTruthy();
  });

  it("forwards onClick after toggling", () => {
    const onClick = vi.fn();
    render(
      <Header.Root mobileMode="collapse" defaultOpen>
        <Header.Toggle onClick={onClick} />
      </Header.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Close navigation" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("sets aria-haspopup=dialog only for drawer, sheet, and fullscreen", () => {
    for (const mode of ["drawer", "sheet", "fullscreen"] as const) {
      const { unmount } = render(
        <Header.Root mobileMode={mode}>
          <Header.Toggle />
        </Header.Root>,
      );
      expect(screen.getByRole("button").getAttribute("aria-haspopup")).toBe("dialog");
      unmount();
    }
    render(
      <Header.Root mobileMode="collapse">
        <Header.Toggle />
      </Header.Root>,
    );
    expect(screen.getByRole("button").getAttribute("aria-haspopup")).toBeNull();
  });

  it("throws outside Header.Root", () => {
    expect(() => render(<Header.Toggle />)).toThrow(
      /Header\.Toggle must be used within Header\.Root/,
    );
  });

  it("runs the internal toggle before the consumer onClick and ignores its preventDefault (policy #8: reversed-order, no-veto composition)", () => {
    const calls: string[] = [];
    render(
      <Header.Root
        mobileMode="collapse"
        defaultOpen={false}
        onOpenChange={() => calls.push("internal")}
      >
        <Header.Toggle
          onClick={(event) => {
            event.preventDefault();
            calls.push("consumer");
          }}
        />
      </Header.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(calls).toEqual(["internal", "consumer"]);
    expect(screen.getByRole("button", { name: "Close navigation" })).toBeTruthy();
  });
});

describe("Header.MobileNav", () => {
  it("renders a nav landmark in none mode", () => {
    render(
      <Header.Root mobileMode="none">
        <Header.MobileNav aria-label="Primary">
          <a href="/docs">Docs</a>
        </Header.MobileNav>
      </Header.Root>,
    );
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeTruthy();
  });

  it("forwards onClick on mobile nav", () => {
    const onClick = vi.fn();
    render(
      <Header.Root mobileMode="none">
        <Header.MobileNav aria-label="Mobile" onClick={onClick}>
          <span>Surface</span>
        </Header.MobileNav>
      </Header.Root>,
    );
    fireEvent.click(screen.getByText("Surface"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("uses Drawer.Content for drawer mode with left side", () => {
    renderHeader("drawer", { defaultOpen: true });
    expect(screen.getByRole("dialog", { hidden: true }).getAttribute("data-side")).toBe("left");
  });

  it("uses Drawer.Content with bottom side for sheet mode", () => {
    renderHeader("sheet", { defaultOpen: true });
    expect(screen.getByRole("dialog", { hidden: true }).getAttribute("data-side")).toBe("bottom");
  });

  it("sets data-mobile-mode on nav for drawer modes", () => {
    renderHeader("fullscreen", { defaultOpen: true });
    expect(screen.getByRole("navigation", { hidden: true }).getAttribute("data-mobile-mode")).toBe(
      "fullscreen",
    );
  });

  it("throws outside Header.Root", () => {
    expect(() =>
      render(
        <Header.MobileNav>
          <a href="/docs">Docs</a>
        </Header.MobileNav>,
      ),
    ).toThrow(/Header\.MobileNav must be used within Header\.Root/);
  });

  it("runs the internal close-on-select before the consumer onClick and ignores its preventDefault (policy #8: reversed-order, no-veto composition)", () => {
    const calls: string[] = [];
    render(
      <Header.Root mobileMode="collapse" defaultOpen onOpenChange={() => calls.push("internal")}>
        <Header.Toggle />
        <Header.MobileNav
          forceMount
          onClick={(event) => {
            event.preventDefault();
            calls.push("consumer");
          }}
        >
          <a href="/docs">Docs</a>
        </Header.MobileNav>
      </Header.Root>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Docs" }));
    expect(calls).toEqual(["internal", "consumer"]);
    expect(screen.getByRole("navigation", { hidden: true }).getAttribute("hidden")).toBe("");
  });
});

describe("Header.Close", () => {
  it("forwards onClick in collapse mode", () => {
    const onClick = vi.fn();
    render(
      <Header.Root mobileMode="collapse" defaultOpen>
        <Header.MobileNav forceMount>
          <Header.Close onClick={onClick}>Dismiss</Header.Close>
        </Header.MobileNav>
      </Header.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("runs the internal close before the consumer onClick and ignores its preventDefault (policy #8: reversed-order, no-veto composition)", () => {
    const calls: string[] = [];
    render(
      <Header.Root mobileMode="collapse" defaultOpen onOpenChange={() => calls.push("internal")}>
        <Header.MobileNav forceMount>
          <Header.Close
            onClick={(event) => {
              event.preventDefault();
              calls.push("consumer");
            }}
          >
            Dismiss
          </Header.Close>
        </Header.MobileNav>
      </Header.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(calls).toEqual(["internal", "consumer"]);
    expect(screen.getByRole("navigation", { hidden: true }).getAttribute("hidden")).toBe("");
  });
});

describe("Header interactions", () => {
  it("supports uncontrolled open state", () => {
    renderHeader("collapse", { defaultOpen: false });
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(screen.getByRole("navigation").getAttribute("hidden")).toBeNull();
  });

  it("wires toggle aria-controls to mobile nav id when drawer is closed", () => {
    renderHeader("drawer");
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    const nav = screen.getByRole("navigation", { hidden: true });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(toggle.getAttribute("aria-controls")).toBe(nav.id);
  });

  it("keeps toggle aria-controls for closed collapse navigation so the nav stays addressable", () => {
    renderHeader("collapse", { defaultOpen: false });
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    expect(toggle.getAttribute("aria-controls")).toBeTruthy();
  });

  it("does not lock scroll in collapse mode", () => {
    renderHeader("collapse", { defaultOpen: true });
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("closes drawer on Escape and restores focus to toggle", async () => {
    renderHeader("drawer", { defaultOpen: true });
    const toggle = screen.getByRole("button", { name: "Close navigation" });
    toggle.focus();
    fireEvent(
      screen.getByRole("dialog", { hidden: true }),
      new Event("cancel", { bubbles: false, cancelable: true }),
    );
    await waitFor(() => expect(toggle.getAttribute("aria-expanded")).toBe("false"));
    await waitFor(() => expect(document.activeElement).toBe(toggle));
  });

  it("closes mobile nav when a link is selected and closeOnSelect=true", () => {
    renderHeader("collapse", { defaultOpen: true });
    fireEvent.click(screen.getByRole("link", { name: "Docs" }));
    expect(screen.getByRole("navigation", { hidden: true }).getAttribute("hidden")).toBe("");
  });

  it("SSR renders without throwing", () => {
    const html = assertSSRRenderable(
      <Header.Root mobileMode="drawer">
        <header>
          <Header.Toggle />
          <Header.MobileNav>
            <a href="/docs">Docs</a>
          </Header.MobileNav>
        </header>
      </Header.Root>,
    );
    expect(html).toContain("Open navigation");
    expect(html).toContain("<dialog");
  });
});

describe("Header.Root compound — props ownership", () => {
  it("owns HeaderRoot's data-* attributes even when a consumer tries to override them", () => {
    render(
      <Header.Root
        data-testid="root"
        behavior="solid-on-scroll"
        placement="fixed"
        scrolled
        hidden
        data-behavior="fake"
        data-placement="fake"
        data-scrolled="fake"
        data-hidden="fake"
        data-mobile-mode="fake"
        data-open="fake"
      >
        <Header.Toggle />
      </Header.Root>,
    );
    const root = screen.getByTestId("root");
    expect(root.getAttribute("data-behavior")).toBe("solid-on-scroll");
    expect(root.getAttribute("data-placement")).toBe("fixed");
    expect(root.getAttribute("data-scrolled")).toBe("");
    expect(root.getAttribute("data-hidden")).toBe("");
    expect(root.getAttribute("data-mobile-mode")).toBe("none");
    expect(root.getAttribute("data-open")).toBeNull();
  });

  it("owns HeaderRoot's data-lock-scroll even when a consumer tries to override it", () => {
    render(
      <Header.Root
        data-testid="root"
        mobileMode="drawer"
        defaultOpen
        modal
        lockScroll
        data-lock-scroll="fake"
      >
        <Header.Toggle />
        <Header.MobileNav>
          <a href="/docs">Docs</a>
        </Header.MobileNav>
      </Header.Root>,
    );
    expect(screen.getByTestId("root").getAttribute("data-lock-scroll")).toBe("");
  });
});

describe("Header.Toggle compound — props ownership", () => {
  it("owns type/aria-haspopup/aria-label/id/aria-controls/aria-expanded even when a consumer tries to override them", () => {
    render(
      <Header.Root mobileMode="drawer" defaultOpen={false}>
        <Header.Toggle
          type="submit"
          aria-haspopup="menu"
          aria-label="Fake label"
          id="fake-id"
          aria-controls="fake-controls"
          aria-expanded
        />
      </Header.Root>,
    );
    const toggle = screen.getByRole("button");
    expect(toggle.getAttribute("type")).toBe("button");
    expect(toggle.getAttribute("aria-haspopup")).toBe("dialog");
    expect(toggle.getAttribute("aria-label")).toBe("Open navigation");
    expect(toggle.id).not.toBe("fake-id");
    expect(toggle.getAttribute("aria-controls")).not.toBe("fake-controls");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("Header.MobileNav compound — props ownership", () => {
  it("owns aria-hidden/hidden/data-mobile-mode/data-open in collapse mode even when a consumer tries to override them", () => {
    render(
      <Header.Root mobileMode="collapse" defaultOpen={false}>
        <Header.Toggle />
        <Header.MobileNav
          forceMount
          aria-hidden={false}
          hidden={false}
          data-mobile-mode="fake"
          data-open="fake"
        >
          <a href="/docs">Docs</a>
        </Header.MobileNav>
      </Header.Root>,
    );
    const nav = screen.getByRole("navigation", { hidden: true });
    expect(nav.getAttribute("aria-hidden")).toBe("true");
    expect(nav.getAttribute("hidden")).toBe("");
    expect(nav.getAttribute("data-mobile-mode")).toBe("collapse");
    expect(nav.getAttribute("data-open")).toBeNull();
  });

  it("owns data-mobile-mode/data-open in drawer mode even when a consumer tries to override them", () => {
    render(
      <Header.Root mobileMode="drawer" defaultOpen>
        <Header.Toggle />
        <Header.MobileNav data-mobile-mode="fake" data-open="fake">
          <a href="/docs">Docs</a>
        </Header.MobileNav>
      </Header.Root>,
    );
    const nav = screen.getByRole("navigation", { hidden: true });
    expect(nav.getAttribute("data-mobile-mode")).toBe("drawer");
    expect(nav.getAttribute("data-open")).toBe("");
  });
});

describe("Header compound export", () => {
  it("exposes Root, Toggle, MobileNav, and Close", () => {
    expect(Header.Root).toBeTypeOf("function");
    expect(Header.Toggle).toBeTypeOf("function");
    expect(Header.MobileNav).toBeTypeOf("function");
    expect(Header.Close).toBeTypeOf("function");
  });
});

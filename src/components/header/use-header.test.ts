import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useHeader, type HeaderMobileMode } from "./use-header.js";

const mobileModes = [
  "none",
  "collapse",
  "drawer",
  "sheet",
  "fullscreen",
] as const satisfies readonly HeaderMobileMode[];

describe("useHeader", () => {
  it("defaults open to false", () => {
    const { result } = renderHook(() => useHeader());
    expect(result.current.open).toBe(false);
  });

  it("defaults closeOnSelect to true", () => {
    const { result } = renderHook(() => useHeader());
    expect(result.current.closeOnSelect).toBe(true);
  });

  it("defaults mobileMode to none", () => {
    const { result } = renderHook(() => useHeader());
    expect(result.current.mobileMode).toBe("none");
  });

  it("respects defaultOpen", () => {
    const { result } = renderHook(() => useHeader({ defaultOpen: true }));
    expect(result.current.open).toBe(true);
  });

  it("respects controlled open", () => {
    const { result, rerender } = renderHook(({ open }) => useHeader({ open }), {
      initialProps: { open: false },
    });
    expect(result.current.open).toBe(false);
    rerender({ open: true });
    expect(result.current.open).toBe(true);
  });

  it("calls onOpenChange from setOpen", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useHeader({ onOpenChange }));
    act(() => result.current.setOpen(true));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calls onOpenChange from toggle", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useHeader({ onOpenChange }));
    act(() => result.current.toggle());
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calls onOpenChange from close", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useHeader({ defaultOpen: true, onOpenChange }));
    act(() => result.current.close());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("respects closeOnSelect=false", () => {
    const { result } = renderHook(() => useHeader({ closeOnSelect: false }));
    expect(result.current.closeOnSelect).toBe(false);
  });

  it.each(mobileModes)("reflects mobileMode=%s", (mobileMode) => {
    const { result } = renderHook(() => useHeader({ mobileMode }));
    expect(result.current.mobileMode).toBe(mobileMode);
  });

  it("getToggleProps wires aria-controls to navId and aria-expanded to open", () => {
    const { result } = renderHook(() => useHeader({ defaultOpen: true, mobileMode: "drawer" }));
    const props = result.current.getToggleProps({
      type: "button",
    } as ButtonHTMLAttributes<HTMLButtonElement>);
    expect(props.id).toBe(result.current.toggleId);
    expect(props["aria-controls"]).toBe(result.current.navId);
    expect(props["aria-expanded"]).toBe(true);
  });

  it("omits aria-controls when mobileMode is none", () => {
    const { result } = renderHook(() => useHeader({ mobileMode: "none" }));
    const props = result.current.getToggleProps({
      type: "button",
    } as ButtonHTMLAttributes<HTMLButtonElement>);
    expect(props["aria-controls"]).toBeUndefined();
  });

  it("keeps aria-controls for closed collapse navigation so the nav stays addressable", () => {
    const { result } = renderHook(() => useHeader({ mobileMode: "collapse", defaultOpen: false }));
    const props = result.current.getToggleProps({
      type: "button",
    } as ButtonHTMLAttributes<HTMLButtonElement>);
    expect(props["aria-controls"]).toBe(result.current.navId);
  });

  it("getMobileNavProps assigns nav id", () => {
    const { result } = renderHook(() => useHeader());
    const props = result.current.getMobileNavProps({
      "aria-label": "Mobile",
    } as HTMLAttributes<HTMLElement>);
    expect(props.id).toBe(result.current.navId);
    expect(props["aria-label"]).toBe("Mobile");
  });

  it("merges consumer props in getToggleProps and getMobileNavProps", () => {
    const { result } = renderHook(() => useHeader());
    expect(
      result.current.getToggleProps({
        className: "toggle",
      } as ButtonHTMLAttributes<HTMLButtonElement>).className,
    ).toBe("toggle");
    expect(
      result.current.getMobileNavProps({
        className: "nav",
      } as HTMLAttributes<HTMLElement>).className,
    ).toBe("nav");
  });
});

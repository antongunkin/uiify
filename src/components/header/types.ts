import type { ButtonHTMLAttributes, HTMLAttributes, Ref, RefObject } from "react";

export type HeaderBehavior =
  | "none"
  | "elevate-on-scroll"
  | "solid-on-scroll"
  | "hide-on-scroll-down";

export type HeaderMobileMode = "none" | "collapse" | "drawer" | "sheet" | "fullscreen";

export type HeaderPlacement = "static" | "sticky" | "fixed";

export interface UseHeaderOptions {
  readonly closeOnSelect?: boolean;
  readonly defaultOpen?: boolean;
  readonly mobileMode?: HeaderMobileMode;
  readonly onOpenChange?: (open: boolean) => void;
  readonly open?: boolean;
}

export interface UseHeaderReturn {
  readonly close: () => void;
  readonly closeOnSelect: boolean;
  readonly getMobileNavProps: <T extends HTMLAttributes<HTMLElement>>(props?: T) => T;
  readonly getToggleProps: <T extends ButtonHTMLAttributes<HTMLButtonElement>>(props?: T) => T;
  readonly mobileMode: HeaderMobileMode;
  readonly navId: string;
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
  readonly toggle: () => void;
  readonly toggleId: string;
}

export interface HeaderRootProps extends HTMLAttributes<HTMLDivElement> {
  readonly behavior?: HeaderBehavior;
  readonly closeOnSelect?: boolean;
  readonly defaultOpen?: boolean;
  readonly hidden?: boolean;
  readonly lockScroll?: boolean;
  readonly mobileMode?: HeaderMobileMode;
  readonly modal?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly open?: boolean;
  readonly placement?: HeaderPlacement;
  readonly scrolled?: boolean;
}

export interface HeaderContextValue extends UseHeaderReturn {
  readonly behavior: HeaderBehavior;
  readonly hidden: boolean;
  readonly lockScroll: boolean;
  readonly modal: boolean;
  readonly placement: HeaderPlacement;
  readonly scrolled: boolean;
  readonly toggleRef: RefObject<HTMLButtonElement | null>;
}

export interface HeaderToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly closeLabel?: string;
  readonly openLabel?: string;
  readonly ref?: Ref<HTMLButtonElement>;
}

export interface HeaderMobileNavProps extends HTMLAttributes<HTMLElement> {
  readonly forceMount?: boolean;
}

export interface HeaderCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export interface UseHeaderScrollStateOptions {
  readonly behavior?: HeaderBehavior;
  readonly disabled?: boolean;
  readonly scrollRoot?: HTMLElement | null;
  readonly scrollRootRef?: RefObject<HTMLElement | null>;
  readonly threshold?: number;
}

export interface UseHeaderScrollStateReturn {
  readonly hidden: boolean;
  readonly scrolled: boolean;
}

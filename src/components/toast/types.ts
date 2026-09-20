import type { MouseEvent, ReactNode, Ref } from "react";

export type ToastPriority = "polite" | "assertive";

export interface ToastAction {
  readonly label: ReactNode;
  readonly onClick: () => void;
}

export interface ToastInput {
  readonly action?: ToastAction;
  readonly description?: ReactNode;
  readonly duration?: number;
  readonly id?: string;
  readonly priority?: ToastPriority;
  readonly title?: ReactNode;
}

export interface ToastRecord {
  readonly action?: ToastAction;
  readonly description?: ReactNode;
  readonly duration: number;
  readonly id: string;
  readonly priority: ToastPriority;
  readonly title?: ReactNode;
}

export interface TimerState {
  readonly remaining: number;
  readonly startedAt: number;
  readonly timerId: ReturnType<typeof setTimeout> | null;
}

export interface ToastStoreOptions {
  readonly limit?: number;
}

export interface ToastStore {
  readonly dismiss: (id: string) => void;
  readonly enqueue: (input: ToastInput) => string;
  readonly getAnnouncement: () => string;
  readonly getAssertiveAnnouncement: () => string;
  readonly getSnapshot: () => readonly ToastRecord[];
  readonly getServerSnapshot: () => readonly ToastRecord[];
  readonly pause: (id: string) => void;
  readonly resume: (id: string) => void;
  readonly subscribe: (listener: () => void) => () => void;
}

export interface ToastContextValue {
  readonly dismiss: (id: string) => void;
  readonly pause: (id: string) => void;
  readonly resume: (id: string) => void;
  readonly store: ToastStore;
}

export interface ToastProviderOwnProps {
  readonly children?: ReactNode;
  readonly limit?: number;
}

export interface ToastViewportOwnProps {
  readonly "aria-label"?: string;
  readonly children?: ReactNode;
  readonly className?: string;
  /**
   * Set by the live client viewport (@gunkin/uiify/components/toast/Toast.js) to
   * `"manual"` so the queue's rendered surface sits in the top layer. The
   * structural shell (this file's own re-exported ToastViewport, used
   * directly by "Toast server shell" tests and any no-JS render) leaves it
   * unset, since there is no queue-driven show/hide to wire up there.
   */
  readonly popover?: "manual";
  readonly ref?: Ref<HTMLElement>;
}

export interface ToastRootOwnProps {
  readonly toast: ToastRecord;
}

export interface ToastTitleOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export interface ToastDescriptionOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export interface ToastActionOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export interface ToastActionProps extends ToastActionOwnProps {
  readonly onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ToastCloseOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export interface ToastCloseProps extends ToastCloseOwnProps {
  readonly onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

import type {
  ToastRecord,
  ToastInput,
  ToastStoreOptions,
  TimerState,
  ToastStore,
} from "./types.js";

export function createToastStore({ limit = 3 }: ToastStoreOptions = {}): ToastStore {
  let toasts: readonly ToastRecord[] = [];
  let announcement = "";
  let assertiveAnnouncement = "";
  let politeAnnouncementRevision = 0;
  let assertiveAnnouncementRevision = 0;
  const listeners = new Set<() => void>();
  const timers = new Map<string, TimerState>();
  let idCounter = 0;

  const emit = () => {
    listeners.forEach((listener) => listener());
  };

  const clearTimer = (id: string) => {
    const timer = timers.get(id);
    if (timer?.timerId !== null && timer?.timerId !== undefined) clearTimeout(timer.timerId);
    timers.delete(id);
  };

  const announce = (toast: ToastRecord) => {
    const message = [toast.title, toast.description].filter(Boolean).join(". ");
    if (toast.priority === "assertive") {
      assertiveAnnouncementRevision++;
      assertiveAnnouncement = `${message}${"\u200b".repeat(
        (assertiveAnnouncementRevision % 2) + 1,
      )}`;
    } else {
      politeAnnouncementRevision++;
      announcement = `${message}${"\u200b".repeat((politeAnnouncementRevision % 2) + 1)}`;
    }
  };

  const scheduleDismiss = (id: string, duration: number) => {
    clearTimer(id);
    const startedAt = Date.now();
    const timerId = setTimeout(() => dismiss(id), duration);
    timers.set(id, { remaining: duration, startedAt, timerId });
  };

  const dismiss = (id: string) => {
    clearTimer(id);
    const next = toasts.filter((toast) => toast.id !== id);
    if (next.length === toasts.length) return;
    toasts = next;
    emit();
  };

  return {
    dismiss,
    enqueue(input: ToastInput) {
      const id = input.id ?? `toast-${++idCounter}`;
      const toast: ToastRecord = {
        ...(input.action ? { action: input.action } : {}),
        ...(input.description ? { description: input.description } : {}),
        duration: input.duration ?? 4000,
        id,
        priority: input.priority ?? "polite",
        ...(input.title ? { title: input.title } : {}),
      };
      const nextToasts = [...toasts, toast].slice(-limit);
      const retainedIds = new Set(nextToasts.map((entry) => entry.id));
      for (const previousToast of toasts) {
        if (!retainedIds.has(previousToast.id)) clearTimer(previousToast.id);
      }
      toasts = nextToasts;
      announce(toast);
      if (toast.duration > 0) scheduleDismiss(id, toast.duration);
      emit();
      return id;
    },
    getAnnouncement() {
      return announcement;
    },
    getAssertiveAnnouncement() {
      return assertiveAnnouncement;
    },
    getSnapshot() {
      return toasts;
    },
    getServerSnapshot() {
      return toasts;
    },
    pause(id: string) {
      const timer = timers.get(id);
      if (!timer?.timerId) return;
      clearTimeout(timer.timerId);
      const elapsed = Date.now() - timer.startedAt;
      timers.set(id, {
        remaining: Math.max(0, timer.remaining - elapsed),
        startedAt: Date.now(),
        timerId: null,
      });
    },
    resume(id: string) {
      const timer = timers.get(id);
      if (!timer || timer.timerId || timer.remaining <= 0) return;
      scheduleDismiss(id, timer.remaining);
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

import type { Direction } from "./direction.js";
import { sortByDocumentOrder } from "./dom-order.js";

export type RovingFocusOrientation = "horizontal" | "vertical" | "both";

export interface RovingFocusItemRecord {
  readonly disabled: boolean;
  readonly element: HTMLElement | null;
  readonly id: string;
  readonly textValue: string;
}

export interface RovingFocusConfig {
  readonly direction: Direction;
  readonly loop: boolean;
  readonly orientation: RovingFocusOrientation;
}

export interface RovingFocusStore {
  focus(id: string): void;
  getCurrentId(): string | null;
  getItems(): readonly RovingFocusItemRecord[];
  move(fromId: string, key: string): boolean;
  register(item: RovingFocusItemRecord): () => void;
  search(character: string): void;
  setCurrentId(id: string): void;
  setElement(id: string, element: HTMLElement | null): void;
  subscribe(listener: () => void): () => void;
  subscribeItem(id: string, listener: () => void): () => void;
  updateConfig(config: RovingFocusConfig): void;
  updateItem(id: string, item: Partial<RovingFocusItemRecord>): void;
}

function orderedItems(items: Map<string, RovingFocusItemRecord>) {
  return sortByDocumentOrder(items.values(), (item) => item.element);
}

export function createRovingFocusStore(initial: RovingFocusConfig): RovingFocusStore {
  const items = new Map<string, RovingFocusItemRecord>();
  const listeners = new Set<() => void>();
  const itemListeners = new Map<string, Set<() => void>>();
  let config = initial;
  let currentId: string | null = null;
  let search = "";
  let searchTimer: ReturnType<typeof setTimeout> | undefined;
  const emit = () => {
    for (const listener of listeners) listener();
  };
  const emitItem = (id: string | null) => {
    if (!id) return;
    for (const listener of itemListeners.get(id) ?? []) listener();
  };
  const commitCurrentId = (id: string | null) => {
    if (currentId === id) return;
    const previous = currentId;
    currentId = id;
    emit();
    emitItem(previous);
    emitItem(id);
  };
  const getEnabled = () => orderedItems(items).filter((item) => !item.disabled);

  const store: RovingFocusStore = {
    focus(id) {
      const item = items.get(id);
      if (!item || item.disabled) return;
      store.setCurrentId(id);
      item.element?.focus({ preventScroll: true });
    },
    getCurrentId: () => currentId,
    getItems: () => orderedItems(items),
    move(fromId, key) {
      const enabled = getEnabled();
      if (enabled.length === 0) return false;
      const currentIndex = Math.max(
        0,
        enabled.findIndex((item) => item.id === fromId),
      );
      const horizontal = config.orientation !== "vertical";
      const vertical = config.orientation !== "horizontal";
      let offset = 0;
      if (vertical && key === "ArrowDown") offset = 1;
      if (vertical && key === "ArrowUp") offset = -1;
      if (horizontal && key === "ArrowRight") {
        offset = config.direction === "rtl" ? -1 : 1;
      }
      if (horizontal && key === "ArrowLeft") {
        offset = config.direction === "rtl" ? 1 : -1;
      }
      if (offset === 0 && key !== "Home" && key !== "End") return false;
      let nextIndex =
        key === "Home" ? 0 : key === "End" ? enabled.length - 1 : currentIndex + offset;
      if (config.loop) nextIndex = (nextIndex + enabled.length) % enabled.length;
      const next = enabled[nextIndex];
      if (!next) return false;
      store.focus(next.id);
      return true;
    },
    register(item) {
      items.set(item.id, item);
      if (currentId === null && !item.disabled) commitCurrentId(item.id);
      return () => {
        const wasCurrent = currentId === item.id;
        if (!items.delete(item.id)) return;
        if (wasCurrent) commitCurrentId(getEnabled()[0]?.id ?? null);
        else emit();
      };
    },
    search(character) {
      clearTimeout(searchTimer);
      const repeated = search.length > 0 && [...search].every((value) => value === character);
      search = repeated ? character : search + character;
      const query = search.toLocaleLowerCase();
      const enabled = getEnabled();
      const start = Math.max(0, enabled.findIndex((item) => item.id === currentId) + 1);
      const rotated = [...enabled.slice(start), ...enabled.slice(0, start)];
      const match = rotated.find((item) => item.textValue.toLocaleLowerCase().startsWith(query));
      if (match) store.focus(match.id);
      searchTimer = setTimeout(() => {
        search = "";
      }, 500);
    },
    setCurrentId(id) {
      commitCurrentId(id);
    },
    setElement(id, element) {
      store.updateItem(id, { element });
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    subscribeItem(id, listener) {
      const set = itemListeners.get(id) ?? new Set<() => void>();
      set.add(listener);
      itemListeners.set(id, set);
      return () => {
        set.delete(listener);
        if (set.size === 0) itemListeners.delete(id);
      };
    },
    updateConfig(next) {
      config = next;
    },
    updateItem(id, update) {
      const item = items.get(id);
      if (!item) return;
      const next = { ...item, ...update };
      items.set(id, next);
      if (id === currentId && next.disabled) {
        commitCurrentId(getEnabled()[0]?.id ?? null);
      }
    },
  };
  return store;
}

import type { MenuSelectEvent } from "./types.js";

export function createMenuSelectEvent(): MenuSelectEvent {
  let defaultPrevented = false;
  return {
    get defaultPrevented() {
      return defaultPrevented;
    },
    preventDefault() {
      defaultPrevented = true;
    },
  };
}

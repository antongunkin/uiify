import type { CarouselCommandController } from "./types.js";

/** The only two command strings this module recognizes. No general-purpose
 * command bus is exported — a consumer wanting other custom commands writes
 * its own listener the same way this one does. */
const NEXT_COMMAND = "--uiify-next";
const PREVIOUS_COMMAND = "--uiify-previous";

/**
 * Attaches a native `command` event listener to `element`, dispatching to
 * `controller.next`/`controller.previous` for the two recognized command
 * strings. Ignores every other command, and ignores events whose `target`
 * isn't `element` itself — a `command` event dispatched at a *nested*
 * carousel's root bubbles up through this one too, but its `target` is the
 * nested root, not this element, so it's correctly ignored (an ancestor
 * carousel never reacts to a descendant's commands).
 *
 * Returns a cleanup function that removes the listener.
 */
export function attachCarouselCommands(
  element: HTMLElement,
  controller: CarouselCommandController,
): () => void {
  function handleCommand(event: Event): void {
    if (event.target !== element) return;
    const command = (event as Event & { readonly command?: string }).command;
    if (command === NEXT_COMMAND) {
      controller.next();
    } else if (command === PREVIOUS_COMMAND) {
      controller.previous();
    }
  }

  element.addEventListener("command", handleCommand);
  return () => {
    element.removeEventListener("command", handleCommand);
  };
}

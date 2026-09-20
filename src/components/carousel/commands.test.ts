import { describe, expect, it, vi } from "vitest";
import { attachCarouselCommands } from "./commands.js";

/** jsdom has no `CommandEvent` — synthesize a plain `Event` with a `command`
 * property, matching how the real CommandEvent surfaces it. */
function commandEvent(command: string): Event {
  const event = new Event("command", { bubbles: true });
  Object.defineProperty(event, "command", { value: command });
  return event;
}

describe("attachCarouselCommands", () => {
  it("dispatches --uiify-next and --uiify-previous to the controller", () => {
    const next = vi.fn();
    const previous = vi.fn();
    const element = document.createElement("div");
    const detach = attachCarouselCommands(element, { next, previous });

    element.dispatchEvent(commandEvent("--uiify-next"));
    expect(next).toHaveBeenCalledTimes(1);
    expect(previous).not.toHaveBeenCalled();

    element.dispatchEvent(commandEvent("--uiify-previous"));
    expect(previous).toHaveBeenCalledTimes(1);

    detach();
  });

  it("ignores unrecognized commands", () => {
    const next = vi.fn();
    const previous = vi.fn();
    const element = document.createElement("div");
    attachCarouselCommands(element, { next, previous });

    element.dispatchEvent(commandEvent("--uiify-something-else"));
    element.dispatchEvent(commandEvent("show-modal"));

    expect(next).not.toHaveBeenCalled();
    expect(previous).not.toHaveBeenCalled();
  });

  it("ignores a command whose target is a nested element, not the attached one", () => {
    const next = vi.fn();
    const element = document.createElement("div");
    const nested = document.createElement("div");
    element.appendChild(nested);
    attachCarouselCommands(element, { next, previous: vi.fn() });

    // A command dispatched at (and bubbling from) a descendant — e.g. a
    // nested carousel's own root — must not activate this ancestor.
    nested.dispatchEvent(commandEvent("--uiify-next"));

    expect(next).not.toHaveBeenCalled();
  });

  it("stops dispatching after detach", () => {
    const next = vi.fn();
    const element = document.createElement("div");
    const detach = attachCarouselCommands(element, { next, previous: vi.fn() });

    detach();
    element.dispatchEvent(commandEvent("--uiify-next"));

    expect(next).not.toHaveBeenCalled();
  });
});

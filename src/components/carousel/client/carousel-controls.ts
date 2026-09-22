import type { CarouselAutoplayController, CarouselController } from "../types.js";

/** Keep a focused dot addressable, including duplicate end-page dots awaiting removal. */
export function attachCarouselFocus(
  root: HTMLElement,
  receive: (preserve: boolean) => void,
): () => void {
  function preserve(target: EventTarget | null) {
    receive(
      target instanceof Element &&
        target.closest("[data-uiify-carousel]") === root &&
        target.closest('[data-part="dot"]') !== null,
    );
  }
  const focusIn = (event: FocusEvent) => preserve(event.target);
  const focusOut = (event: FocusEvent) => preserve(event.relatedTarget);
  preserve(root.ownerDocument.activeElement);
  root.addEventListener("focusin", focusIn);
  root.addEventListener("focusout", focusOut);
  return () => {
    root.removeEventListener("focusin", focusIn);
    root.removeEventListener("focusout", focusOut);
  };
}

/** Delegate only this carousel's own controls; ordinary links keep browser behavior. */
export function attachCarouselControls(
  root: HTMLElement,
  controller: CarouselController,
  autoplay?: CarouselAutoplayController,
): () => void {
  function click(event: MouseEvent) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      !controller.getSnapshot().ready ||
      !(event.target instanceof Element) ||
      event.target.closest("[data-uiify-carousel]") !== root
    )
      return;
    const control = event.target.closest<HTMLElement>('[data-carousel-action], [data-part="dot"]');
    if (!control || !root.contains(control)) return;
    if (control instanceof HTMLButtonElement) {
      if (control.disabled) return;
      switch (control.dataset.carouselAction) {
        case "previous":
          controller.previous("previous");
          break;
        case "next":
          controller.next("next");
          break;
        case "rotation":
          if (autoplay?.getSnapshot().requested) autoplay.stop();
          else autoplay?.start();
          break;
      }
      return;
    }
    if (
      !(control instanceof HTMLAnchorElement) ||
      control.hasAttribute("download") ||
      (control.target !== "" && control.target !== "_self")
    )
      return;
    const index = Number(control.dataset.carouselIndex);
    const slide = root.querySelector<HTMLElement>(':scope > [data-part="viewport"]')?.children[
      index
    ];
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      !slide ||
      control.getAttribute("href") !== `#${encodeURIComponent(slide.id)}`
    )
      return;
    event.preventDefault();
    controller.goTo(index, "dot");
  }
  root.addEventListener("click", click);
  return () => root.removeEventListener("click", click);
}

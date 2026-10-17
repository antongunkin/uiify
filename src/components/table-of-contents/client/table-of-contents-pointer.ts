import type { TableOfContentsPointerOptions } from "../types.js";

export function attachTableOfContentsPointer({ root }: TableOfContentsPointerOptions): () => void {
  const view = root.ownerDocument.defaultView!;
  const rail = root.querySelector<HTMLElement>('[data-part="rail"]');
  if (!rail) return () => {};
  let nodes: HTMLElement[] = [],
    centers = new Map<Element, number>(),
    frame = 0,
    y: number | null = null;
  const select = (id: string | null) => {
    for (const node of root.querySelectorAll("[data-uiify-toc-value]"))
      if (node.closest("[data-uiify-table-of-contents]") === root)
        node.toggleAttribute(
          "data-highlighted",
          id !== null && node.getAttribute("data-uiify-toc-value") === id,
        );
  };
  const measure = () => {
    observer.disconnect();
    centers.clear();
    nodes = [...rail.querySelectorAll<HTMLElement>('[data-part="indicator"]')];
    nodes.forEach((node, index) => {
      node.style.setProperty("--uiify-toc-index", String(index));
      observer.observe(node);
    });
  };
  const observer = new view.IntersectionObserver((entries) => {
    for (const entry of entries)
      centers.set(entry.target, entry.boundingClientRect.top + entry.boundingClientRect.height / 2);
  });
  const resize = new view.ResizeObserver(measure);
  resize.observe(rail);
  const mutations = new view.MutationObserver(measure);
  mutations.observe(rail, { childList: true, subtree: true });
  const reset = () => {
    y = null;
    rail.style.removeProperty("--uiify-toc-pointer");
    select(null);
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    y = event.clientY;
    if (frame) return;
    frame = view.requestAnimationFrame(() => {
      frame = 0;
      if (y === null || centers.size !== nodes.length || !nodes.length) return;
      let index = 0;
      for (let i = 1; i < nodes.length; i++) {
        const previous = centers.get(nodes[i - 1]!)!,
          next = centers.get(nodes[i]!)!;
        index = i - 1 + (y - previous) / (next - previous || 1);
        if (y <= next) break;
      }
      rail.style.setProperty("--uiify-toc-pointer", String(index));
      const nearest = nodes[Math.max(0, Math.min(nodes.length - 1, Math.round(index)))];
      select(nearest?.getAttribute("data-uiify-toc-value") ?? null);
    });
  };
  const highlight = (event: Event) => {
    const target = event.type.endsWith("out") ? (event as FocusEvent).relatedTarget : event.target;
    const link = target instanceof view.Element ? target.closest('[data-part="link"]') : null;
    const id =
      link?.closest("[data-uiify-table-of-contents]") === root
        ? link.getAttribute("data-uiify-toc-value")
        : null;
    select(id);
  };
  rail.addEventListener("pointermove", move);
  rail.addEventListener("pointerleave", reset);
  root.addEventListener("pointerover", highlight);
  root.addEventListener("focusin", highlight);
  root.addEventListener("pointerout", highlight);
  root.addEventListener("focusout", highlight);
  const scroll = () => {
    if (!frame)
      frame = view.requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
  };
  view.addEventListener("scroll", scroll, true);
  measure();
  return () => {
    observer.disconnect();
    resize.disconnect();
    mutations.disconnect();
    if (frame) view.cancelAnimationFrame(frame);
    rail.removeEventListener("pointermove", move);
    rail.removeEventListener("pointerleave", reset);
    root.removeEventListener("pointerover", highlight);
    root.removeEventListener("focusin", highlight);
    root.removeEventListener("pointerout", highlight);
    root.removeEventListener("focusout", highlight);
    view.removeEventListener("scroll", scroll, true);
    reset();
  };
}

import { getTableOfContentsValue, resolveTableOfContentsId } from "./scrollspy-selection.js";
import type {
  TableOfContentsObserver,
  TableOfContentsObserverOptions,
  TableOfContentsTargetSnapshot,
} from "./types.js";
export { getTableOfContentsValue, resolveTableOfContentsId } from "./scrollspy-selection.js";

export function observeTableOfContents({
  root,
  scrollTarget,
  contentTarget,
  offset,
  onValueChange,
}: TableOfContentsObserverOptions): TableOfContentsObserver {
  const doc = root.ownerDocument;
  const view = doc.defaultView!;
  let scrollNode: HTMLElement | null = null;
  let content: HTMLElement | null = null;
  let host: EventTarget | null = null;
  let observer: IntersectionObserver | null = null;
  let nodes: HTMLElement[] = [];
  let positions = new Map<Element, TableOfContentsTargetSnapshot>();
  let contentEnd: number | null = null;
  let viewportSize = 0;
  let frame = 0;
  let generation = 0;
  let destroyed = false;
  let last: string | null | undefined;
  const resized = new Set<Element>();
  const emit = (value: string | null) => {
    if (last !== value) {
      last = value;
      onValueChange(value);
    }
  };
  const position = () => {
    // banned-read-ok: A scroll offset is the required input, not a layout measurement; geometry comes from observers.
    return scrollNode ? scrollNode.scrollTop : view.scrollY;
  };
  const update = () => {
    if (positions.size !== nodes.length || !viewportSize) return;
    const start = position();
    emit(
      getTableOfContentsValue({
        targets: nodes.flatMap((node) => {
          const target = positions.get(node);
          return target ? [target] : [];
        }),
        viewportStart: start,
        viewportEnd: start + viewportSize,
        offset,
        contentEnd,
      }),
    );
  };
  const scroll = () => {
    if (!frame)
      frame = view.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
  };
  const schedule = () => {
    if (frame) view.cancelAnimationFrame(frame);
    frame = view.requestAnimationFrame(() => {
      frame = 0;
      refresh();
    });
  };
  const resize = new view.ResizeObserver(schedule);
  const mutations = new view.MutationObserver((changes) => {
    if (changes.some((change) => !root.contains(change.target))) schedule();
  });
  const links = new view.MutationObserver(schedule);
  links.observe(root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["href"],
  });
  function refresh() {
    if (destroyed) return;
    generation++;
    observer?.disconnect();
    mutations.disconnect();
    scrollNode = scrollTarget === undefined ? null : doc.getElementById(scrollTarget);
    content = contentTarget === undefined ? doc.documentElement : doc.getElementById(contentTarget);
    const nextHost = scrollTarget !== undefined && !scrollNode ? null : (scrollNode ?? view);
    if (host !== nextHost) {
      host?.removeEventListener("scroll", scroll);
      host = nextHost;
      host?.addEventListener("scroll", scroll, { passive: true });
    }
    if (!host || !content) {
      emit(null);
      mutations.observe(doc.documentElement, { subtree: true, childList: true });
      return;
    }
    const values = new Map<HTMLElement, string>();
    for (const link of root.querySelectorAll('[data-part="link"][href]')) {
      if (link.closest("[data-uiify-table-of-contents]") !== root) continue;
      const value = resolveTableOfContentsId(link.getAttribute("href")!, doc.URL);
      const node = value === null ? null : doc.getElementById(value);
      if (node && content.contains(node)) values.set(node, value!);
    }
    nodes = [...values.keys()].sort((a, b) => (a.compareDocumentPosition(b) & 2 ? 1 : -1));
    positions = new Map();
    contentEnd = null;
    viewportSize = 0;
    if (!nodes.length) emit(null);
    const current = generation;
    observer = new view.IntersectionObserver(
      (entries) => {
        if (destroyed || generation !== current) return;
        const start = position();
        for (const entry of entries) {
          const rect = entry.boundingClientRect;
          const origin = entry.rootBounds?.top ?? 0;
          viewportSize = entry.rootBounds?.height ?? viewportSize;
          if (entry.target === content) contentEnd = rect.bottom + start - origin;
          const value = values.get(entry.target as HTMLElement);
          if (value !== undefined)
            positions.set(entry.target, {
              value,
              start: rect.top + start - origin,
              visible: rect.width > 0 && rect.height > 0,
            });
        }
        update();
      },
      { root: scrollNode, threshold: [0, 1] },
    );
    const observed = new Set<Element>([content, ...nodes, ...(scrollNode ? [scrollNode] : [])]);
    for (const node of resized)
      if (!observed.has(node)) {
        resize.unobserve(node);
        resized.delete(node);
      }
    for (const node of observed) {
      if (node !== scrollNode) observer.observe(node);
      if (!resized.has(node)) {
        resize.observe(node);
        resized.add(node);
      }
    }
    const boundaries =
      contentTarget !== undefined
        ? [content]
        : new Set(
            nodes.map((node) => {
              const parent = node.closest("article, main") ?? node.parentElement;
              return parent && parent !== doc.body && parent !== doc.documentElement
                ? parent
                : node;
            }),
          );
    for (const boundary of boundaries)
      mutations.observe(boundary, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["id", "hidden", "open", "class", "style"],
      });
  }
  view.addEventListener("resize", schedule);
  view.addEventListener("hashchange", scroll);
  refresh();
  return {
    refresh,
    destroy() {
      destroyed = true;
      generation++;
      observer?.disconnect();
      resize.disconnect();
      mutations.disconnect();
      links.disconnect();
      host?.removeEventListener("scroll", scroll);
      view.removeEventListener("resize", schedule);
      view.removeEventListener("hashchange", scroll);
      if (frame) view.cancelAnimationFrame(frame);
    },
  };
}

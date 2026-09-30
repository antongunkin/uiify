import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(import.meta.dirname, "components/modal.css"), "utf8");
const css = source.replace(/\s+/g, " ");
const modalOnly = css.slice(css.indexOf("Modal anatomy."));

describe("Modal skin: anatomy", () => {
  it("sizes the dialog from an overridable custom property", () => {
    expect(css).toContain("--uiify-modal-inline-size: 28rem;");
    expect(css).toContain(
      "inline-size: min(var(--uiify-modal-inline-size), calc(100vw - 2 * var(--space-lg)));",
    );
    expect(css).toContain(
      '[data-uiify-modal][data-part="content"][data-size="sm"] { --uiify-modal-inline-size: 24rem; }',
    );
    expect(css).toContain(
      '[data-uiify-modal][data-part="content"][data-size="lg"] { --uiify-modal-inline-size: 40rem; }',
    );
  });

  it("lays out an open dialog as a column with a scrolling body", () => {
    expect(css).toContain('[data-uiify-modal][data-part="content"][open] { display: flex; }');
    expect(css).toContain("max-block-size: calc(100dvh - 2 * var(--space-lg));");
    expect(css).toContain(
      '[data-uiify-modal][data-part="body"] { flex: 1 1 auto; min-block-size: 0; overflow: auto; overscroll-behavior: contain; }',
    );
    expect(css).toContain(
      '[data-uiify-modal][data-part="header"] { position: relative; flex: none;',
    );
    expect(css).toContain('[data-uiify-modal][data-part="footer"] { display: flex; flex: none;');
  });

  it("keeps the column layout off [open] so a closing dialog stays a column", () => {
    // `display` outlives [open] during the exit transition; the direction must not snap to row.
    expect(css).toMatch(
      /\[data-uiify-modal\]\[data-part="content"\] \{ --uiify-modal-inline-size: 28rem; flex-direction: column; gap: var\(--space-md\); inline-size: [^}]*max-block-size: calc\(100dvh - 2 \* var\(--space-lg\)\); \}/,
    );
    expect(css).not.toMatch(/\[open\] \{[^}]*(?:flex-direction|gap|max-block-size)/);
  });

  it("fills the viewport for size=full and respects the safe area", () => {
    expect(css).toContain('[data-size="full"] { inset: 0; margin: 0;');
    expect(css).toContain("env(safe-area-inset-top)");
  });

  it("scopes every new rule to the modal so AlertModal, Drawer and Dialog are untouched", () => {
    expect(css).toContain("Modal anatomy.");
    expect(modalOnly).not.toMatch(/data-uiify-(?:alert-modal|drawer|dialog)/);
  });

  it("gives touch pointers a 44px close target", () => {
    expect(css).toContain("@media (pointer: coarse)");
    expect(css).toContain("min-inline-size: 2.75rem;");
  });

  it("keeps the title clear of the enlarged coarse-pointer close target", () => {
    expect(css).toMatch(
      /@media \(pointer: coarse\) \{ \[data-uiify-modal\]\[data-part="header"\] \{ padding-inline-end: 2\.75rem; \}/,
    );
  });

  it("does not push a start-aligned dialog down when it is full screen", () => {
    expect(css).toContain(
      '[data-uiify-modal][data-part="content"][data-align="start"]:not([data-size="full"]) {',
    );
  });

  it("applies align=start only from 40rem up so the mobile sheet wins", () => {
    expect(css).toMatch(
      /@media \(width >= 40rem\) \{ \[data-uiify-modal\]\[data-part="content"\]\[data-align="start"\]:not\(\[data-size="full"\]\) \{ margin-block: var\(--space-xl\) auto; \} \}/,
    );
    // Not a top-level rule: removing every @media block leaves no align rule.
    const withoutMedia = css.replace(/@media [^{]*\{(?:[^{}]|\{[^{}]*\})*\}/g, "");
    expect(withoutMedia).not.toContain('[data-align="start"]');
  });
});

describe("Modal skin: mobile sheet", () => {
  it("becomes a content-sized bottom sheet capped at 80dvh below 40rem", () => {
    expect(css).toContain("@media (width < 40rem) {");
    expect(css).toContain('[data-uiify-modal][data-part="content"]:not([data-size="full"]) {');
    expect(css).toContain("max-block-size: 80dvh;");
    expect(css).toContain("margin: auto 0 0;");
    expect(css).toContain("env(safe-area-inset-bottom)");
  });

  it("shows the grabber only on the sheet", () => {
    expect(css).toContain('[data-uiify-modal][data-part="grabber"] { display: none;');
    expect(css).toMatch(
      /@media \(width < 40rem\) \{[^@]*\[data-uiify-modal\]\[data-part="content"\]:not\(\[data-size="full"\]\) > \[data-part="grabber"\] \{ display: block; \}/,
    );
    // No rule that displays the grabber may match a full-screen dialog.
    expect(css).not.toMatch(/\[data-uiify-modal\]\[data-part="grabber"\] \{ display: block/);
    expect(css).not.toMatch(/(?<!:not\()\[data-size="full"\][^{]*grabber[^{]*\{ display: block/);
  });

  it("slides the sheet in and out and lets the swipe drive the position", () => {
    expect(css).toContain("@media (width < 40rem) and (prefers-reduced-motion: no-preference)");
    expect(css).toContain("translate: 0 100%;");
    expect(css).toContain("[data-dragging]");
    expect(css).toContain("translate: 0 var(--uiify-sheet-offset, 0);");
    expect(css).toContain("touch-action: none;");
    expect(css).toContain("touch-action: pan-y;");
  });

  it("claims touches on the sheet only when a ModalBody scrolls, never on a bare dialog", () => {
    expect(css).toMatch(
      /\[data-uiify-modal\]\[data-part="content"\]:not\(\[data-size="full"\]\):has\( ?> \[data-uiify-modal\]\[data-part="body"\] ?\) \{ touch-action: none; \}/,
    );
    // The unconditional sheet rule leaves the touch action alone, so a dialog without a body
    // (the parts API without ModalBody) stays scrollable by touch.
    const sheet =
      /@media \(width < 40rem\) \{ \[data-uiify-modal\]\[data-part="content"\]:not\(\[data-size="full"\]\) \{([^}]*)\}/.exec(
        css,
      );
    expect(sheet?.[1]).toContain("max-block-size: 80dvh;");
    expect(sheet?.[1]).not.toContain("touch-action");
    // Header and grabber stay swipe handles on either kind of sheet.
    expect(css).toContain(
      '[data-uiify-modal][data-part="content"]:not([data-size="full"]) [data-uiify-modal][data-part="header"] { touch-action: none; }',
    );
    expect(css).toMatch(/\[data-uiify-modal\]\[data-part="grabber"\] \{[^}]*touch-action: none;/);
  });
});

describe("Modal skin: nesting and backdrop", () => {
  it("draws one dimming layer: a nested modal has a transparent backdrop", () => {
    expect(css).toContain(
      '[data-uiify-modal][data-part="content"] [data-uiify-modal][data-part="content"]::backdrop { background-color: transparent; backdrop-filter: none; }',
    );
  });

  it("dims the parent while a nested modal is open", () => {
    expect(css).toContain(
      '[data-uiify-modal][data-part="content"]:has([data-uiify-modal][data-part="content"]:modal) { filter: brightness(0.9); }',
    );
    expect(css).toMatch(/@media \(width >= 40rem\) \{[^@]*:modal\) \{ scale: 0\.97; \}/);
  });

  it("supports blur and no backdrop", () => {
    expect(css).toContain('[data-backdrop="blur"]::backdrop { backdrop-filter: blur(4px); }');
    expect(css).toContain('[data-backdrop="none"]::backdrop { background-color: transparent; }');
  });
});

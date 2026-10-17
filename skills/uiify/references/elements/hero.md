# hero

Binding: gap

Introduce the product and its next action.

## Use when

Use a hero on a page whose goal is to help people decide what to do next, such as a landing, pricing, or campaign page. Do not add one to settings, dashboards, or docs; start with the task's content.

## Avoid when

Do not lead with a generic slogan, a large decorative image, or multiple equally prominent actions.

## Structure

Start with one specific `h1` that states the page's purpose, one supporting sentence, and one main action. Add a secondary action only for a different useful path. Use an image only when it shows the product or subject and supports the page's claim; prefer existing assets from the project, preserve the focal point across responsive crops, and provide suitable alternative text. If no suitable asset exists, keep the layout complete without inventing one.

## Responsive

On narrow screens, order the text, action, then image. Let translated or long headings wrap, and keep the main action visible without horizontal scrolling.

## States

Check a long or translated heading and the layout when no image is available. Keep action labels and focus states clear in both light and dark themes.

## Verify

Confirm there is one `h1`, the main action is visible at 390×844 and 1440×900, and content reflows at 320 CSS px without two-dimensional scrolling. Check image alternative text against its purpose.

## Common mistake

A generic slogan, decorative gradient, and two equal buttons do not explain the page or the next step.

## Custom implementation

Use a named section, semantic heading, supporting copy, and the documented Button. The main action usually opens another page, so render it as a link. Add only static CSS for layout.

```tsx
<section aria-labelledby="page-title">
  <h1 id="page-title">Plan releases your whole team can follow</h1>
  <p>Orbit turns scattered tasks into one shared release timeline.</p>
  <Button as="a" href="/signup">Start a free trial</Button>
</section>
```

Related laws: references/laws/von-restorff.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/images/) (verified 2026-10-17)

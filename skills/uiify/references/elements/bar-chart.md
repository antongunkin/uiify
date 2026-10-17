# bar-chart

Binding: gap

Compare values across a small set of named categories.

Give the chart a concise caption and provide the same values in a readable table. Treat chart color and geometry as supporting views of the values.

```html
<figure>
  <figcaption>Signups by month</figcaption>
  <svg role="img" aria-label="January 12, February 19">…</svg>
  <table>
    <caption>Signups by month</caption>
    <thead><tr><th scope="col">Month</th><th scope="col">Signups</th></tr></thead>
    <tbody>
      <tr><th scope="row">January</th><td>12</td></tr>
      <tr><th scope="row">February</th><td>19</td></tr>
    </tbody>
  </table>
</figure>
```

This is an app-level composition recipe; it does not add a component to UIify.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)

# What leads the eye, and do the parts read in the right order?

At 1440×900 and 390×844, inspect the initial viewport and one scrolled section. Check these visible relationships:

- One item leads each screen. Squint at the screenshot or blur it; the primary heading or task should remain the first clear anchor.
- Neighboring text roles differ by size or weight, not color alone. Compare computed font size and weight in the heading, body, label, and helper text.
- A supplied brand font and existing type roles remain intact. Test long headings and labels at narrow widths; use tabular numerals only when aligned values need them.
- Main text lines average 45–75 characters as a readability heuristic and do not exceed 80 characters as a ceiling. [WCAG 1.4.8](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html) describes 80 characters as one available text-presentation requirement; it does not make 45–75 a rule.
- Related items sit closer together than unrelated groups. Check the grouping against the `proximity` law in the relevant page design.
- Space above a heading exceeds the space below it; treat this as a grouping heuristic and compare computed margins.
- Density matches the page surface in `surface.md`; a work screen can be denser than a reading page without losing clear groups.
- Heading levels follow the visible and document order without skipped levels. Inspect the heading outline as well as the screenshot.

If one relation fails, name the viewport and state, then make one correction and inspect both viewports again.

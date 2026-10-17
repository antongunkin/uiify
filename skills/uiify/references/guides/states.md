# Does the page still work outside the happy path?

Use the browser to create these test inputs and states, then record which you checked:

- Double the content length in headings, button labels, and primary text. Add a long unbroken value such as a URL or identifier and inspect wrapping at 390×844.
- Set `dir="rtl"` on `html`; inspect alignment, order, icons, and navigation at 1440×900 and 390×844.
- Check a 320 CSS pixel viewport and browser zoom at 200%. Confirm content and actions remain available without unintended horizontal scrolling. [WCAG 2.2 Success Criterion 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) requires reflow at a 320 CSS pixel width for vertically scrolling content, except content that needs two-dimensional layout.
- Use only the keyboard: follow Tab order, activate with Enter or Space, dismiss overlays with Escape where supported, and confirm focus returns to the opener.
- Exercise loading, empty, error, and disabled states where they exist. Submit an invalid form and check the message, focus location, and preservation of valid values.
- If motion communicates a state or transition, verify its reduced-motion behavior; do not make essential information depend on animation.

Record the viewport, input, and state for each check. A screenshot shows appearance only; it does not prove keyboard operation, focus return, or touch and pointer behavior.

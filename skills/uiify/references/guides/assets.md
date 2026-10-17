# Choose image and type material

Read this guide only when images or typography carry the page's composition. Start with project assets and the requested brand; do not require image generation, network access or new font downloads.

| Material | Use when | Composition and responsive check |
| --- | --- | --- |
| Photography | A real person, place or physical subject is evidence for the message. | Preserve the subject's focal point in each crop; use a ratio that suits the section and stack or reframe at narrow widths. |
| Product screenshot | The actual interface explains the product or task. | Keep essential UI legible and intact; do not replace a product screenshot with decorative imagery. At mobile widths, stack it or crop only if the important controls remain visible. |
| Illustration | An abstract idea benefits from a simple visual explanation. | Keep style and color consistent with the product; avoid inventing interface details, customer logos or testimonials. |
| Typographic composition | The words themselves are the main visual material. | Preserve supplied brand fonts and established roles. Check line breaks, long strings and fallback metrics at narrow widths; never rewrite factual copy just to fit. |

When assets are missing, do not invent reviews, testimonials, customer logos or product screens. Use existing fonts first and preserve supplied brand fonts. A font fallback should remain close enough in width and weight to avoid a layout jump while the chosen font loads. Test long headings and labels; use tabular numerals when aligned values benefit from equal-width digits, not as a universal setting.

Motion should explain a state change or guide attention. Keep it brief and honor `prefers-reduced-motion`; decorative movement should not compete with reading or controls.

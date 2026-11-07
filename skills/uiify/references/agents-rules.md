## UIify screens

- A screen in `<dir>` (the folder where the project keeps its screens) imports only from `@gunkin/uiify`, blocks and project components. It never sets `className` or `style`.
- Take component names and props from the catalog below. Do not read the package types for them.
- After every change run `node .agents/skills/uiify/scripts/check-screens.mjs <dir>` and `tsc`.
- When the checks pass, answer in one line.

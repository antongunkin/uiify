# Editor lint for screens

`scripts/check-screens.mjs <screensDir>` is the source of truth. These fragments only surface the same
mistakes while you type. Scope them to the screens folder (an `overrides` entry with `files`).

## oxlint

```json
{
  "plugins": ["react"],
  "overrides": [
    {
      "files": ["screens/**/*.tsx"],
      "rules": {
        "react/forbid-dom-props": ["error", { "forbid": ["className", "style"] }],
        "react/forbid-component-props": ["error", { "forbid": ["className", "style"] }],
        "no-restricted-imports": [
          "error",
          {
            "patterns": [
              {
                "group": ["*", "!@gunkin/uiify", "!@gunkin/uiify/components/*", "!./*", "!../*"],
                "message": "Screens import only @gunkin/uiify, its component entries and relative files."
              }
            ]
          }
        ]
      }
    }
  ]
}
```

## ESLint

```js
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

export default [
  {
    files: ["screens/**/*.tsx"],
    plugins: { react, "@typescript-eslint": tseslint.plugin },
    languageOptions: { parser: tseslint.parser },
    rules: {
      "no-restricted-imports": ["error", { patterns: [{ group: ["*", "!@gunkin/uiify", "!@gunkin/uiify/components/*", "!./*", "!../*"] }] }],
      "react/forbid-dom-props": ["error", { forbid: ["className", "style"] }],
      "react/forbid-component-props": ["error", { forbid: ["className", "style"] }],
    },
  },
];
```

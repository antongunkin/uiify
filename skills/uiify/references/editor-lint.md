# Editor lint for screens

`scripts/check-screens.mjs <screensDir>` is the source of truth. These fragments only surface the same
mistakes while you type. Scope them to the screens folder (an `overrides` entry with `files`).

## oxlint

```json
{
  "overrides": [
    {
      "files": ["screens/**/*.tsx"],
      "rules": {
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

export default [
  {
    files: ["screens/**/*.tsx"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    languageOptions: { parser: tseslint.parser },
    rules: {
      "no-restricted-imports": ["error", { patterns: [{ group: ["*", "!@gunkin/uiify", "!@gunkin/uiify/components/*", "!./*", "!../*"] }] }],
    },
  },
];
```

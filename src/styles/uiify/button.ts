import type { ButtonSize, ButtonVariant } from "../../components/button/types.js";
import { defineRecipe } from "../define.js";

/**
 * Selected look (filled with the brand colour) for every variant except `link`. It sits in each
 * variant — not in `base` — so `.uiify-button[data-variant=…]:is(selected)` outranks the variant's
 * own fill; selectors of equal weight otherwise resolve by order, and variants come after base.
 */
const selected =
  "selected:border-transparent selected:bg-primary selected:text-primary-foreground selected:hover-fine:available:bg-primary/88";

/** Tonal hover/press surface shared by the transparent variants. */
const tonal =
  "bg-transparent text-foreground hover-fine:available:bg-foreground/10 active:available:bg-foreground/16";

/**
 * Geometry and the main fill use the build-time control aliases (`rounded-control`, `h-control-md`,
 * `primary-fill`): shadcn's nova Button on the host's `--radius`, `--spacing` and `--primary` under
 * the Tailwind adapter, a monochrome 40px pill in UIify's own entry. No `data-variant` is the filled
 * main action. The wash and rim light layers (`::before`/`::after`) live in `effects.css`.
 */
export const button = defineRecipe<{ variant: ButtonVariant; size: ButtonSize }>("button", {
  base: [
    "relative isolate inline-flex items-center justify-center gap-1.5 min-h-control-md min-w-control-md py-0 px-control-button",
    "border border-transparent rounded-control bg-clip-padding text-control leading-6 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "no-underline cursor-pointer transition-colors unavailable:opacity-50 unavailable:cursor-not-allowed",
    "not-data-variant:bg-primary-fill not-data-variant:text-primary-fill-foreground",
    "not-data-variant:hover-fine:available:bg-primary-fill/90 not-data-variant:active:available:bg-primary-fill/80",
    selected.replaceAll("selected:", "not-data-variant:selected:"),
  ].join(" "),
  variants: {
    variant: {
      // `default` renders no `data-variant`; the unset look above styles it.
      default: "",
      secondary: `bg-foreground/10 text-foreground hover-fine:available:bg-foreground/20 active:available:bg-foreground/26 ${selected}`,
      outline: `border-foreground/20 ${tonal} ${selected}`,
      ghost: `${tonal} ${selected}`,
      destructive: `bg-destructive-fill text-destructive-fill-foreground focus-visible:outline-destructive ${selected}`,
      link: "min-w-0 px-0 border-0 rounded-none bg-transparent text-primary underline underline-offset-3 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-3",
    },
    size: {
      xs: "min-h-control-xs min-w-control-xs px-2 gap-1 text-xs leading-4",
      sm: "min-h-control-sm min-w-control-sm px-3 gap-1 text-control-sm leading-5",
      // `default` renders no `data-size`; the base metrics style it.
      default: "",
      lg: "min-h-control-lg min-w-control-lg px-control-button-lg text-control-lg leading-7",
      "icon-xs": "min-h-control-xs min-w-control-xs px-0 gap-1 text-xs leading-4",
      "icon-sm": "min-h-control-sm min-w-control-sm px-0 gap-1 text-control-sm leading-5",
      icon: "px-0",
      "icon-lg": "min-h-control-lg min-w-control-lg px-0 text-control-lg leading-7",
    },
  },
  // A link stays inline text at every size: sizes come after variants, so restate its metrics.
  compoundVariants: [
    { variant: "link", size: "xs", class: "min-w-0 px-0" },
    { variant: "link", size: "sm", class: "min-w-0 px-0" },
    { variant: "link", size: "lg", class: "min-w-0 px-0" },
  ],
});

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
 * Pill-shaped, monochrome Button. No `data-variant` is the filled foreground action; the wash and
 * rim light layers (`::before`/`::after`) live in `effects.css`.
 */
export const button = defineRecipe<{ variant: ButtonVariant; size: ButtonSize }>("button", {
  base: [
    "relative isolate inline-flex items-center justify-center gap-1.5 min-h-10 min-w-10 py-0 px-5",
    "border border-transparent rounded-full bg-clip-padding text-base leading-6 font-medium focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/20",
    "no-underline cursor-pointer transition-colors unavailable:opacity-50 unavailable:cursor-not-allowed",
    "not-data-variant:bg-foreground not-data-variant:text-background",
    "not-data-variant:hover-fine:available:bg-foreground/90 not-data-variant:active:available:bg-foreground/80",
    selected.replaceAll("selected:", "not-data-variant:selected:"),
  ].join(" "),
  variants: {
    variant: {
      // `default` renders no `data-variant`; the unset look above styles it.
      default: "",
      secondary: `bg-foreground/10 text-foreground hover-fine:available:bg-foreground/20 active:available:bg-foreground/26 ${selected}`,
      outline: `border-foreground/20 ${tonal} ${selected}`,
      ghost: `${tonal} ${selected}`,
      destructive: `bg-destructive text-destructive-foreground ${selected}`,
      link: "min-w-0 px-0 border-0 rounded-none bg-transparent text-primary underline underline-offset-3 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-3",
    },
    size: {
      xs: "min-h-6 min-w-6 px-2 gap-1 text-xs leading-4",
      sm: "min-h-8 min-w-8 px-3 gap-1 text-sm leading-5",
      // `default` renders no `data-size`; the base metrics style it.
      default: "",
      lg: "min-h-12 min-w-12 px-7 text-lg leading-7",
      "icon-xs": "min-h-6 min-w-6 px-0 gap-1 text-xs leading-4",
      "icon-sm": "min-h-8 min-w-8 px-0 gap-1 text-sm leading-5",
      icon: "px-0",
      "icon-lg": "min-h-12 min-w-12 px-0 text-lg leading-7",
    },
  },
  // A link stays inline text at every size: sizes come after variants, so restate its metrics.
  compoundVariants: [
    { variant: "link", size: "xs", class: "min-w-0 px-0" },
    { variant: "link", size: "sm", class: "min-w-0 px-0" },
    { variant: "link", size: "lg", class: "min-w-0 px-0" },
  ],
});

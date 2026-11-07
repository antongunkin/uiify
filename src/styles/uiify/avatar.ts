import type { AvatarSize } from "../../components/avatar/types.js";
import { defineRecipe } from "../define.js";

export const avatar = defineRecipe<{ size: AvatarSize }, "image" | "fallback">("avatar", {
  parts: ["image", "fallback"],
  base: {
    root: "inline-grid size-10 place-items-center overflow-clip rounded-full bg-muted text-muted-foreground text-sm font-medium leading-none align-middle",
    image: "block size-full object-cover",
    fallback: "",
  },
  variants: {
    size: {
      sm: "size-8 text-xs",
      md: "",
      lg: "size-12 text-base",
    },
  },
});

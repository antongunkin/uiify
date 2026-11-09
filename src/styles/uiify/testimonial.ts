import { defineRecipe } from "../define.js";

/** Testimonial block. Resets the UA indents of `figure` and `blockquote`; text comes from Text. */
export const testimonial = defineRecipe("testimonial", {
  parts: ["body"],
  base: {
    root: "m-0 min-w-0",
    body: "m-0",
  },
});

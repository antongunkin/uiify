import type { ComponentPropsWithRef, ReactNode } from "react";

type NodeProps<Tag extends "blockquote" | "figcaption" | "span"> = Omit<
  ComponentPropsWithRef<Tag>,
  "children" | "dangerouslySetInnerHTML"
>;

/** Native props of each node Testimonial renders for you. */
export interface TestimonialSlotProps {
  readonly quote?: NodeProps<"blockquote">;
  readonly caption?: NodeProps<"figcaption">;
  readonly name?: NodeProps<"span">;
  readonly byline?: NodeProps<"span">;
}

/** `plain` sits in the page; `card` draws the quote as a card. */
export type TestimonialVariant = "plain" | "card";

export interface TestimonialOwnProps {
  /** The customer's own words, without quotation marks. */
  readonly quote: string;
  /** Who said it. */
  readonly name: string;
  /** Their role or company, such as "Designer at Inkwell". Not `role`: that is the ARIA attribute. */
  readonly byline?: string | undefined;
  /** An `Avatar` of the speaker; its name is already in the caption, so it can be `aria-hidden`. */
  readonly avatar?: ReactNode;
  /** Link to the source of the quote; sets `cite` on the `blockquote`. */
  readonly cite?: string | undefined;
  /** @default "plain" */
  readonly variant?: TestimonialVariant | undefined;
  readonly slotProps?: TestimonialSlotProps | undefined;
}

/** A customer quote with its attribution. Root props go to the `figure`. */
export type TestimonialProps = TestimonialOwnProps &
  Omit<
    ComponentPropsWithRef<"figure">,
    keyof TestimonialOwnProps | "children" | "dangerouslySetInnerHTML"
  >;

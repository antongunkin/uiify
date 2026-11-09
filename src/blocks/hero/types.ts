import type { ComponentPropsWithRef, ReactNode } from "react";
import type { HeadingLevel } from "../../components/typography/index.js";

type NodeProps<Tag extends "div" | "p" | "h1"> = Omit<
  ComponentPropsWithRef<Tag>,
  "children" | "dangerouslySetInnerHTML"
>;

/** Native props of each node Hero renders for you. */
export interface HeroSlotProps {
  readonly content?: NodeProps<"div">;
  readonly eyebrow?: NodeProps<"p">;
  readonly title?: NodeProps<"h1">;
  readonly description?: NodeProps<"p">;
  readonly actions?: NodeProps<"div">;
  readonly media?: NodeProps<"div">;
}

/** `start` reads like a document; `center` suits a short hero without media. */
export type HeroAlign = "start" | "center";

export interface HeroOwnProps {
  /** Section id; with it the heading gets `<id>-title` and labels the section. */
  readonly id?: string | undefined;
  /** Short label above the title, such as "New". */
  readonly eyebrow?: string | undefined;
  /** One specific heading that states the page's purpose. */
  readonly title: string;
  /** One supporting sentence. */
  readonly description?: string | undefined;
  /** The main action first, then at most one quieter one: usually `Button href`. */
  readonly actions?: ReactNode;
  /** An image that shows the product; beside the text from `md` up, after the actions below it. */
  readonly media?: ReactNode;
  /** @default "start" */
  readonly align?: HeroAlign | undefined;
  /** @default 1 */
  readonly level?: HeadingLevel | undefined;
  readonly slotProps?: HeroSlotProps | undefined;
}

/** The opening section of a landing page. Root props go to the `section`. */
export type HeroProps = HeroOwnProps &
  Omit<
    ComponentPropsWithRef<"section">,
    keyof HeroOwnProps | "children" | "dangerouslySetInnerHTML"
  >;

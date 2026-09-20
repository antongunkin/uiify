import type { ReactElement, ReactNode, Ref } from "react";
import { expect, it } from "vitest";
import { DialogContent, DialogTrigger } from "./Dialog.js";

function CustomButton(props: {
  readonly children?: ReactNode;
  readonly onClick?: () => void;
  readonly ref?: Ref<HTMLButtonElement>;
}) {
  return <button {...props} type="button" />;
}
CustomButton.displayName = "CustomButton";

it("only accepts a native button or a button-forwarding component as `as`", () => {
  const elements: ReactElement[] = [
    <DialogTrigger key="default" target="settings">
      Open
    </DialogTrigger>,
    <DialogTrigger key="button" as="button" target="settings">
      Open
    </DialogTrigger>,
    <DialogTrigger key="custom" as={CustomButton} target="settings">
      Open
    </DialogTrigger>,
    // @ts-expect-error -- an anchor cannot fire invoker commands.
    <DialogTrigger key="anchor" as="a" target="settings">
      Open
    </DialogTrigger>,
    // @ts-expect-error -- target is the native relationship; it is required.
    <DialogTrigger key="missing-target">Open</DialogTrigger>,
    // @ts-expect-error -- the library owns type=button.
    <DialogTrigger key="submit" target="settings" type="submit">
      Open
    </DialogTrigger>,
    // @ts-expect-error -- the library owns the invoker attributes.
    <DialogTrigger key="popover" target="settings" popoverTarget="other">
      Open
    </DialogTrigger>,
  ];
  expect(elements).toHaveLength(7);
});

it("requires an accessible name on Dialog.Content — exactly one of aria-label / aria-labelledby", () => {
  const elements: ReactElement[] = [
    <DialogContent key="labelledby" aria-labelledby="settings-title" id="settings" />,
    <DialogContent key="label" aria-label="Settings" id="settings" />,
    // @ts-expect-error -- an unnamed dialog is an axe violation the browser cannot fall back for.
    <DialogContent key="unnamed" id="settings" />,
    // @ts-expect-error -- exactly one of the two — not both.
    <DialogContent
      key="both"
      aria-label="Settings"
      aria-labelledby="settings-title"
      id="settings"
    />,
    // @ts-expect-error -- id is the native relationship; it is required.
    <DialogContent key="missing-id" aria-label="Settings" />,
    // @ts-expect-error -- open is native state; the part is always initially closed.
    <DialogContent key="open" aria-label="Settings" id="settings" open />,
    // @ts-expect-error -- popover belongs to @gunkin/uiify/elements/popover, not dialog.
    <DialogContent key="popover" aria-label="Settings" id="settings" popover="auto" />,
  ];
  expect(elements).toHaveLength(7);
});

import type { ReactElement, ReactNode, Ref } from "react";
import { expect, it } from "vitest";
import { NativeDialogContent, NativeDialogTrigger } from "./NativeDialog.js";

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
    <NativeDialogTrigger key="default" target="settings">
      Open
    </NativeDialogTrigger>,
    <NativeDialogTrigger key="button" as="button" target="settings">
      Open
    </NativeDialogTrigger>,
    <NativeDialogTrigger key="custom" as={CustomButton} target="settings">
      Open
    </NativeDialogTrigger>,
    // @ts-expect-error -- an anchor cannot fire invoker commands.
    <NativeDialogTrigger key="anchor" as="a" target="settings">
      Open
    </NativeDialogTrigger>,
    // @ts-expect-error -- target is the native relationship; it is required.
    <NativeDialogTrigger key="missing-target">Open</NativeDialogTrigger>,
    // type="button" is a default; consumers may replace it.
    <NativeDialogTrigger key="submit" target="settings" type="submit">
      Open
    </NativeDialogTrigger>,
    // @ts-expect-error -- popover invoker attributes are not part of a command invoker.
    <NativeDialogTrigger key="popover" target="settings" popoverTarget="other">
      Open
    </NativeDialogTrigger>,
  ];
  expect(elements).toHaveLength(7);
});

it("requires an accessible name on NativeDialog.Content — exactly one of aria-label / aria-labelledby", () => {
  const elements: ReactElement[] = [
    <NativeDialogContent key="labelledby" aria-labelledby="settings-title" id="settings" />,
    <NativeDialogContent key="label" aria-label="Settings" id="settings" />,
    // @ts-expect-error -- an unnamed dialog is an axe violation the browser cannot fall back for.
    <NativeDialogContent key="unnamed" id="settings" />,
    // @ts-expect-error -- exactly one of the two — not both.
    <NativeDialogContent
      key="both"
      aria-label="Settings"
      aria-labelledby="settings-title"
      id="settings"
    />,
    // @ts-expect-error -- id is the native relationship; it is required.
    <NativeDialogContent key="missing-id" aria-label="Settings" />,
    // @ts-expect-error -- open is native state; the part is always initially closed.
    <NativeDialogContent key="open" aria-label="Settings" id="settings" open />,
    // @ts-expect-error -- popover belongs to @gunkin/uiify/elements/popover, not dialog.
    <NativeDialogContent key="popover" aria-label="Settings" id="settings" popover="auto" />,
  ];
  expect(elements).toHaveLength(7);
});

import type { ReactElement, ReactNode, Ref } from "react";
import { expect, it } from "vitest";
import { DialogTrigger } from "./DialogParts.js";

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
    // type="button" is a default; consumers may replace it.
    <DialogTrigger key="submit" target="settings" type="submit">
      Open
    </DialogTrigger>,
    // @ts-expect-error -- popover invoker attributes are not part of a command invoker.
    <DialogTrigger key="popover" target="settings" popoverTarget="other">
      Open
    </DialogTrigger>,
  ];
  expect(elements).toHaveLength(7);
});

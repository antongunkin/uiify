import type { ReactElement, ReactNode, Ref } from "react";
import { expect, it } from "vitest";
import { NativeInvoker } from "./NativeInvoker.js";

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
    <NativeInvoker key="default" command="show-modal" commandfor="settings">
      Open
    </NativeInvoker>,
    <NativeInvoker key="button" as="button" command="show-modal" commandfor="settings">
      Open
    </NativeInvoker>,
    <NativeInvoker key="custom" as={CustomButton} command="show-modal" commandfor="settings">
      Open
    </NativeInvoker>,
    // @ts-expect-error -- an anchor cannot fire invoker commands.
    <NativeInvoker key="anchor" as="a" command="show-modal" commandfor="settings">
      Open
    </NativeInvoker>,
    // @ts-expect-error -- command is required.
    <NativeInvoker key="missing-command" commandfor="settings">
      Open
    </NativeInvoker>,
    // @ts-expect-error -- commandfor is required.
    <NativeInvoker key="missing-commandfor" command="show-modal">
      Open
    </NativeInvoker>,
    // @ts-expect-error -- an arbitrary string is not a NativeCommand.
    <NativeInvoker key="bad-command" command="open-sesame" commandfor="settings">
      Open
    </NativeInvoker>,
    // type="button" is a default; consumers may replace it.
    <NativeInvoker key="submit" command="show-modal" commandfor="settings" type="submit">
      Open
    </NativeInvoker>,
    // @ts-expect-error -- popover invoker attributes are not part of a command invoker; use elements/NativePopover.
    <NativeInvoker key="popover" command="show-modal" commandfor="settings" popoverTarget="other">
      Open
    </NativeInvoker>,
  ];
  expect(elements).toHaveLength(9);
});

it("accepts a custom `--*` command", () => {
  const element = (
    <NativeInvoker command="--reveal" commandfor="details">
      Open
    </NativeInvoker>
  );
  expect(element).toBeDefined();
});

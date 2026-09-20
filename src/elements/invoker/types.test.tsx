import type { ReactElement, ReactNode, Ref } from "react";
import { expect, it } from "vitest";
import { Invoker } from "./Invoker.js";

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
    <Invoker key="default" command="show-modal" commandfor="settings">
      Open
    </Invoker>,
    <Invoker key="button" as="button" command="show-modal" commandfor="settings">
      Open
    </Invoker>,
    <Invoker key="custom" as={CustomButton} command="show-modal" commandfor="settings">
      Open
    </Invoker>,
    // @ts-expect-error -- an anchor cannot fire invoker commands.
    <Invoker key="anchor" as="a" command="show-modal" commandfor="settings">
      Open
    </Invoker>,
    // @ts-expect-error -- command is required.
    <Invoker key="missing-command" commandfor="settings">
      Open
    </Invoker>,
    // @ts-expect-error -- commandfor is required.
    <Invoker key="missing-commandfor" command="show-modal">
      Open
    </Invoker>,
    // @ts-expect-error -- an arbitrary string is not a NativeCommand.
    <Invoker key="bad-command" command="open-sesame" commandfor="settings">
      Open
    </Invoker>,
    // @ts-expect-error -- the library owns type=button.
    <Invoker key="submit" command="show-modal" commandfor="settings" type="submit">
      Open
    </Invoker>,
    // @ts-expect-error -- the library owns the invoker attributes; use popover elements/Popover instead.
    <Invoker key="popover" command="show-modal" commandfor="settings" popoverTarget="other">
      Open
    </Invoker>,
  ];
  expect(elements).toHaveLength(9);
});

it("accepts a custom `--*` command", () => {
  const element = (
    <Invoker command="--reveal" commandfor="details">
      Open
    </Invoker>
  );
  expect(element).toBeDefined();
});

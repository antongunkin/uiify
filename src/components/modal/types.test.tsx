import type { ReactElement, ReactNode, Ref } from "react";
import { expect, it } from "vitest";
import { ModalTrigger } from "./ModalParts.js";

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
    <ModalTrigger key="default" target="settings">
      Open
    </ModalTrigger>,
    <ModalTrigger key="button" as="button" target="settings">
      Open
    </ModalTrigger>,
    <ModalTrigger key="custom" as={CustomButton} target="settings">
      Open
    </ModalTrigger>,
    // @ts-expect-error -- an anchor cannot fire invoker commands.
    <ModalTrigger key="anchor" as="a" target="settings">
      Open
    </ModalTrigger>,
    // @ts-expect-error -- target is the native relationship; it is required.
    <ModalTrigger key="missing-target">Open</ModalTrigger>,
    // @ts-expect-error -- the library owns type=button.
    <ModalTrigger key="submit" target="settings" type="submit">
      Open
    </ModalTrigger>,
    // @ts-expect-error -- the library owns the invoker attributes.
    <ModalTrigger key="popover" target="settings" popoverTarget="other">
      Open
    </ModalTrigger>,
  ];
  expect(elements).toHaveLength(7);
});

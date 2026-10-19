interface ComposingKeyEventLike {
  readonly isComposing?: boolean;
  readonly keyCode?: number;
  readonly nativeEvent?: { readonly isComposing?: boolean; readonly keyCode?: number };
}

/**
 * True while an IME composition owns the key. Safari fires the final keydown after
 * `compositionend` with `isComposing === false` and `keyCode === 229`, so both signals
 * are checked. React synthetic events expose `isComposing` only on `nativeEvent`.
 */
function isComposingKeyEvent(event: ComposingKeyEventLike): boolean {
  return (
    event.isComposing === true ||
    event.nativeEvent?.isComposing === true ||
    event.keyCode === 229 ||
    event.nativeEvent?.keyCode === 229
  );
}

export { isComposingKeyEvent };

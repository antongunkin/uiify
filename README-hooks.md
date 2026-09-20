# @gunkin/uiify/hooks

SSR-safe, tree-shakeable React 19 hooks — the substrate for `@gunkin/uiify/core` and
`@gunkin/uiify/components`. Unstyled, zero runtime dependencies (React is a peer dep).

## Install

```bash
npm install @gunkin/uiify/hooks
```

## Hooks

**State:** `useToggle`, `usePrevious`, `useControllableState`, `useLocalStorage`

**Effects / timing:** `useTimeout`, `useInterval`, `useDebounce`,
`useDebouncedCallback`, `useThrottledCallback`, `useUpdateEffect`

**Sensors:** `useEventListener`, `useMediaQuery`, `useResizeObserver`,
`useIntersectionObserver`, `useWindowSize`

**UI:** `useClickOutside`, `useFocusWithin`, `useHover`, `useLockBodyScroll`

**Substrate:** `useIsomorphicLayoutEffect`, `useEventCallback`, `useIsMounted`,
`useUnmount`, `useMergedRefs`, `useId`

Each hook is independently importable and tree-shakes when unused. The complete
package remains well below its enforced 10 kB minified + brotlied budget.

### `useControllableState` (keystone)

Unifies controlled and uncontrolled state — the foundation every `uiify`
component is built on.

```tsx
const [value, setValue] = useControllableState({
  value: props.value, // controlled when defined
  defaultValue: props.defaultValue, // initial value otherwise
  onChange: props.onValueChange, // called on every change
});
```

All hooks are SSR-safe by construction and documented with TSDoc in source.

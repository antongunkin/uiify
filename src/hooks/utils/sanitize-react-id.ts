/** Strip React `useId` colons so the result is safe in CSS/DOM identifiers. */
export function sanitizeReactId(reactId: string): string {
  return reactId.replace(/:/g, "");
}

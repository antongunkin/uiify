export interface FieldIds {
  readonly controlId: string;
  readonly descriptionId: string;
  readonly errorId: string;
  readonly labelId: string;
}

/** Deterministic ids shared by Field.Root and every part — each part derives
 * these itself from the same `fieldId` the consumer passes to it, rather
 * than relying on props injected via child traversal (which breaks across
 * a Fragment or an intermediate wrapper component). */
export function getFieldIds(fieldId: string): FieldIds {
  return {
    controlId: `${fieldId}-control`,
    descriptionId: `${fieldId}-description`,
    errorId: `${fieldId}-error`,
    labelId: `${fieldId}-label`,
  };
}

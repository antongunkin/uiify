export interface RatingProps {
  readonly id: string;
  readonly defaultValue?: number;
  readonly max?: number;
  readonly readOnly?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly "aria-label"?: string;
}

export interface RatingClientProps extends RatingProps {
  readonly value?: number;
  readonly onValueChange?: (value: number) => void;
}

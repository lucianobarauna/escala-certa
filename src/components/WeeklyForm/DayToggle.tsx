import { CheckIcon } from 'lucide-react';
import { Checkbox } from 'react-aria-components';

type DayToggleProps = {
  shortName: string;
  accessibleName: string;
  isSelected: boolean;
  isDisabled: boolean;
  onChange: () => void;
};

export function DayToggle({
  shortName,
  accessibleName,
  isSelected,
  isDisabled,
  onChange,
}: DayToggleProps) {
  return (
    <Checkbox
      aria-label={accessibleName}
      isSelected={isSelected}
      isDisabled={isDisabled}
      onChange={onChange}
      className="group relative flex min-h-8 cursor-pointer items-center gap-2 rounded-lg border border-input px-2.5 text-sm outline-none data-focus-visible:border-ring data-focus-visible:ring-3 data-focus-visible:ring-ring/50 data-selected:border-primary data-selected:bg-primary/5 data-disabled:cursor-not-allowed data-disabled:opacity-50"
    >
      <span
        aria-hidden="true"
        className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input group-data-selected:border-primary group-data-selected:bg-primary"
      >
        <CheckIcon className="hidden size-3 text-primary-foreground group-data-selected:block" />
      </span>
      {shortName}
    </Checkbox>
  );
}

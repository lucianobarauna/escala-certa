import { Radio, type RadioProps } from 'react-aria-components';

type ChoiceOptionProps = Omit<RadioProps, 'children' | 'className'> & {
  label: string;
  description?: string;
};

export function ChoiceOption({ label, description, ...props }: ChoiceOptionProps) {
  return (
    <Radio
      {...props}
      className="group relative flex min-h-6 cursor-pointer items-start gap-3 rounded-lg border border-input p-3 outline-none data-focus-visible:border-ring data-focus-visible:ring-3 data-focus-visible:ring-ring/50 data-selected:border-primary data-selected:bg-primary/5 data-disabled:opacity-50"
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-input group-data-selected:border-primary group-data-selected:bg-primary"
      >
        <span className="hidden size-2 rounded-full bg-primary-foreground group-data-selected:block" />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{label}</span>{' '}
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
      </span>
    </Radio>
  );
}

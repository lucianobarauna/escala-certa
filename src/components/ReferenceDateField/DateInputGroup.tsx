import { CalendarIcon } from 'lucide-react';
import { DateInput, DateSegment, Group } from 'react-aria-components';

import { Button } from '@/components/ui/button';

const OPEN_CALENDAR_LABEL = 'Abrir calendário';

export function DateInputGroup() {
  return (
    <Group className="flex h-9 w-fit items-center gap-1 rounded-lg border border-input bg-transparent pr-1 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 in-data-invalid:border-destructive dark:bg-input/30">
      <DateInput className="flex items-center px-2.5 text-sm">
        {(segment) => (
          <DateSegment
            segment={segment}
            className="inline-flex min-w-6 justify-center rounded-sm py-1 tabular-nums outline-none data-focused:bg-primary data-focused:text-primary-foreground data-placeholder:text-muted-foreground"
          />
        )}
      </DateInput>
      <Button variant="ghost" size="icon-xs" aria-label={OPEN_CALENDAR_LABEL}>
        <CalendarIcon aria-hidden="true" />
      </Button>
    </Group>
  );
}

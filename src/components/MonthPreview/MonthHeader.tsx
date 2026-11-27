import { useRef } from 'react';

import { Button } from '@/components/ui/button';

import { CURRENT_MONTH_LABEL } from './month-preview.constants';
import type { MonthPreviewNavigation } from './month-preview.types';
import { MonthStepButton } from './MonthStepButton';

type MonthHeaderProps = {
  label: string;
  headingId: string;
  navigation: MonthPreviewNavigation;
};

export function MonthHeader({ label, headingId, navigation }: MonthHeaderProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  function goToCurrentMonth() {
    navigation.goToToday();
    headingRef.current?.focus();
  }
  return (
    <header className="flex flex-wrap items-center gap-2">
      <h2 id={headingId} ref={headingRef} tabIndex={-1} className="mr-auto text-lg font-semibold">
        {label}
      </h2>
      {!navigation.isCurrentMonth && (
        <Button
          variant="ghost"
          className="h-auto min-h-11 whitespace-normal"
          onPress={goToCurrentMonth}
        >
          {CURRENT_MONTH_LABEL}
        </Button>
      )}
      <MonthStepButton direction="previous" onPress={navigation.goToPrevious} />
      <MonthStepButton direction="next" onPress={navigation.goToNext} />
    </header>
  );
}

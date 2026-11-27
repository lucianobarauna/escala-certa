import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { NEXT_MONTH_LABEL, PREVIOUS_MONTH_LABEL } from './month-preview.constants';

type MonthStepButtonProps = {
  direction: 'previous' | 'next';
  onPress: () => void;
};

export function MonthStepButton({ direction, onPress }: MonthStepButtonProps) {
  const isPrevious = direction === 'previous';
  const Icon = isPrevious ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <Button
      variant="outline"
      size="icon-lg"
      className="size-11"
      aria-label={isPrevious ? PREVIOUS_MONTH_LABEL : NEXT_MONTH_LABEL}
      onPress={onPress}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}

import type { ReactNode } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TextSizeButtonProps = {
  label: string;
  blockedReasonId: string | null;
  onPress: () => void;
  children: ReactNode;
};

export function TextSizeButton({ label, blockedReasonId, onPress, children }: TextSizeButtonProps) {
  const isBlocked = blockedReasonId !== null;
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={isBlocked}
      aria-describedby={blockedReasonId ?? undefined}
      onClick={onPress}
      className={cn(
        buttonVariants({ variant: 'outline', size: 'lg' }),
        'min-w-11',
        isBlocked && 'cursor-not-allowed opacity-50',
      )}
    >
      {children}
    </button>
  );
}

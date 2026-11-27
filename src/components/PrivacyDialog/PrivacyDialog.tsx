import type { Ref } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { MetricsConsent } from '@/hooks/useMetricsConsent';

import { MetricsToggle } from './MetricsToggle';
import { CLOSE_LABEL, PRIVACY_TITLE } from './privacy-dialog.constants';
import { PrivacyText } from './PrivacyText';

type PrivacyDialogProps = {
  metrics: MetricsConsent;
  triggerRef?: Ref<HTMLButtonElement>;
};

export function PrivacyDialog({ metrics, triggerRef }: PrivacyDialogProps) {
  return (
    <DialogTrigger>
      <Button
        ref={triggerRef}
        variant="link"
        className="h-auto min-h-6 px-0 text-muted-foreground underline"
      >
        {PRIVACY_TITLE}
      </Button>
      <Dialog
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>{PRIVACY_TITLE}</DialogTitle>
        </DialogHeader>
        <PrivacyText />
        <MetricsToggle metrics={metrics} />
        <DialogClose className="h-11 justify-self-end px-4">{CLOSE_LABEL}</DialogClose>
      </Dialog>
    </DialogTrigger>
  );
}

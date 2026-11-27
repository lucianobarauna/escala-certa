import { Share2Icon } from 'lucide-react';
import { useId } from 'react';

import { Button } from '@/components/ui/button';

import { ManualCopyField } from './ManualCopyField';
import { COPIED_MESSAGE, INCOMPLETE_REASON, SHARE_LABEL } from './share-button.constants';
import { useShare } from './useShare';

type ShareButtonProps = {
  name: string;
  isComplete: boolean;
};

export function ShareButton({ name, isComplete }: ShareButtonProps) {
  const reasonId = useId();
  const { status, share } = useShare(name);
  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        size="lg"
        className="h-11 px-4"
        isDisabled={!isComplete}
        aria-describedby={isComplete ? undefined : reasonId}
        onPress={share}
      >
        <Share2Icon aria-hidden="true" />
        {SHARE_LABEL}
      </Button>
      {!isComplete && (
        <p id={reasonId} className="text-sm text-muted-foreground">
          {INCOMPLETE_REASON}
        </p>
      )}
      <output className="text-sm font-medium">
        {status.kind === 'copied' ? COPIED_MESSAGE : ''}
      </output>
      {status.kind === 'manual' && <ManualCopyField url={status.url} />}
    </div>
  );
}

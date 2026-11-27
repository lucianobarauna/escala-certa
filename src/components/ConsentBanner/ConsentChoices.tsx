import { Button } from '@/components/ui/button';

import { ACCEPT_LABEL, REFUSE_LABEL } from './consent-banner.constants';

type ConsentChoicesProps = {
  onAccept: () => void;
  onRefuse: () => void;
};

const CHOICE_BUTTON_CLASS = 'h-11 flex-1 px-4 sm:flex-none';

export function ConsentChoices({ onAccept, onRefuse }: ConsentChoicesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" className={CHOICE_BUTTON_CLASS} onPress={onAccept}>
        {ACCEPT_LABEL}
      </Button>
      <Button variant="outline" className={CHOICE_BUTTON_CLASS} onPress={onRefuse}>
        {REFUSE_LABEL}
      </Button>
    </div>
  );
}

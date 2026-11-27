import { AArrowDownIcon, AArrowUpIcon } from 'lucide-react';

import {
  DECREASE_LABEL,
  DEFAULT_TEXT_SIZE,
  INCREASE_LABEL,
  RESET_LABEL,
} from './text-size.constants';
import { TextSizeButton } from './TextSizeButton';
import type { TextSize } from './useTextSize';

type TextSizeButtonsProps = {
  textSize: TextSize;
  reasonId: string;
};

export function TextSizeButtons({ textSize, reasonId }: TextSizeButtonsProps) {
  const isDefault = textSize.level === DEFAULT_TEXT_SIZE;
  return (
    <>
      <TextSizeButton
        label={DECREASE_LABEL}
        blockedReasonId={textSize.decreaseBlockedReason && reasonId}
        onPress={textSize.decrease}
      >
        <AArrowDownIcon aria-hidden="true" />
      </TextSizeButton>
      <TextSizeButton
        label={RESET_LABEL}
        blockedReasonId={isDefault ? reasonId : null}
        onPress={textSize.reset}
      >
        {RESET_LABEL}
      </TextSizeButton>
      <TextSizeButton
        label={INCREASE_LABEL}
        blockedReasonId={textSize.increaseBlockedReason && reasonId}
        onPress={textSize.increase}
      >
        <AArrowUpIcon aria-hidden="true" />
      </TextSizeButton>
    </>
  );
}

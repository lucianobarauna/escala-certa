import { useId } from 'react';

import { TEXT_SIZE_GROUP_LABEL } from './text-size.constants';
import { TextSizeButtons } from './TextSizeButtons';
import { useTextSize } from './useTextSize';

export function TextSizeControl() {
  const reasonId = useId();
  const textSize = useTextSize();
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="sr-only">{TEXT_SIZE_GROUP_LABEL}</legend>
      <div className="flex flex-wrap items-center gap-2">
        <TextSizeButtons textSize={textSize} reasonId={reasonId} />
        <output className="text-sm font-medium">{textSize.message}</output>
      </div>
      <p id={reasonId} className="text-sm text-muted-foreground">
        {textSize.decreaseBlockedReason ?? textSize.increaseBlockedReason}
      </p>
    </fieldset>
  );
}

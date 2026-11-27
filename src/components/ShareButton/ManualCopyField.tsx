import { useId } from 'react';

import { Input } from '@/components/ui/input';

import { MANUAL_COPY_LABEL } from './share-button.constants';

function selectOnMount(input: HTMLInputElement | null) {
  input?.select();
}

export function ManualCopyField({ url }: { url: string }) {
  const inputId = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm">
        {MANUAL_COPY_LABEL}
      </label>
      <Input
        id={inputId}
        ref={selectOnMount}
        readOnly
        value={url}
        onFocus={(event) => event.currentTarget.select()}
        className="h-11"
      />
    </div>
  );
}

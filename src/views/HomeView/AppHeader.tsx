import { TextSizeControl } from '@/components/TextSizeControl/TextSizeControl';

import { APP_TAGLINE, APP_TITLE } from './home-view.constants';

export function AppHeader() {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
        <p className="text-muted-foreground">{APP_TAGLINE}</p>
      </div>
      <TextSizeControl />
    </header>
  );
}

import { ConfigNotice } from '@/components/ConfigNotice/ConfigNotice';

import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';
import { getDocumentTitle } from './home-view.utils';
import { ScheduleInput } from './ScheduleInput';
import { SchedulePreview } from './SchedulePreview';
import { useHomeView } from './useHomeView';

export function HomeView() {
  const { config, navigation, metrics, isComplete } = useHomeView();
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-8 px-4 py-6">
      <title>{getDocumentTitle(config.draft.name)}</title>
      <AppHeader />
      <main className="@container flex flex-col gap-6">
        <ConfigNotice issues={config.issues} />
        <div className="grid gap-10 @home-columns:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] @home-columns:items-start">
          <ScheduleInput draft={config.draft} onChange={config.updateDraft} />
          <SchedulePreview draft={config.draft} navigation={navigation} isComplete={isComplete} />
        </div>
      </main>
      <AppFooter metrics={metrics} />
    </div>
  );
}

import type { MonthPreviewNavigation } from '@/components/MonthPreview/month-preview.types';
import { MonthPreview } from '@/components/MonthPreview/MonthPreview';
import { ShareButton } from '@/components/ShareButton/ShareButton';
import type { ScheduleDraft } from '@/types/schedule';

type SchedulePreviewProps = {
  draft: ScheduleDraft;
  navigation: MonthPreviewNavigation;
  isComplete: boolean;
};

export function SchedulePreview({ draft, navigation, isComplete }: SchedulePreviewProps) {
  const name = draft.name.trim();
  return (
    <div className="flex flex-col gap-4 @home-columns:sticky @home-columns:top-6">
      {name && <p className="text-xl font-semibold break-words">{name}</p>}
      <MonthPreview draft={draft} navigation={navigation} />
      <ShareButton name={draft.name} isComplete={isComplete} />
    </div>
  );
}

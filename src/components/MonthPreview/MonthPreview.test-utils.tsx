import '@/index.css';
import { renderPtBr } from '@/lib/i18n.test-utils';
import type { ScheduleDraft } from '@/types/schedule';
import { useMonthNavigation } from '@/views/HomeView/useMonthNavigation';

import { MonthPreview } from './MonthPreview';

export const TODAY_NAME =
  '26 de novembro de 2026, quinta-feira, hoje, folga, saída do plantão pela manhã';

export function MonthPreviewHarness({ draft }: { draft: ScheduleDraft }) {
  const navigation = useMonthNavigation();
  return <MonthPreview draft={draft} navigation={navigation} />;
}

export function renderPreview(draft: ScheduleDraft, width?: string) {
  return renderPtBr(
    <div style={{ width }}>
      <MonthPreviewHarness draft={draft} />
    </div>,
  );
}

export function getDayCell(name: string) {
  const label = [...document.querySelectorAll('li > .sr-only')].find(
    (element) => element.textContent === name,
  );
  const cell = label?.closest('li');
  if (!cell) throw new Error(`Dia não encontrado: ${name}`);
  return cell;
}

import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { shiftDraft } from '@/domain/schedule/fixtures/draft.builders';
import { renderPtBr } from '@/lib/i18n.test-utils';

import { MonthPreviewHarness, renderPreview } from './MonthPreview.test-utils';

const NIGHT_SHIFT = shiftDraft({ startDate: '2026-11-01', cycle: '12x36', turn: 'night' });
const SHIFT_24X48 = shiftDraft({ startDate: '2026-12-01', cycle: '24x48' });

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 10, 26, 12));
});

afterEach(() => {
  vi.useRealTimers();
});

test('summarizes the shown month in a status region', async () => {
  const { getByRole } = await renderPreview(NIGHT_SHIFT);
  await expect
    .element(getByRole('status'))
    .toHaveTextContent(
      'Novembro de 2026: 15 dias de plantão, 15 dias de folga (todos com saída do plantão pela manhã)',
    );
});

test('updates the same status region when the month changes', async () => {
  const { getByRole } = await renderPreview(SHIFT_24X48);
  const status = getByRole('status').element();
  await getByRole('button', { name: 'Próximo mês' }).click();
  await expect
    .element(getByRole('status'))
    .toHaveTextContent(
      'Dezembro de 2026: 11 dias de plantão, 20 dias de folga (10 com saída do plantão pela manhã)',
    );
  expect(getByRole('status').element()).toBe(status);
});

test('updates the summary when the schedule changes', async () => {
  const { getByRole, rerender } = await renderPtBr(<MonthPreviewHarness draft={NIGHT_SHIFT} />);
  await rerender(<MonthPreviewHarness draft={shiftDraft({ ...NIGHT_SHIFT.shift, turn: 'day' })} />);
  await expect
    .element(getByRole('status'))
    .toHaveTextContent('Novembro de 2026: 15 dias de plantão, 15 dias de folga');
});

test('replaces the summary with guidance while the schedule is incomplete', async () => {
  const { getByRole } = await renderPreview(shiftDraft({ startDate: '2026-11-01' }));
  await expect
    .element(getByRole('status'))
    .toHaveTextContent('Preencha a escala para ver os dias no calendário.');
});

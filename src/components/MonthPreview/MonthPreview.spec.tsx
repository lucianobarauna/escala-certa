import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { createEmptyDraft } from '@/domain/schedule/config.utils';
import { shiftDraft, weeklyDraft } from '@/domain/schedule/fixtures/draft.builders';

import { getDayCell, renderPreview, TODAY_NAME } from './MonthPreview.test-utils';

const NIGHT_SHIFT = shiftDraft({ startDate: '2026-11-01', cycle: '12x36', turn: 'night' });
const WEEKLY_5X2 = weeklyDraft({ modality: '5x2', offDays: [[0, 6]], anchorDate: '2026-11-01' });

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 10, 26, 12));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('given a complete 12x36 night shift', () => {
  test('when it is rendered, then the header shows the current month in pt-BR', async () => {
    const { getByRole } = await renderPreview(NIGHT_SHIFT);
    await expect.element(getByRole('heading', { level: 2 })).toHaveTextContent('Novembro de 2026');
  });

  test('when it is rendered, then today has the full name and a text badge', async () => {
    await renderPreview(NIGHT_SHIFT);
    const today = getDayCell(TODAY_NAME);
    expect(today.textContent).toContain('Hoje');
    expect(today.querySelector('svg.lucide-sunrise')).not.toBeNull();
  });

  test('when it is rendered, then a work day shows its icon and text', async () => {
    await renderPreview(NIGHT_SHIFT);
    const workDay = getDayCell('1 de novembro de 2026, domingo, trabalha');
    expect(workDay.querySelector('svg.lucide-briefcase')).not.toBeNull();
    expect(workDay.textContent).toContain('Trabalha');
  });

  test('when it is rendered, then the legend lists only work and shift exit', async () => {
    const { getByRole } = await renderPreview(NIGHT_SHIFT);
    const legend = getByRole('heading', { name: 'Legenda' }).element().parentElement;
    expect(legend?.textContent).toContain('Sai do plantão pela manhã');
    expect(legend?.querySelectorAll('li')).toHaveLength(2);
  });

  test('when the next month is shown, then the back-to-current-month action appears', async () => {
    const { getByRole } = await renderPreview(NIGHT_SHIFT);
    await getByRole('button', { name: 'Próximo mês' }).click();
    await expect.element(getByRole('heading', { level: 2 })).toHaveTextContent('Dezembro de 2026');
    await getByRole('button', { name: 'Voltar ao mês atual' }).click();
    await expect.element(getByRole('heading', { level: 2 })).toHaveTextContent('Novembro de 2026');
  });

  test('when a day is clicked, then the schedule does not change', async () => {
    const { getByRole } = await renderPreview(NIGHT_SHIFT);
    const before = getByRole('status').element().textContent;
    getDayCell(TODAY_NAME).click();
    await expect.element(getByRole('status')).toHaveTextContent(before ?? '');
    expect(getDayCell(TODAY_NAME)).toBeDefined();
  });
});

describe('given a weekly 5x2 schedule', () => {
  test('when it is rendered, then the legend has no shift exit entry', async () => {
    const { getByRole } = await renderPreview(WEEKLY_5X2);
    const legend = getByRole('heading', { name: 'Legenda' }).element().parentElement;
    expect(legend?.textContent).not.toContain('saída do plantão');
    expect(legend?.querySelectorAll('li')).toHaveLength(2);
  });
});

describe('given an incomplete schedule', () => {
  test('when it is rendered, then it shows the current month without states', async () => {
    await renderPreview(createEmptyDraft());
    const today = getDayCell('26 de novembro de 2026, quinta-feira, hoje');
    expect(today.querySelector('svg')).toBeNull();
  });

  test('when it is rendered, then it guides what is missing and hides the legend', async () => {
    const { getByRole } = await renderPreview(shiftDraft({ cycle: '24x48' }));
    await expect
      .element(getByRole('status'))
      .toHaveTextContent('Preencha a data de início para ver os dias no calendário.');
    await expect.element(getByRole('heading', { name: 'Legenda' })).not.toBeInTheDocument();
  });
});

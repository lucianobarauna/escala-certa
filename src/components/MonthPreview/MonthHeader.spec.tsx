import { CalendarDate } from '@internationalized/date';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import type { MonthPreviewNavigation } from './month-preview.types';
import { MonthHeader } from './MonthHeader';

function createNavigation(overrides: Partial<MonthPreviewNavigation> = {}): MonthPreviewNavigation {
  return {
    month: { year: 2026, month: 11 },
    today: new CalendarDate(2026, 11, 26),
    isCurrentMonth: true,
    goToPrevious: vi.fn(),
    goToNext: vi.fn(),
    goToToday: vi.fn(),
    ...overrides,
  };
}

function renderHeader(navigation: MonthPreviewNavigation) {
  return render(<MonthHeader label="Novembro de 2026" headingId="month" navigation={navigation} />);
}

test('shows the month and year as a heading', async () => {
  const { getByRole } = await renderHeader(createNavigation());
  await expect.element(getByRole('heading', { level: 2 })).toHaveTextContent('Novembro de 2026');
});

test('goes to the previous month', async () => {
  const navigation = createNavigation();
  const { getByRole } = await renderHeader(navigation);
  await getByRole('button', { name: 'Mês anterior' }).click();
  expect(navigation.goToPrevious).toHaveBeenCalledOnce();
});

test('goes to the next month', async () => {
  const navigation = createNavigation();
  const { getByRole } = await renderHeader(navigation);
  await getByRole('button', { name: 'Próximo mês' }).click();
  expect(navigation.goToNext).toHaveBeenCalledOnce();
});

test('hides the back-to-current-month action while showing the current month', async () => {
  const { getByRole } = await renderHeader(createNavigation());
  await expect
    .element(getByRole('button', { name: 'Voltar ao mês atual' }))
    .not.toBeInTheDocument();
});

test('returns to the current month and moves focus to the month heading', async () => {
  const navigation = createNavigation({ isCurrentMonth: false });
  const { getByRole } = await renderHeader(navigation);
  await getByRole('button', { name: 'Voltar ao mês atual' }).click();
  expect(navigation.goToToday).toHaveBeenCalledOnce();
  await expect.element(getByRole('heading', { level: 2 })).toHaveFocus();
});

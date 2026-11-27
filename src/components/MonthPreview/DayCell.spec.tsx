import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import type { CalendarDay } from '@/types/schedule';

import { DayCell } from './DayCell';

function renderCell(day: Partial<CalendarDay>) {
  const cell: CalendarDay = {
    day: 15,
    state: 'work',
    isToday: false,
    accessibleName: '15 de novembro de 2026, domingo, trabalha',
    ...day,
  };
  return render(
    <ul>
      <DayCell day={cell} weekday="Dom" />
    </ul>,
  );
}

test('exposes the full accessible name of the day', async () => {
  const { getByText } = await renderCell({});
  await expect.element(getByText('15 de novembro de 2026, domingo, trabalha')).toBeInTheDocument();
});

test('shows the state with an icon and a text label', async () => {
  const { getByRole } = await renderCell({ state: 'off-exit' });
  const cell = getByRole('listitem').element();
  expect(cell.querySelector('svg.lucide-sunrise')).not.toBeNull();
  expect(cell.textContent).toContain('Folga (saída do plantão)');
});

test('marks today with a visible text badge, not only color', async () => {
  const { getByText } = await renderCell({ isToday: true });
  await expect.element(getByText('Hoje', { exact: true })).toBeVisible();
});

test('shows no state label when the schedule is incomplete', async () => {
  const { getByRole } = await renderCell({ state: null });
  const cell = getByRole('listitem').element();
  expect(cell.querySelector('svg')).toBeNull();
  expect(cell.textContent).not.toMatch(/Trabalha|Folga/);
});

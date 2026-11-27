import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { ShiftForm } from '@/components/ShiftForm/ShiftForm';
import { WeeklyForm } from '@/components/WeeklyForm/WeeklyForm';
import { changeScheduleType, createEmptyDraft } from '@/domain/schedule/config.utils';
import { clickLabelOf } from '@/lib/click.test-utils';
import { renderPtBr } from '@/lib/i18n.test-utils';

import { ScheduleTypeSelector } from './ScheduleTypeSelector';

function Harness() {
  const [draft, setDraft] = useState(createEmptyDraft());
  return (
    <>
      <ScheduleTypeSelector
        value={draft.type}
        onChange={(type) => setDraft(changeScheduleType(draft, type))}
      />
      {draft.type === 'shift' && <ShiftForm shift={draft.shift} onChange={vi.fn()} />}
      {draft.type === 'weekly' && <WeeklyForm draft={draft} onChange={setDraft} />}
    </>
  );
}

test('offers the two types with none selected at first', async () => {
  const { getByRole } = await renderPtBr(<Harness />);
  await expect.element(getByRole('radio', { name: /Plantão/ })).not.toBeChecked();
  await expect.element(getByRole('radio', { name: /Semanal/ })).not.toBeChecked();
});

test('includes the description in the accessible name of each option', async () => {
  const { getByRole } = await renderPtBr(<Harness />);
  await expect
    .element(getByRole('radio', { name: /Plantão.*12x36, 24x48 ou 24x72/ }))
    .toBeVisible();
  await expect.element(getByRole('radio', { name: /Semanal.*5x2 ou 6x1/ })).toBeVisible();
});

test('keeps only one type selected at a time', async () => {
  const { getByRole } = await renderPtBr(<Harness />);
  await clickLabelOf(getByRole('radio', { name: /Plantão/ }));
  await clickLabelOf(getByRole('radio', { name: /Semanal/ }));
  await expect.element(getByRole('radio', { name: /Plantão/ })).not.toBeChecked();
  await expect.element(getByRole('radio', { name: /Semanal/ })).toBeChecked();
});

test('shows only the shift fields after choosing shift', async () => {
  const { getByRole, getByText } = await renderPtBr(<Harness />);
  await clickLabelOf(getByRole('radio', { name: /Plantão/ }));
  await expect.element(getByText('Data de início do plantão')).toBeVisible();
  await expect.element(getByText('Modalidade', { exact: true })).not.toBeInTheDocument();
});

test('shows only the weekly fields after choosing weekly', async () => {
  const { getByRole, getByText } = await renderPtBr(<Harness />);
  await clickLabelOf(getByRole('radio', { name: /Semanal/ }));
  await expect.element(getByText('Modalidade', { exact: true })).toBeVisible();
  await expect.element(getByText('Data de início do plantão')).not.toBeInTheDocument();
});

test('moves the selection with the arrow keys', async () => {
  const { getByRole } = await renderPtBr(<Harness />);
  await clickLabelOf(getByRole('radio', { name: /Plantão/ }));
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(getByRole('radio', { name: /Semanal/ })).toBeChecked();
});

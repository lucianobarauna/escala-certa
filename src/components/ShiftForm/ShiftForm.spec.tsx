import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { createEmptyDraft } from '@/domain/schedule/config.utils';
import { clickLabelOf } from '@/lib/click.test-utils';
import { renderPtBr } from '@/lib/i18n.test-utils';
import type { ShiftDraft } from '@/types/schedule';

import { ShiftForm } from './ShiftForm';

function Harness({ spy }: { spy?: (shift: ShiftDraft) => void }) {
  const [shift, setShift] = useState(createEmptyDraft().shift);
  function handleChange(next: ShiftDraft) {
    setShift(next);
    spy?.(next);
  }
  return <ShiftForm shift={shift} onChange={handleChange} />;
}

test('hides the turn until the 12x36 cycle is chosen', async () => {
  const { getByRole } = await renderPtBr(<Harness />);
  await expect.element(getByRole('radiogroup', { name: /Turno/ })).not.toBeInTheDocument();
});

test('shows a required turn when the 12x36 cycle is chosen', async () => {
  const { getByRole } = await renderPtBr(<Harness />);
  await clickLabelOf(getByRole('radio', { name: /^12x36/ }));
  await expect.element(getByRole('radiogroup', { name: /Turno/ })).toBeRequired();
});

test('hides the turn again when another cycle is chosen', async () => {
  const { getByRole } = await renderPtBr(<Harness />);
  await clickLabelOf(getByRole('radio', { name: /^12x36/ }));
  await clickLabelOf(getByRole('radio', { name: /^24x48/ }));
  await expect.element(getByRole('radiogroup', { name: /Turno/ })).not.toBeInTheDocument();
});

test('discards the turn when the cycle stops being 12x36', async () => {
  const spy = vi.fn();
  const { getByRole } = await renderPtBr(<Harness spy={spy} />);
  await clickLabelOf(getByRole('radio', { name: /^12x36/ }));
  await clickLabelOf(getByRole('radio', { name: /Noturno/ }));
  await clickLabelOf(getByRole('radio', { name: /^24x72/ }));
  expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({ cycle: '24x72', turn: null }));
});

test('fills the draft with date, cycle and turn', async () => {
  const spy = vi.fn();
  const { getByRole } = await renderPtBr(<Harness spy={spy} />);
  await getByRole('spinbutton', { name: /dia/i }).click();
  await userEvent.keyboard('26112026');
  await clickLabelOf(getByRole('radio', { name: /^12x36/ }));
  await clickLabelOf(getByRole('radio', { name: /Diurno/ }));
  expect(spy).toHaveBeenLastCalledWith({ startDate: '2026-11-26', cycle: '12x36', turn: 'day' });
});

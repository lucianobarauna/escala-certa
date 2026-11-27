import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { clickLabelOf } from '@/lib/click.test-utils';
import { renderPtBr } from '@/lib/i18n.test-utils';

import { WeeklyFormHarness as Harness } from './WeeklyForm.test-utils';

test('starts with one week and no modality chosen', async () => {
  const { getByRole, getByText } = await renderPtBr(<Harness />);
  await expect.element(getByText('1 semana', { exact: true })).toBeVisible();
  await expect.element(getByRole('radio', { name: /^5x2/ })).not.toBeChecked();
  await expect.element(getByRole('group', { name: 'Semana 2' })).not.toBeInTheDocument();
});

test('adds and removes weeks within the 1 to 7 range', async () => {
  const { getByRole, getByText } = await renderPtBr(<Harness />);
  await getByRole('button', { name: 'Aumentar semanas' }).click();
  await expect.element(getByRole('group', { name: 'Semana 2' })).toBeVisible();
  await getByRole('button', { name: 'Reduzir semanas' }).click();
  await expect.element(getByText('1 semana', { exact: true })).toBeVisible();
  await expect.element(getByText('Mínimo de 1 semana.')).toBeVisible();
  await expect.element(getByRole('button', { name: 'Reduzir semanas' })).toBeDisabled();
});

test('stops adding weeks at seven and says why', async () => {
  const { getByRole, getByText } = await renderPtBr(<Harness />);
  for (let week = 1; week < 7; week += 1)
    await getByRole('button', { name: 'Aumentar semanas' }).click();
  await expect.element(getByText('Máximo de 7 semanas.')).toBeVisible();
  await expect.element(getByRole('button', { name: 'Aumentar semanas' })).toBeDisabled();
});

test('discards the extra weeks when the number of weeks is reduced', async () => {
  const spy = vi.fn();
  const { getByRole } = await renderPtBr(<Harness spy={spy} />);
  await clickLabelOf(getByRole('radio', { name: /^6x1/ }));
  await getByRole('button', { name: 'Aumentar semanas' }).click();
  await clickLabelOf(getByRole('checkbox', { name: /Domingo, semana 2/ }));
  await getByRole('button', { name: 'Reduzir semanas' }).click();
  expect(spy).toHaveBeenLastCalledWith(
    expect.objectContaining({ weekly: expect.objectContaining({ weeks: 1, offDays: [[]] }) }),
  );
});

test('fills the anchor date of week 1', async () => {
  const spy = vi.fn();
  const { getByRole } = await renderPtBr(<Harness spy={spy} />);
  await getByRole('spinbutton', { name: /dia/i }).click();
  await userEvent.keyboard('26112026');
  expect(spy).toHaveBeenLastCalledWith(
    expect.objectContaining({ weekly: expect.objectContaining({ anchorDate: '2026-11-26' }) }),
  );
});

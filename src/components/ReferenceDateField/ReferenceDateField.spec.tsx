import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { renderPtBr } from '@/lib/i18n.test-utils';

import { ReferenceDateField } from './ReferenceDateField';

function Harness({
  initial = null,
  spy,
}: {
  initial?: string | null;
  spy?: (v: string | null) => void;
}) {
  const [value, setValue] = useState<string | null>(initial);
  function handleChange(next: string | null) {
    setValue(next);
    spy?.(next);
  }
  return (
    <>
      <ReferenceDateField label="Data de início" value={value} onChange={handleChange} />
      <button type="button">Fora</button>
    </>
  );
}

test('selects the date typed as dd/mm/aaaa', async () => {
  const spy = vi.fn();
  const { getByRole } = await renderPtBr(<Harness spy={spy} />);
  await getByRole('spinbutton', { name: /dia/i }).click();
  await userEvent.keyboard('26112026');
  expect(spy).toHaveBeenLastCalledWith('2026-11-26');
});

test('shows the value received in pt-BR order', async () => {
  const { getByRole } = await renderPtBr(<Harness initial="2026-11-26" />);
  await expect.element(getByRole('spinbutton', { name: /dia/i })).toHaveTextContent('26');
  await expect.element(getByRole('spinbutton', { name: /mês/i })).toHaveTextContent('11');
});

test('announces an incomplete date without erasing what was typed', async () => {
  const { getByRole } = await renderPtBr(<Harness />);
  await getByRole('spinbutton', { name: /dia/i }).click();
  await userEvent.keyboard('26');
  await getByRole('button', { name: 'Fora' }).click();
  await expect.element(getByRole('alert')).toHaveTextContent('Data incompleta');
  await expect.element(getByRole('spinbutton', { name: /dia/i })).toHaveTextContent('26');
});

test('associates the error with the field', async () => {
  const { getByRole } = await renderPtBr(<Harness />);
  await getByRole('spinbutton', { name: /dia/i }).click();
  await userEvent.keyboard('26');
  await getByRole('button', { name: 'Fora' }).click();
  await expect
    .element(getByRole('group', { name: 'Data de início' }))
    .toHaveAccessibleDescription(/Data incompleta/);
});

test('does not show an error while the field is empty', async () => {
  const { getByRole } = await renderPtBr(<Harness />);
  await getByRole('spinbutton', { name: /dia/i }).click();
  await getByRole('button', { name: 'Fora' }).click();
  await expect.element(getByRole('alert')).not.toBeInTheDocument();
});

test('rejects a year outside the supported range', async () => {
  const spy = vi.fn();
  const { getByRole } = await renderPtBr(<Harness spy={spy} />);
  await getByRole('spinbutton', { name: /dia/i }).click();
  await userEvent.keyboard('26113026');
  await getByRole('button', { name: 'Fora' }).click();
  expect(spy).toHaveBeenLastCalledWith(null);
  await expect.element(getByRole('alert')).toHaveTextContent('entre os anos 1900 e 2199');
});

test('opens the calendar popup and returns focus to the field with Escape', async () => {
  const { getByRole } = await renderPtBr(<Harness initial="2026-11-26" />);
  const trigger = getByRole('button', { name: 'Abrir calendário' });
  await trigger.click();
  await expect.element(getByRole('dialog')).toBeInTheDocument();
  await userEvent.keyboard('{Escape}');
  await expect.element(getByRole('dialog')).not.toBeInTheDocument();
  await expect.element(trigger).toHaveFocus();
});

test('picks a date from the calendar popup', async () => {
  const spy = vi.fn();
  const { getByRole } = await renderPtBr(<Harness initial="2026-11-26" spy={spy} />);
  await getByRole('button', { name: 'Abrir calendário' }).click();
  await getByRole('button', { name: /27 de novembro/i }).click();
  expect(spy).toHaveBeenLastCalledWith('2026-11-27');
});

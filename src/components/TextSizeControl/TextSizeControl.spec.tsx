import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

import { track } from '@/services/analytics.service';

import { TextSizeControl } from './TextSizeControl';

vi.mock('@/services/analytics.service', () => ({ track: vi.fn() }));

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.mocked(track).mockClear();
  window.localStorage.clear();
  document.documentElement.style.removeProperty('font-size');
});

test('labels the three actions for assistive technology', async () => {
  const { getByRole } = await render(<TextSizeControl />);
  await expect.element(getByRole('button', { name: 'Diminuir texto' })).toBeVisible();
  await expect.element(getByRole('button', { name: 'Tamanho padrão' })).toBeVisible();
  await expect.element(getByRole('button', { name: 'Aumentar texto' })).toBeVisible();
});

test('shows and announces the new level after increasing', async () => {
  const { getByRole } = await render(<TextSizeControl />);
  await getByRole('button', { name: 'Aumentar texto' }).click();
  await expect.element(getByRole('status')).toHaveTextContent('Texto em 125%');
  expect(document.documentElement.style.fontSize).toBe('125%');
});

test('explains why decreasing is unavailable at the default size', async () => {
  const { getByRole } = await render(<TextSizeControl />);
  await expect
    .element(getByRole('button', { name: 'Diminuir texto' }))
    .toHaveAccessibleDescription('O texto já está no tamanho padrão (100%).');
  await expect
    .element(getByRole('button', { name: 'Diminuir texto' }))
    .toHaveAttribute('aria-disabled', 'true');
});

test('keeps the level when the blocked action is pressed', async () => {
  const { getByRole } = await render(<TextSizeControl />);
  getByRole('button', { name: 'Diminuir texto' }).element().focus();
  await userEvent.keyboard('{Enter}');
  await expect.element(getByRole('status')).toHaveTextContent('Texto em 100%');
  expect(track).not.toHaveBeenCalled();
});

test('explains why increasing is unavailable at 200% and keeps focus on it', async () => {
  window.localStorage.setItem('escala-certa:text-size', '175');
  const { getByRole } = await render(<TextSizeControl />);
  await getByRole('button', { name: 'Aumentar texto' }).click();
  await expect
    .element(getByRole('button', { name: 'Aumentar texto' }))
    .toHaveAccessibleDescription('O texto já está no tamanho máximo (200%).');
  await expect.element(getByRole('button', { name: 'Aumentar texto' })).toHaveFocus();
});

test('returns to the default size', async () => {
  window.localStorage.setItem('escala-certa:text-size', '150');
  const { getByRole } = await render(<TextSizeControl />);
  await getByRole('button', { name: 'Tamanho padrão' }).click();
  await expect.element(getByRole('status')).toHaveTextContent('Texto em 100%');
});

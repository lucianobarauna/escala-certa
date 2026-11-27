import '@/index.css';
import { afterEach, beforeEach, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { clickLabelOf } from '@/lib/click.test-utils';
import { renderPtBr } from '@/lib/i18n.test-utils';

import { HomeView } from './HomeView';

const ORIGINAL_URL = window.location.href;
const FIXED_NOW = new Date('2026-11-26T12:00:00');

export const NIGHT_SHIFT_SUMMARY =
  'Novembro de 2026: 15 dias de plantão, 15 dias de folga (todos com saída do plantão pela manhã)';

export function openWith(search: string) {
  window.history.replaceState(null, '', `${window.location.pathname}${search}`);
}

export function setupHomeEnvironment() {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(FIXED_NOW);
    window.localStorage.clear();
    openWith('');
  });
  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
    document.documentElement.style.removeProperty('font-size');
    window.history.replaceState(null, '', ORIGINAL_URL);
  });
}

export function renderHome() {
  return renderPtBr(<HomeView />);
}

export async function chooseOption(name: RegExp) {
  await clickLabelOf(page.getByRole('radio', { name }));
}

export async function typeDate(digits: string) {
  await page.getByRole('spinbutton', { name: /dia/i }).click();
  await userEvent.keyboard(digits);
}

export async function fillNightShift() {
  await chooseOption(/^Plantão/);
  await typeDate('01112026');
  await chooseOption(/^12x36/);
  await chooseOption(/^Noturno/);
}

export function summary() {
  return page.getByRole('status').filter({ hasText: /Novembro|Dezembro|Preencha|Escolha/ });
}

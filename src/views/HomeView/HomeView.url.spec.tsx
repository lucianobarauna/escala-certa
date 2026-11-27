import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';

import { shiftDraft } from '@/domain/schedule/fixtures/draft.builders';
import { parseSchedule, serializeSchedule } from '@/domain/schedule/schedule-url.utils';

import {
  NIGHT_SHIFT_SUMMARY,
  chooseOption,
  fillNightShift,
  openWith,
  renderHome,
  setupHomeEnvironment,
  summary,
} from './HomeView.test-utils';

setupHomeEnvironment();

const NIGHT_SHIFT_LINK = serializeSchedule(
  shiftDraft({ startDate: '2026-11-01', cycle: '12x36', turn: 'night' }),
);

describe('given the schedule mirrored in the URL', () => {
  test('when the configuration changes, then the URL follows without new history entries', async () => {
    const historyLength = window.history.length;
    await renderHome();
    await fillNightShift();
    expect(window.location.search).toBe(NIGHT_SHIFT_LINK);
    expect(window.history.length).toBe(historyLength);
  });

  test('when a valid link is opened, then form and preview are restored', async () => {
    openWith(NIGHT_SHIFT_LINK);
    await renderHome();
    await expect.element(page.getByRole('radio', { name: /^Plantão/ })).toBeChecked();
    await expect.element(page.getByRole('radio', { name: /^Noturno/ })).toBeChecked();
    await expect.element(summary()).toHaveTextContent(NIGHT_SHIFT_SUMMARY);
  });

  test('when a link from an unknown version is opened, then it warns and the form works', async () => {
    openWith('?v=99&t=shift');
    await renderHome();
    await expect.element(page.getByRole('alert')).toHaveTextContent('versão que não reconhecemos');
    await chooseOption(/^Plantão/);
    await expect.element(page.getByRole('radio', { name: /^Plantão/ })).toBeChecked();
  });

  test('when a link has an invalid field, then it warns and keeps the valid fields', async () => {
    openWith('?v=1&t=shift&c=24x48&d=2026-99-99');
    await renderHome();
    await expect
      .element(page.getByRole('alert'))
      .toHaveTextContent('data de referência do link é inválida');
    await expect.element(page.getByRole('radio', { name: /^24x48/ })).toBeChecked();
  });

  test('when a received link is adjusted, then the original link still opens the original schedule', async () => {
    openWith(NIGHT_SHIFT_LINK);
    await renderHome();
    await chooseOption(/^24x48/);
    expect(window.location.search).not.toBe(NIGHT_SHIFT_LINK);
    expect(parseSchedule(NIGHT_SHIFT_LINK).draft.shift.cycle).toBe('12x36');
  });
});

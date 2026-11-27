import { describe, expect, test } from 'vitest';

import { weeklyDraft } from '@/domain/schedule/fixtures/draft.builders';

import {
  getIncompleteText,
  getLimitReason,
  getWeekLabel,
  getWeeksLimitText,
  getWeeksText,
  getWeekStatus,
} from './weekly-form.utils';

describe('labels', () => {
  test('numbers weeks starting at 1', () => {
    expect(getWeekLabel(0)).toBe('Semana 1');
  });

  test('uses the singular for one week and the plural otherwise', () => {
    expect([getWeeksText(1), getWeeksText(3)]).toEqual(['1 semana', '3 semanas']);
  });

  test('explains the minimum and maximum number of weeks', () => {
    expect([getWeeksLimitText(1), getWeeksLimitText(7), getWeeksLimitText(3)]).toEqual([
      'Mínimo de 1 semana.',
      'Máximo de 7 semanas.',
      '',
    ]);
  });

  test('explains why the other days cannot be marked', () => {
    expect(getLimitReason(2)).toBe(
      'Limite de 2 folgas atingido. Desmarque uma folga para escolher outro dia.',
    );
  });

  test('says how many off days are missing', () => {
    expect(getIncompleteText(1)).toBe('Semana incompleta: ainda falta marcar 1 folga.');
    expect(getIncompleteText(2)).toBe('Semana incompleta: ainda faltam marcar 2 folgas.');
  });
});

describe('getWeekStatus', () => {
  test('asks for the modality before any off day is marked', () => {
    const status = getWeekStatus(weeklyDraft({}).weekly, 0);
    expect(status.kind).toBe('missing-modality');
  });

  test('flags a week with fewer off days than the modality requires', () => {
    const status = getWeekStatus(weeklyDraft({ modality: '5x2', offDays: [[0]] }).weekly, 0);
    expect(status).toEqual({
      kind: 'incomplete',
      text: 'Semana incompleta: ainda falta marcar 1 folga.',
    });
  });

  test('reports the limit when the week has all the off days', () => {
    const status = getWeekStatus(weeklyDraft({ modality: '6x1', offDays: [[0]] }).weekly, 0);
    expect(status.kind).toBe('limit');
  });
});

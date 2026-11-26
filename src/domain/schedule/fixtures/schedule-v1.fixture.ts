import type { ScheduleDraft } from '@/types/schedule';

type FrozenLink = {
  search: string;
  draft: ScheduleDraft;
};

const EMPTY_WEEKLY = { modality: null, weeks: 1, offDays: [[]], anchorDate: null };
const EMPTY_SHIFT = { startDate: null, cycle: null, turn: null };

export const FROZEN_V1_LINKS: FrozenLink[] = [
  {
    search: '?v=1&t=shift&c=12x36&s=night&d=2026-11-26&n=Escala+da+Ana',
    draft: {
      type: 'shift',
      name: 'Escala da Ana',
      shift: { startDate: '2026-11-26', cycle: '12x36', turn: 'night' },
      weekly: EMPTY_WEEKLY,
    },
  },
  {
    search: '?v=1&t=shift&c=24x48&d=2026-12-01',
    draft: {
      type: 'shift',
      name: '',
      shift: { startDate: '2026-12-01', cycle: '24x48', turn: null },
      weekly: EMPTY_WEEKLY,
    },
  },
  {
    search: '?v=1&t=weekly&m=6x1&w=3&p=0.1.-&d=2026-11-22',
    draft: {
      type: 'weekly',
      name: '',
      shift: EMPTY_SHIFT,
      weekly: { modality: '6x1', weeks: 3, offDays: [[0], [1], []], anchorDate: '2026-11-22' },
    },
  },
];

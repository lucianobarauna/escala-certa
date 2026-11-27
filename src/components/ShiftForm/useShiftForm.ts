import { SHIFT_CYCLES, SHIFT_TURNS } from '@/domain/schedule/schedule.constants';
import { findOption } from '@/lib/options';
import type { ShiftDraft } from '@/types/schedule';

import { CYCLE_WITH_TURN } from './shift-form.constants';

export function useShiftForm(shift: ShiftDraft, onChange: (shift: ShiftDraft) => void) {
  function handleStartDate(startDate: string | null) {
    onChange({ ...shift, startDate });
  }
  function handleCycle(selected: string) {
    const cycle = findOption(SHIFT_CYCLES, selected);
    if (!cycle) return;
    onChange({ ...shift, cycle, turn: cycle === CYCLE_WITH_TURN ? shift.turn : null });
  }
  function handleTurn(selected: string) {
    const turn = findOption(SHIFT_TURNS, selected);
    if (turn) onChange({ ...shift, turn });
  }
  return { handleStartDate, handleCycle, handleTurn };
}

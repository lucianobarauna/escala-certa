import { describe, expect, test } from 'vitest';

import { pageView, scheduleCompleted, scheduleShared, textSizeChanged } from './analytics.events';
import type { ShareMethod, TextSizeLevel } from './analytics.events';

describe('analytics events', () => {
  test('builds schedule_completed for a shift', () => {
    const event = scheduleCompleted({ scheduleType: 'shift', variant: '12x36-night', weeks: 0 });
    expect(event).toEqual({
      name: 'schedule_completed',
      params: { schedule_type: 'shift', variant: '12x36-night', weeks: 0 },
    });
  });

  test('builds schedule_completed for a weekly schedule', () => {
    const event = scheduleCompleted({ scheduleType: 'weekly', variant: '6x1', weeks: 7 });
    expect(event.params).toEqual({ schedule_type: 'weekly', variant: '6x1', weeks: 7 });
  });

  test.each<ShareMethod>(['native', 'clipboard', 'manual'])(
    'builds schedule_shared with %s',
    (method) => {
      expect(scheduleShared(method)).toEqual({ name: 'schedule_shared', params: { method } });
    },
  );

  test.each<TextSizeLevel>([100, 125, 150, 175, 200])(
    'builds text_size_changed with %i',
    (level) => {
      expect(textSizeChanged(level)).toEqual({ name: 'text_size_changed', params: { level } });
    },
  );

  test.each([
    [true, 'yes'],
    [false, 'no'],
  ])('builds page_view with hasSchedule=%s as %s', (hasSchedule, expected) => {
    expect(pageView(hasSchedule).params).toEqual({ has_schedule: expected });
  });
});

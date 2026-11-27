import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { MonthSummary } from './MonthSummary';

test('shows the summary in a polite status region', async () => {
  const { getByRole } = await render(<MonthSummary text="Novembro de 2026: 15 dias de plantão" />);
  await expect
    .element(getByRole('status'))
    .toHaveTextContent('Novembro de 2026: 15 dias de plantão');
});

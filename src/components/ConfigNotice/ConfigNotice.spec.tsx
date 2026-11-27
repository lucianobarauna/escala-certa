import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import type { ConfigIssue } from '@/types/schedule';

import { ConfigNotice } from './ConfigNotice';

const ISSUES: ConfigIssue[] = [
  { code: 'invalid_field', field: 'sd', message: 'A data de início do link é inválida.' },
  { code: 'unknown_version', message: 'O link é de uma versão que este app não reconhece.' },
];

test('announces every issue in an alert', async () => {
  const { getByRole } = await render(<ConfigNotice issues={ISSUES} />);
  await expect
    .element(getByRole('alert'))
    .toHaveTextContent('A data de início do link é inválida.');
  await expect
    .element(getByRole('alert'))
    .toHaveTextContent('O link é de uma versão que este app não reconhece.');
});

test('renders nothing when the link has no issues', async () => {
  const { getByRole } = await render(<ConfigNotice issues={[]} />);
  await expect.element(getByRole('alert')).not.toBeInTheDocument();
});

import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { Legend } from './Legend';

test('lists only the states it receives', async () => {
  const { getByRole } = await render(<Legend states={['work', 'off']} />);
  expect(getByRole('listitem').all()).toHaveLength(2);
  await expect.element(getByRole('listitem').nth(0)).toHaveTextContent('Trabalha');
  await expect.element(getByRole('listitem').nth(1)).toHaveTextContent('Folga');
});

test('explains that the shift exit happens in the morning', async () => {
  const { getByRole } = await render(<Legend states={['off-exit']} />);
  await expect
    .element(getByRole('listitem'))
    .toHaveTextContent('Folga (saída do plantão)Sai do plantão pela manhã e folga o resto do dia.');
});

test('renders nothing when there is no state to explain', async () => {
  const { container } = await render(<Legend states={[]} />);
  expect(container.textContent).toBe('');
});

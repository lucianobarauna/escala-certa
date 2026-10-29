import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import App from './App';

test('renders the greeting and the action button', async () => {
  const { getByRole } = await render(<App />);
  await expect.element(getByRole('heading', { name: 'Hello Vitest x1!' })).toBeInTheDocument();
  await expect.element(getByRole('button', { name: 'Click me' })).toBeInTheDocument();
});

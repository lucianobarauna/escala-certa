import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { clickLabelOf } from '@/lib/click.test-utils';

import { ChoiceGroup } from './ChoiceGroup';

const OPTIONS = [
  { value: 'a', label: 'Primeira' },
  { value: 'b', label: 'Segunda' },
];

test('names the group by its label and checks the current value', async () => {
  const { getByRole } = await render(
    <ChoiceGroup label="Escolha" value="a" options={OPTIONS} onChange={vi.fn()} />,
  );
  await expect.element(getByRole('radiogroup', { name: 'Escolha' })).toBeInTheDocument();
  await expect.element(getByRole('radio', { name: 'Primeira' })).toBeChecked();
});

test('reports the value of the chosen option', async () => {
  const onChange = vi.fn();
  const { getByRole } = await render(
    <ChoiceGroup label="Escolha" value={null} options={OPTIONS} onChange={onChange} />,
  );
  await clickLabelOf(getByRole('radio', { name: 'Segunda' }));
  expect(onChange).toHaveBeenCalledWith('b');
});

test('marks the group as required', async () => {
  const { getByRole } = await render(
    <ChoiceGroup label="Escolha" value={null} options={OPTIONS} onChange={vi.fn()} isRequired />,
  );
  await expect.element(getByRole('radiogroup')).toBeRequired();
});

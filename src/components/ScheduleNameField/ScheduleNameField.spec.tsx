import { useState } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { ScheduleNameField } from './ScheduleNameField';

function Harness({ initial = '' }: { initial?: string }) {
  const [name, setName] = useState(initial);
  return <ScheduleNameField value={name} onChange={setName} />;
}

test('accepts a name and shows it in the field', async () => {
  const { getByLabelText } = await render(<Harness />);
  await getByLabelText('Nome da escala (opcional)').fill('Escala da Ana');
  await expect.element(getByLabelText('Nome da escala (opcional)')).toHaveValue('Escala da Ana');
});

test('limits the name to 40 characters', async () => {
  const { getByLabelText } = await render(<Harness />);
  await getByLabelText('Nome da escala (opcional)').fill('a'.repeat(50));
  await expect.element(getByLabelText('Nome da escala (opcional)')).toHaveValue('a'.repeat(40));
});

test('shows the privacy notice and associates it with the field', async () => {
  const { getByLabelText, getByText } = await render(<Harness />);
  await expect.element(getByText(/O nome vai no link/)).toBeVisible();
  await expect
    .element(getByLabelText('Nome da escala (opcional)'))
    .toHaveAccessibleDescription(/pode ser visto por quem receber o link/);
});

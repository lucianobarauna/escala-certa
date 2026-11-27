import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { RadioGroup } from '@/components/ui/radio-group';

import { ChoiceOption } from './ChoiceOption';

function Group({ withDescription }: { withDescription: boolean }) {
  return (
    <RadioGroup aria-label="Opções" defaultValue="a">
      <ChoiceOption
        value="a"
        label="Primeira"
        description={withDescription ? 'Explica a primeira' : undefined}
      />
      <ChoiceOption value="b" label="Segunda" />
    </RadioGroup>
  );
}

test('includes the description in the accessible name', async () => {
  const { getByRole } = await render(<Group withDescription />);
  await expect
    .element(getByRole('radio', { name: 'Primeira Explica a primeira' }))
    .toBeInTheDocument();
});

test('renders only the label when there is no description', async () => {
  const { getByRole } = await render(<Group withDescription={false} />);
  await expect.element(getByRole('radio', { name: 'Primeira', exact: true })).toBeChecked();
});

test('selects an option when its text is clicked', async () => {
  const { getByText, getByRole } = await render(<Group withDescription />);
  await getByText('Segunda').click();
  await expect.element(getByRole('radio', { name: 'Segunda' })).toBeChecked();
});

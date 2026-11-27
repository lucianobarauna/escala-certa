import { expect, test } from 'vitest';

import { clickLabelOf } from '@/lib/click.test-utils';
import { renderPtBr } from '@/lib/i18n.test-utils';

import { WeeklyFormHarness as Harness } from './WeeklyForm.test-utils';

test('tells that the modality is needed before marking off days', async () => {
  const { getByRole, getByText } = await renderPtBr(<Harness />);
  await expect.element(getByText('Escolha a modalidade para marcar as folgas.')).toBeVisible();
  await expect.element(getByRole('checkbox', { name: /Domingo, semana 1/ })).toBeDisabled();
});

test('marks an off day', async () => {
  const { getByRole } = await renderPtBr(<Harness />);
  await clickLabelOf(getByRole('radio', { name: /^5x2/ }));
  await clickLabelOf(getByRole('checkbox', { name: /Domingo, semana 1/ }));
  await expect.element(getByRole('checkbox', { name: /Domingo, semana 1/ })).toBeChecked();
});

test('disables the other days with a text reason when the limit is reached', async () => {
  const { getByRole, getByText } = await renderPtBr(<Harness />);
  await clickLabelOf(getByRole('radio', { name: /^6x1/ }));
  await clickLabelOf(getByRole('checkbox', { name: /Domingo, semana 1/ }));
  await expect.element(getByRole('checkbox', { name: /Segunda-feira, semana 1/ })).toBeDisabled();
  await expect.element(getByText(/Limite de 1 folga atingido/)).toBeVisible();
});

test('lets the marked day be unchecked after the limit is reached', async () => {
  const { getByRole } = await renderPtBr(<Harness />);
  await clickLabelOf(getByRole('radio', { name: /^6x1/ }));
  await clickLabelOf(getByRole('checkbox', { name: /Domingo, semana 1/ }));
  await clickLabelOf(getByRole('checkbox', { name: /Domingo, semana 1/ }));
  await expect.element(getByRole('checkbox', { name: /Segunda-feira, semana 1/ })).toBeEnabled();
});

test('announces a week with fewer off days than the modality requires', async () => {
  const { getByRole } = await renderPtBr(<Harness />);
  await clickLabelOf(getByRole('radio', { name: /^5x2/ }));
  await clickLabelOf(getByRole('checkbox', { name: /Domingo, semana 1/ }));
  await expect
    .element(getByRole('status').filter({ hasText: 'Semana incompleta' }))
    .toHaveTextContent('ainda falta marcar 1 folga');
});

test('warns that the off days were cleared when the modality changes', async () => {
  const { getByRole, getByText } = await renderPtBr(<Harness />);
  await clickLabelOf(getByRole('radio', { name: /^5x2/ }));
  await clickLabelOf(getByRole('checkbox', { name: /Domingo, semana 1/ }));
  await clickLabelOf(getByRole('radio', { name: /^6x1/ }));
  await expect
    .element(getByText('As folgas marcadas foram limpas ao trocar a modalidade.'))
    .toBeVisible();
  await expect.element(getByRole('checkbox', { name: /Domingo, semana 1/ })).not.toBeChecked();
});

test('does not warn when there was nothing to clear', async () => {
  const { getByRole, getByText } = await renderPtBr(<Harness />);
  await clickLabelOf(getByRole('radio', { name: /^5x2/ }));
  await clickLabelOf(getByRole('radio', { name: /^6x1/ }));
  await expect
    .element(getByText('As folgas marcadas foram limpas', { exact: false }))
    .not.toBeInTheDocument();
});

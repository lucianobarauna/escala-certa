import { userEvent, type Locator } from 'vitest/browser';

export async function clickLabelOf(control: Locator) {
  const label = control.element().closest('label');
  if (!label) throw new Error('O controle não está dentro de um rótulo clicável');
  await userEvent.click(label);
}

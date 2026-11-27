import { describe, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { renderHome, setupHomeEnvironment } from './HomeView.test-utils';

setupHomeEnvironment();

function monthHeading() {
  return page.getByRole('heading', { level: 2, name: /de 20\d\d$/ });
}

describe('given the schedule name', () => {
  test('when no name is filled, then the page uses the default title', async () => {
    await renderHome();
    await expect.poll(() => document.title).toBe('Escala Certa');
  });

  test('when a name is filled, then it shows above the preview and in the page title', async () => {
    await renderHome();
    await page.getByRole('textbox', { name: /Nome da escala/ }).click();
    await userEvent.keyboard('Escala da Ana');
    await expect.element(page.getByText('Escala da Ana', { exact: true })).toBeVisible();
    await expect.poll(() => document.title).toBe('Escala da Ana · Escala Certa');
  });
});

describe('given the month navigation', () => {
  test('when moving forward 13 months, then there is no limit and it can return to today', async () => {
    await renderHome();
    for (let step = 0; step < 13; step += 1)
      await page.getByRole('button', { name: 'Próximo mês' }).click();
    await expect.element(monthHeading()).toHaveTextContent('Dezembro de 2027');
    await page.getByRole('button', { name: 'Voltar ao mês atual' }).click();
    await expect.element(monthHeading()).toHaveTextContent('Novembro de 2026');
  });

  test('when moving back 12 months, then it shows the previous year', async () => {
    await renderHome();
    for (let step = 0; step < 12; step += 1)
      await page.getByRole('button', { name: 'Mês anterior' }).click();
    await expect.element(monthHeading()).toHaveTextContent('Novembro de 2025');
  });
});

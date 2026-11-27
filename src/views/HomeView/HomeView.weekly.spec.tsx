import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';

import { clickLabelOf } from '@/lib/click.test-utils';

import {
  chooseOption,
  renderHome,
  setupHomeEnvironment,
  summary,
  typeDate,
} from './HomeView.test-utils';

setupHomeEnvironment();

async function markOffDay(name: RegExp) {
  await clickLabelOf(page.getByRole('checkbox', { name }));
}

describe('given a person configuring a weekly schedule in rotation', () => {
  test('when each off day is marked, then the preview changes right away', async () => {
    await renderHome();
    await chooseOption(/^Semanal/);
    await chooseOption(/^5x2/);
    await typeDate('01112026');
    await expect
      .element(summary())
      .toHaveTextContent('Novembro de 2026: 30 dias trabalhando, 0 dias de folga');
    await markOffDay(/Domingo, semana 1/);
    await expect
      .element(summary())
      .toHaveTextContent('Novembro de 2026: 25 dias trabalhando, 5 dias de folga');
    await markOffDay(/Sábado, semana 1/);
    await expect
      .element(summary())
      .toHaveTextContent('Novembro de 2026: 21 dias trabalhando, 9 dias de folga');
  });

  test('when a second week is added, then the off days alternate between weeks', async () => {
    await renderHome();
    await chooseOption(/^Semanal/);
    await chooseOption(/^6x1/);
    await typeDate('01112026');
    await page.getByRole('button', { name: 'Aumentar semanas' }).click();
    await markOffDay(/Domingo, semana 1/);
    await markOffDay(/Sábado, semana 2/);
    await expect
      .element(page.getByText('1 de novembro de 2026, domingo, folga'))
      .toBeInTheDocument();
    await expect
      .element(page.getByText('14 de novembro de 2026, sábado, folga'))
      .toBeInTheDocument();
    await expect
      .element(page.getByText('7 de novembro de 2026, sábado, trabalha'))
      .toBeInTheDocument();
  });
});

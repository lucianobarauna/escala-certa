import { expect, test } from './helpers/fixtures.ts';
import { chooseOption, openHome, summary, typeDate } from './helpers/home-page.ts';

test('a retail worker in a 4-week rotation marks off days while checking the preview', async ({
  page,
}) => {
  await openHome(page);
  await chooseOption(page, /^Semanal/);
  await chooseOption(page, /^6x1/);
  await typeDate(page, '01112026');
  for (let week = 1; week < 4; week += 1)
    await page.getByRole('button', { name: 'Aumentar semanas' }).click();
  await expect(page.getByRole('group', { name: 'Semana 4' })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Semana 4' })).toContainText(
    'Semana incompleta: ainda falta marcar',
  );
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira'];
  for (const [week, day] of days.entries()) {
    await page
      .getByRole('checkbox', { name: new RegExp(`${day}, semana ${week + 1}`) })
      .locator('xpath=ancestor::label')
      .click();
  }
  await expect(page.getByText('1 de novembro de 2026, domingo, folga')).toBeAttached();
  await expect(page.getByText('9 de novembro de 2026, segunda-feira, folga')).toBeAttached();
  await expect(page.getByText('8 de novembro de 2026, domingo, trabalha')).toBeAttached();
  await expect(page.getByText('Semana incompleta')).toHaveCount(0);
  await expect(summary(page)).toHaveText(
    /^Novembro de 2026: \d+ dias trabalhando, \d+ dias de folga$/,
  );
});

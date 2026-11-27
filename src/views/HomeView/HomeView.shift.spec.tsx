import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';

import {
  NIGHT_SHIFT_SUMMARY,
  fillNightShift,
  renderHome,
  setupHomeEnvironment,
  summary,
  typeDate,
} from './HomeView.test-utils';

setupHomeEnvironment();

describe('given a person configuring a 12x36 night shift', () => {
  test('when the flow is filled, then the current month shows legend and summary', async () => {
    await renderHome();
    await expect.element(summary()).toHaveTextContent('Escolha o tipo de escala');
    await fillNightShift();
    await expect.element(summary()).toHaveTextContent(NIGHT_SHIFT_SUMMARY);
    await expect.element(page.getByRole('heading', { name: 'Legenda' })).toBeVisible();
    await expect
      .element(
        page.getByText(
          '26 de novembro de 2026, quinta-feira, hoje, folga, saída do plantão pela manhã',
        ),
      )
      .toBeInTheDocument();
  });

  test('when the reference date changes, then the preview and the URL are recalculated', async () => {
    await renderHome();
    await fillNightShift();
    await typeDate('02');
    await expect
      .element(page.getByText('1 de novembro de 2026, domingo, folga, saída do plantão pela manhã'))
      .toBeInTheDocument();
    expect(new URLSearchParams(window.location.search).get('d')).toBe('2026-11-02');
  });
});

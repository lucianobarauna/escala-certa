import type { ReactNode } from 'react';
import { I18nProvider } from 'react-aria-components';
import { render } from 'vitest-browser-react';

export function renderPtBr(ui: ReactNode) {
  return render(<I18nProvider locale="pt-BR">{ui}</I18nProvider>);
}

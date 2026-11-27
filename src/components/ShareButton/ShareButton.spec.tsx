import { afterEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { track } from '@/services/analytics.service';

import { ShareButton } from './ShareButton';

vi.mock('@/services/analytics.service', () => ({ track: vi.fn() }));

function stubNavigator(navigatorStub: object) {
  vi.stubGlobal('navigator', navigatorStub);
}

function renderComplete() {
  return render(<ShareButton name="Escala da Ana" isComplete />);
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.mocked(track).mockClear();
});

test('is unavailable while the schedule is incomplete and says why', async () => {
  const { getByRole } = await render(<ShareButton name="" isComplete={false} />);
  const button = getByRole('button', { name: 'Compartilhar escala' });
  await expect.element(button).toBeDisabled();
  await expect.element(button).toHaveAccessibleDescription('Complete a escala para compartilhar.');
});

describe('given a browser with native share', () => {
  test('when sharing, then it opens the system menu with the name and current link', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    stubNavigator({ share });
    const { getByRole } = await renderComplete();
    await getByRole('button', { name: 'Compartilhar escala' }).click();
    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Escala da Ana: veja a escala no Escala Certa',
        url: window.location.href,
      }),
    );
    expect(track).toHaveBeenCalledWith({ name: 'schedule_shared', params: { method: 'native' } });
  });

  test('when the person cancels, then nothing is shown or tracked', async () => {
    const writeText = vi.fn();
    const share = vi.fn().mockRejectedValue(new DOMException('Cancelled', 'AbortError'));
    stubNavigator({ share, clipboard: { writeText } });
    const { getByRole } = await renderComplete();
    await getByRole('button', { name: 'Compartilhar escala' }).click();
    await expect.element(getByRole('status')).toHaveTextContent('');
    await expect.element(getByRole('textbox')).not.toBeInTheDocument();
    expect(track).not.toHaveBeenCalled();
  });
});

describe('given a browser without native share', () => {
  test('when sharing, then it copies the link and announces it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubNavigator({ clipboard: { writeText } });
    const { getByRole } = await renderComplete();
    await getByRole('button', { name: 'Compartilhar escala' }).click();
    await expect.element(getByRole('status')).toHaveTextContent('Link copiado');
    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(track).toHaveBeenCalledWith({
      name: 'schedule_shared',
      params: { method: 'clipboard' },
    });
  });

  test('when copying fails, then it shows the link selected in a field for manual copy', async () => {
    stubNavigator({ clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    const { getByRole } = await renderComplete();
    await getByRole('button', { name: 'Compartilhar escala' }).click();
    const field = getByRole('textbox', { name: /Copie o link da escala/ });
    await expect.element(field).toHaveValue(window.location.href);
    await expect.element(field).toHaveFocus();
    expect(track).toHaveBeenCalledWith({ name: 'schedule_shared', params: { method: 'manual' } });
  });
});

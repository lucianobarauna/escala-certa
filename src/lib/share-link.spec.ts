import { afterEach, describe, expect, test, vi } from 'vitest';

import { shareLink } from './share-link';

const URL_TO_SHARE = 'https://example.com/escala-certa/?v=1&t=shift';
const PARAMS = { title: 'Escala Certa', text: 'Escala da Ana', url: URL_TO_SHARE };

function stubNavigator(navigatorStub: object) {
  vi.stubGlobal('navigator', navigatorStub);
}

function abortError() {
  return new DOMException('Cancelled', 'AbortError');
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('given a browser with native share', () => {
  test('when sharing, then it calls navigator.share with title, text and url', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    stubNavigator({ share });
    expect(await shareLink(PARAMS)).toBe('native');
    expect(share).toHaveBeenCalledWith(PARAMS);
  });

  test('when there is no name, then the text is shared as given', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    stubNavigator({ share });
    await shareLink({ ...PARAMS, text: 'Escala Certa' });
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ text: 'Escala Certa' }));
  });

  test('when the person cancels, then it is cancelled and nothing is copied', async () => {
    const writeText = vi.fn();
    stubNavigator({ share: vi.fn().mockRejectedValue(abortError()), clipboard: { writeText } });
    expect(await shareLink(PARAMS)).toBe('cancelled');
    expect(writeText).not.toHaveBeenCalled();
  });

  test('when share fails for another reason, then it copies the link', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubNavigator({
      share: vi.fn().mockRejectedValue(new Error('boom')),
      clipboard: { writeText },
    });
    expect(await shareLink(PARAMS)).toBe('clipboard');
    expect(writeText).toHaveBeenCalledWith(URL_TO_SHARE);
  });

  test('when canShare is false, then it copies the link without sharing', async () => {
    const share = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubNavigator({ share, canShare: () => false, clipboard: { writeText } });
    expect(await shareLink(PARAMS)).toBe('clipboard');
    expect(share).not.toHaveBeenCalled();
  });
});

describe('given a browser without native share', () => {
  test('when sharing, then it copies the link', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubNavigator({ clipboard: { writeText } });
    expect(await shareLink(PARAMS)).toBe('clipboard');
    expect(writeText).toHaveBeenCalledWith(URL_TO_SHARE);
  });

  test('when there is no clipboard, then it asks for manual copy', async () => {
    stubNavigator({});
    expect(await shareLink(PARAMS)).toBe('manual');
  });

  test('when the clipboard rejects, then it asks for manual copy', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    stubNavigator({ clipboard: { writeText } });
    expect(await shareLink(PARAMS)).toBe('manual');
  });
});

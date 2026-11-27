import { expect, test } from 'vitest';

import { getShareParams } from './share-button.utils';

const URL_TO_SHARE = 'https://example.com/escala-certa/?v=1';

test('uses the app name and a generic text when the schedule has no name', () => {
  expect(getShareParams('', URL_TO_SHARE)).toEqual({
    title: 'Escala Certa',
    text: 'Veja a escala no Escala Certa',
    url: URL_TO_SHARE,
  });
});

test('includes the schedule name in the title and text', () => {
  expect(getShareParams('Escala da Ana', URL_TO_SHARE)).toEqual({
    title: 'Escala da Ana · Escala Certa',
    text: 'Escala da Ana: veja a escala no Escala Certa',
    url: URL_TO_SHARE,
  });
});

test('treats a name with only spaces as no name', () => {
  expect(getShareParams('   ', URL_TO_SHARE).title).toBe('Escala Certa');
});

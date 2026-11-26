import { MAX_NAME_LENGTH } from './schedule.constants';

const CONTROL_CHARACTERS = /\p{Cc}/gu;

export function sanitizeName(name: string) {
  const segments = Array.from(
    new Intl.Segmenter().segment(name.replace(CONTROL_CHARACTERS, '').trim()),
  );
  return segments
    .slice(0, MAX_NAME_LENGTH)
    .map((part) => part.segment)
    .join('')
    .trim();
}

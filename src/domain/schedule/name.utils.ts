import { MAX_NAME_LENGTH } from './schedule.constants';

const CONTROL_CHARACTERS = /\p{Cc}/gu;

function splitCharacters(text: string) {
  return Array.from(new Intl.Segmenter().segment(text), (part) => part.segment);
}

function cleanName(name: string) {
  return name.replace(CONTROL_CHARACTERS, '').trim();
}

export function isNameTooLong(name: string) {
  return splitCharacters(cleanName(name)).length > MAX_NAME_LENGTH;
}

export function sanitizeName(name: string) {
  return splitCharacters(cleanName(name)).slice(0, MAX_NAME_LENGTH).join('').trim();
}

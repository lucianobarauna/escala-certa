export function findOption<T extends string>(options: readonly T[], value: string): T | undefined {
  return options.find((option) => option === value);
}

export type SafeStorage = {
  read: (key: string) => string | null;
  write: (key: string, value: string) => void;
};

function readFromLocalStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function createSafeStorage(): SafeStorage {
  const memoryFallback = new Map<string, string>();
  return {
    read(key) {
      return memoryFallback.get(key) ?? readFromLocalStorage(key);
    },
    write(key, value) {
      try {
        window.localStorage.setItem(key, value);
        memoryFallback.delete(key);
      } catch {
        memoryFallback.set(key, value);
      }
    },
  };
}

export const sharedStorage = createSafeStorage();

export function readStorage(key: string) {
  return sharedStorage.read(key);
}

export function writeStorage(key: string, value: string) {
  sharedStorage.write(key, value);
}

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface StoredEnvelope<T> {
  version: number;
  data: T;
}

interface VersionedStoreOptions<T> {
  key: string;
  version: number;
  fallback: T;
  storage?: StorageAdapter;
  migrate?: (data: unknown, fromVersion: number) => T;
  validate?: (data: unknown) => data is T;
}

const browserStorage = (): StorageAdapter | undefined => {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
};

const cloneFallback = <T>(value: T): T => {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
};

export const createVersionedStore = <T>({
  key,
  version,
  fallback,
  storage = browserStorage(),
  migrate,
  validate,
}: VersionedStoreOptions<T>) => {
  const read = (): T => {
    if (!storage) return cloneFallback(fallback);
    try {
      const raw = storage.getItem(key);
      if (!raw) return cloneFallback(fallback);
      const parsed = JSON.parse(raw) as unknown;
      const envelope = parsed as Partial<StoredEnvelope<unknown>>;
      const isEnvelope =
        typeof envelope === 'object' &&
        envelope !== null &&
        typeof envelope.version === 'number' &&
        'data' in envelope;
      const fromVersion = isEnvelope ? (envelope.version ?? 0) : 0;
      const source = isEnvelope ? envelope.data : parsed;
      const data =
        fromVersion === version
          ? (source as T)
          : migrate
            ? migrate(source, fromVersion)
            : (source as T);
      return validate && !validate(data) ? cloneFallback(fallback) : data;
    } catch {
      return cloneFallback(fallback);
    }
  };

  const write = (data: T): boolean => {
    if (!storage) return false;
    try {
      storage.setItem(key, JSON.stringify({ version, data }));
      return true;
    } catch {
      return false;
    }
  };

  const clear = () => {
    try {
      storage?.removeItem(key);
    } catch {
      // Storage can be unavailable in privacy mode; clearing remains best effort.
    }
  };

  return { key, version, read, write, clear };
};

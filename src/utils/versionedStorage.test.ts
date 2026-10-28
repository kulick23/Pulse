import { describe, expect, it } from 'vitest';
import { createVersionedStore, StorageAdapter } from './versionedStorage';

const memoryStorage = (initial: Record<string, string> = {}) => {
  const data = new Map(Object.entries(initial));
  const storage: StorageAdapter = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
  return { data, storage };
};

describe('versioned storage', () => {
  it('migrates a legacy unwrapped value', () => {
    const { storage } = memoryStorage({
      settings: JSON.stringify({ limit: 4 }),
    });
    const store = createVersionedStore({
      key: 'settings',
      version: 2,
      fallback: { limit: 1, enabled: true },
      storage,
      migrate: (source, fromVersion) => ({
        ...(source as { limit: number }),
        enabled: fromVersion === 0,
      }),
    });
    expect(store.read()).toEqual({ limit: 4, enabled: true });
  });

  it('writes an explicit schema version', () => {
    const { data, storage } = memoryStorage();
    const store = createVersionedStore({
      key: 'settings',
      version: 3,
      fallback: { limit: 1 },
      storage,
    });
    expect(store.write({ limit: 8 })).toBe(true);
    expect(JSON.parse(data.get('settings') ?? '{}')).toEqual({
      version: 3,
      data: { limit: 8 },
    });
  });

  it('falls back safely when persisted JSON is corrupt', () => {
    const { storage } = memoryStorage({ settings: '{broken' });
    const store = createVersionedStore({
      key: 'settings',
      version: 1,
      fallback: { limit: 12 },
      storage,
    });
    expect(store.read()).toEqual({ limit: 12 });
  });
});

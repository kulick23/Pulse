import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  createVersionedStore,
  StorageAdapter,
} from '../utils/versionedStorage';

interface VersionedStateOptions<T> {
  key: string;
  version: number;
  fallback: T;
  storage?: StorageAdapter;
  migrate?: (data: unknown, fromVersion: number) => T;
  validate?: (data: unknown) => data is T;
}

export const useVersionedState = <T>(
  options: VersionedStateOptions<T>
): [T, Dispatch<SetStateAction<T>>] => {
  const storeRef = useRef<ReturnType<typeof createVersionedStore<T>> | null>(
    null
  );
  if (!storeRef.current) {
    storeRef.current = createVersionedStore(options);
  }
  const [value, setValue] = useState<T>(() => storeRef.current!.read());

  useEffect(() => {
    storeRef.current?.write(value);
  }, [value]);

  return [value, setValue];
};

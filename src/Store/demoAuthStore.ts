import { createVersionedStore } from '../utils/versionedStorage';

export interface DemoAccount {
  name: string;
  email: string;
  country: string;
}

interface DemoAuthState {
  account: DemoAccount | null;
  confirmed: boolean;
  passwordUpdatedAt: string | null;
}

const fallback: DemoAuthState = {
  account: null,
  confirmed: false,
  passwordUpdatedAt: null,
};

const store = createVersionedStore<DemoAuthState>({
  key: 'pulse-demo-auth',
  version: 1,
  fallback,
  migrate: (source) => ({
    ...fallback,
    ...((source ?? {}) as Partial<DemoAuthState>),
  }),
});

const update = (changes: Partial<DemoAuthState>) =>
  store.write({ ...store.read(), ...changes });

export const demoAuthStore = {
  read: store.read,
  saveAccount: (account: DemoAccount) => update({ account }),
  confirmAccount: () => update({ confirmed: true }),
  markPasswordUpdated: (date = new Date()) =>
    update({ passwordUpdatedAt: date.toISOString() }),
};

import { useEffect, useState } from 'react';
import { createVersionedStore } from '../../utils/versionedStorage';

export interface ScheduledPayment {
  id: string;
  name: string;
  amount: number;
  day: number;
  active: boolean;
}

export interface TrustedDevice {
  id: string;
  name: string;
  location: string;
  current: boolean;
}

export interface BankPreferences {
  monthlyBudget: number;
  dailyTransferLimit: number;
  onlinePaymentLimit: number;
  loginApproval: boolean;
  biometricApproval: boolean;
  emergencyLock: boolean;
  frozenCardIds: string[];
  linkedCardAccount: 'eur' | 'gbp' | 'usd';
  cardSettings: {
    online: boolean;
    cash: boolean;
    notifications: boolean;
    contactless: boolean;
    abroad: boolean;
  };
  scheduledPayments: ScheduledPayment[];
  trustedDevices: TrustedDevice[];
  supportRequests: number;
}

const storageKey = 'pulse-bank-preferences';

const initialPreferences: BankPreferences = {
  monthlyBudget: 1800,
  dailyTransferLimit: 3500,
  onlinePaymentLimit: 1200,
  loginApproval: true,
  biometricApproval: true,
  emergencyLock: false,
  frozenCardIds: [],
  linkedCardAccount: 'eur',
  cardSettings: {
    online: true,
    cash: true,
    notifications: true,
    contactless: true,
    abroad: true,
  },
  scheduledPayments: [
    {
      id: 'rent',
      name: 'Vienna Apartments',
      amount: 980,
      day: 1,
      active: true,
    },
    {
      id: 'mobile',
      name: 'Magenta Telekom',
      amount: 39.9,
      day: 14,
      active: true,
    },
    { id: 'streaming', name: 'Spotify', amount: 10.99, day: 22, active: false },
  ],
  trustedDevices: [
    {
      id: 'current',
      name: 'Chrome on macOS',
      location: 'Vienna, Austria',
      current: true,
    },
    {
      id: 'iphone',
      name: 'iPhone 16 Pro',
      location: 'Berlin, Germany',
      current: false,
    },
  ],
  supportRequests: 0,
};

const preferencesStore = createVersionedStore<BankPreferences>({
  key: storageKey,
  version: 2,
  fallback: initialPreferences,
  migrate: (source) => ({
    ...initialPreferences,
    ...((source ?? {}) as Partial<BankPreferences>),
    cardSettings: {
      ...initialPreferences.cardSettings,
      ...((source as Partial<BankPreferences> | undefined)?.cardSettings ?? {}),
    },
  }),
  validate: (value): value is BankPreferences => {
    const candidate = value as Partial<BankPreferences>;
    return (
      typeof candidate?.monthlyBudget === 'number' &&
      Array.isArray(candidate.scheduledPayments) &&
      Array.isArray(candidate.trustedDevices)
    );
  },
});

const readPreferences = preferencesStore.read;

export const useBankPreferences = () => {
  const [preferences, setPreferences] =
    useState<BankPreferences>(readPreferences);

  useEffect(() => {
    preferencesStore.write(preferences);
  }, [preferences]);

  const commit = (createNext: (current: BankPreferences) => BankPreferences) =>
    setPreferences((current) => {
      const next = createNext(current);
      preferencesStore.write(next);
      return next;
    });

  const update = (changes: Partial<BankPreferences>) => {
    const next = { ...preferences, ...changes };
    preferencesStore.write(next);
    setPreferences(next);
  };

  const toggleScheduledPayment = (id: string) =>
    commit((current) => ({
      ...current,
      scheduledPayments: current.scheduledPayments.map((payment) =>
        payment.id === id ? { ...payment, active: !payment.active } : payment
      ),
    }));

  const removeDevice = (id: string) =>
    commit((current) => ({
      ...current,
      trustedDevices: current.trustedDevices.filter(
        (device) => device.id !== id
      ),
    }));

  const toggleFrozenCard = (id: string) =>
    commit((current) => ({
      ...current,
      frozenCardIds: current.frozenCardIds.includes(id)
        ? current.frozenCardIds.filter((cardId) => cardId !== id)
        : [...current.frozenCardIds, id],
    }));

  const updateCardSetting = (
    key: keyof BankPreferences['cardSettings'],
    value: boolean
  ) =>
    commit((current) => ({
      ...current,
      cardSettings: { ...current.cardSettings, [key]: value },
    }));

  return {
    preferences,
    update,
    toggleScheduledPayment,
    removeDevice,
    toggleFrozenCard,
    updateCardSetting,
  };
};

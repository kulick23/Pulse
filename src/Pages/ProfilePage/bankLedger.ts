import { useEffect, useState } from 'react';
import { createVersionedStore } from '../../utils/versionedStorage';

export type LedgerTransactionType = 'income' | 'card' | 'transfer';
export type LedgerService =
  | 'bank'
  | 'shop'
  | 'mobile'
  | 'insurance'
  | 'investing'
  | 'travel'
  | 'business';

export interface LedgerTransaction {
  id: string;
  merchant: string;
  categoryRu: string;
  categoryEn: string;
  dateRu: string;
  dateEn: string;
  amount: number;
  currency: 'EUR';
  initials: string;
  type: LedgerTransactionType;
  service: LedgerService;
  status: 'completed' | 'cancelled';
  sourcePath?: string;
  createdAt?: string;
  reversible?: boolean;
  originalTransactionId?: string;
}

export interface BankLedger {
  eurBalance: number;
  transactions: LedgerTransaction[];
}

const storageKey = 'pulse-bank-ledger';

const initialTransactions: LedgerTransaction[] = [
  {
    id: 'cafe-central',
    merchant: 'Café Central',
    categoryRu: 'Рестораны · Вена',
    categoryEn: 'Restaurants · Vienna',
    dateRu: 'Сегодня, 12:40',
    dateEn: 'Today, 12:40',
    amount: -12.8,
    currency: 'EUR',
    initials: 'CC',
    type: 'card',
    service: 'bank',
    status: 'completed',
  },
  {
    id: 'salary',
    merchant: 'SEPA Incoming',
    categoryRu: 'Зарплата',
    categoryEn: 'Salary',
    dateRu: 'Сегодня, 09:15',
    dateEn: 'Today, 09:15',
    amount: 2850,
    currency: 'EUR',
    initials: 'SI',
    type: 'income',
    service: 'bank',
    status: 'completed',
  },
  {
    id: 'obb',
    merchant: 'ÖBB Tickets',
    categoryRu: 'Транспорт · Австрия',
    categoryEn: 'Transport · Austria',
    dateRu: 'Вчера',
    dateEn: 'Yesterday',
    amount: -48.9,
    currency: 'EUR',
    initials: 'ÖB',
    type: 'card',
    service: 'bank',
    status: 'completed',
  },
  {
    id: 'sofia',
    merchant: 'Sofia Laurent',
    categoryRu: 'SEPA-перевод',
    categoryEn: 'SEPA transfer',
    dateRu: '15 сентября',
    dateEn: '15 September',
    amount: -240,
    currency: 'EUR',
    initials: 'SL',
    type: 'transfer',
    service: 'bank',
    status: 'completed',
  },
  {
    id: 'rewe',
    merchant: 'REWE Markt',
    categoryRu: 'Супермаркеты · Берлин',
    categoryEn: 'Groceries · Berlin',
    dateRu: '13 сентября',
    dateEn: '13 September',
    amount: -64.32,
    currency: 'EUR',
    initials: 'RM',
    type: 'card',
    service: 'bank',
    status: 'completed',
  },
  {
    id: 'netflix',
    merchant: 'Netflix',
    categoryRu: 'Подписки',
    categoryEn: 'Subscriptions',
    dateRu: '12 сентября',
    dateEn: '12 September',
    amount: -17.99,
    currency: 'EUR',
    initials: 'NE',
    type: 'card',
    service: 'bank',
    status: 'completed',
  },
  {
    id: 'vault',
    merchant: 'Pulse Vault',
    categoryRu: 'В накопления',
    categoryEn: 'To savings',
    dateRu: '10 сентября',
    dateEn: '10 September',
    amount: -300,
    currency: 'EUR',
    initials: 'PV',
    type: 'transfer',
    service: 'bank',
    status: 'completed',
  },
];

export const initialLedger: BankLedger = {
  eurBalance: 4820.62,
  transactions: initialTransactions,
};

const migrateLedger = (source: unknown): BankLedger => {
  const parsed = (source ?? {}) as Partial<BankLedger>;
  return {
    eurBalance:
      typeof parsed.eurBalance === 'number'
        ? parsed.eurBalance
        : initialLedger.eurBalance,
    transactions: Array.isArray(parsed.transactions)
      ? parsed.transactions.map((transaction) => ({
          ...transaction,
          service: transaction.service ?? 'bank',
          status:
            transaction.status === 'cancelled'
              ? ('cancelled' as const)
              : ('completed' as const),
        }))
      : initialTransactions,
  };
};

const ledgerStore = createVersionedStore<BankLedger>({
  key: storageKey,
  version: 2,
  fallback: initialLedger,
  migrate: migrateLedger,
  validate: (value): value is BankLedger => {
    const candidate = value as Partial<BankLedger>;
    return (
      typeof candidate?.eurBalance === 'number' &&
      Array.isArray(candidate.transactions)
    );
  },
});

const readLedger = ledgerStore.read;

const ledgerChangeEvent = 'pulse-bank-ledger-change';

const writeLedger = (ledger: BankLedger) => {
  try {
    if (!ledgerStore.write(ledger)) return false;
    window.dispatchEvent(
      new CustomEvent<BankLedger>(ledgerChangeEvent, { detail: ledger })
    );
    return true;
  } catch {
    return false;
  }
};

const initialsFor = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.slice(0, 1).toLocaleUpperCase())
    .join('') || 'PB';

export interface PaymentInput {
  recipient: string;
  amount: number;
  categoryRu: string;
  categoryEn: string;
  type?: Exclude<LedgerTransactionType, 'income'>;
  service?: LedgerService;
  sourcePath?: string;
}

export const applyPayment = (
  current: BankLedger,
  input: PaymentInput,
  now = new Date(),
  transactionId = `TX-${Date.now()}`
): BankLedger | null => {
  const {
    recipient,
    amount,
    categoryRu,
    categoryEn,
    type = 'transfer',
    service = 'bank',
    sourcePath,
  } = input;
  if (!Number.isFinite(amount) || amount <= 0 || amount > current.eurBalance) {
    return null;
  }
  const dateRu = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);
  const dateEn = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);
  return {
    eurBalance: Number((current.eurBalance - amount).toFixed(2)),
    transactions: [
      {
        id: transactionId,
        merchant: recipient,
        categoryRu,
        categoryEn,
        dateRu,
        dateEn,
        amount: -amount,
        currency: 'EUR',
        initials: initialsFor(recipient),
        type,
        service,
        status: 'completed',
        sourcePath,
        createdAt: now.toISOString(),
        reversible: type === 'transfer',
      },
      ...current.transactions,
    ],
  };
};

export const cancelLedgerPayment = (
  current: BankLedger,
  transactionId: string
): BankLedger | null => {
  const transaction = current.transactions.find(
    (item) => item.id === transactionId
  );
  if (
    !transaction ||
    transaction.type !== 'transfer' ||
    transaction.amount >= 0 ||
    transaction.status !== 'completed' ||
    !transaction.reversible
  ) {
    return null;
  }
  return {
    eurBalance: Number(
      (current.eurBalance + Math.abs(transaction.amount)).toFixed(2)
    ),
    transactions: current.transactions.map((item) =>
      item.id === transactionId
        ? { ...item, status: 'cancelled' as const, reversible: false }
        : item
    ),
  };
};

export const repeatLedgerPayment = (
  current: BankLedger,
  transactionId: string,
  now = new Date(),
  repeatedId = `TX-${Date.now()}`
): BankLedger | null => {
  const transaction = current.transactions.find(
    (item) => item.id === transactionId
  );
  if (
    !transaction ||
    transaction.type !== 'transfer' ||
    transaction.amount >= 0
  ) {
    return null;
  }
  const next = applyPayment(
    current,
    {
      recipient: transaction.merchant,
      amount: Math.abs(transaction.amount),
      categoryRu: transaction.categoryRu,
      categoryEn: transaction.categoryEn,
      type: 'transfer',
      service: transaction.service,
      sourcePath: transaction.sourcePath,
    },
    now,
    repeatedId
  );
  if (!next) return null;
  const [created, ...rest] = next.transactions;
  return {
    ...next,
    transactions: [
      { ...created, originalTransactionId: transaction.id },
      ...rest,
    ],
  };
};

export const useBankLedger = () => {
  const [ledger, setLedger] = useState<BankLedger>(readLedger);

  useEffect(() => {
    const syncLedger = (event: Event) => {
      if (event instanceof CustomEvent && event.detail) {
        setLedger(event.detail as BankLedger);
        return;
      }
      setLedger(readLedger());
    };
    window.addEventListener(ledgerChangeEvent, syncLedger);
    window.addEventListener('storage', syncLedger);
    return () => {
      window.removeEventListener(ledgerChangeEvent, syncLedger);
      window.removeEventListener('storage', syncLedger);
    };
  }, []);

  const addPayment = (input: PaymentInput) => {
    const current = readLedger();
    const next = applyPayment(current, input);
    return next ? writeLedger(next) : false;
  };

  const addCredit = ({
    sender,
    amount,
    categoryRu,
    categoryEn,
    service = 'bank',
    sourcePath,
  }: {
    sender: string;
    amount: number;
    categoryRu: string;
    categoryEn: string;
    service?: LedgerService;
    sourcePath?: string;
  }) => {
    if (amount <= 0) return false;
    const current = readLedger();
    const now = new Date();
    const dateRu = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(now);
    const dateEn = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(now);
    const next: BankLedger = {
      eurBalance: Number((current.eurBalance + amount).toFixed(2)),
      transactions: [
        {
          id: `TX-${Date.now()}`,
          merchant: sender,
          categoryRu,
          categoryEn,
          dateRu,
          dateEn,
          amount,
          currency: 'EUR',
          initials: initialsFor(sender),
          type: 'income',
          service,
          status: 'completed',
          sourcePath,
        },
        ...current.transactions,
      ],
    };
    return writeLedger(next);
  };

  const cancelPayment = (transactionId: string) => {
    const current = readLedger();
    const next = cancelLedgerPayment(current, transactionId);
    return next ? writeLedger(next) : false;
  };

  const repeatPayment = (transactionId: string) => {
    const current = readLedger();
    const next = repeatLedgerPayment(current, transactionId);
    return next ? writeLedger(next) : false;
  };

  return {
    ...ledger,
    addPayment,
    addCredit,
    cancelPayment,
    repeatPayment,
  };
};

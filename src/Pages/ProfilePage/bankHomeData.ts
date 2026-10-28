import type { BankGlyphName } from './BankGlyph';

export interface BankAccount {
  id: string;
  currency: 'EUR' | 'GBP' | 'USD' | 'CHF';
  symbol: string;
  balance: number;
  balanceInEur: number;
  cardEndings: string[];
  nameRu: string;
  nameEn: string;
}

export interface BankHomeTransaction {
  id: string;
  merchant: string;
  categoryRu: string;
  categoryEn: string;
  dateRu: string;
  dateEn: string;
  amount: number;
  currency: 'EUR';
  initials: string;
}

export interface BankQuickAction {
  id: string;
  icon: BankGlyphName;
  labelRu: string;
  labelEn: string;
}

export const bankAccounts: BankAccount[] = [
  {
    id: 'eur', currency: 'EUR', symbol: '€', balance: 4820.62, balanceInEur: 4820.62,
    cardEndings: ['4821', '5793'], nameRu: 'Основной счёт', nameEn: 'Main account',
  },
  {
    id: 'gbp', currency: 'GBP', symbol: '£', balance: 920.1, balanceInEur: 1057.12,
    cardEndings: ['7363'], nameRu: 'Фунтовый счёт', nameEn: 'British pound account',
  },
  {
    id: 'usd', currency: 'USD', symbol: '$', balance: 1245, balanceInEur: 1063.36,
    cardEndings: [], nameRu: 'Долларовый счёт', nameEn: 'US dollar account',
  },
  {
    id: 'chf', currency: 'CHF', symbol: 'Fr', balance: 640.3, balanceInEur: 681.12,
    cardEndings: [], nameRu: 'Счёт во франках', nameEn: 'Swiss franc account',
  },
  {
    id: 'savings', currency: 'EUR', symbol: '+', balance: 2150, balanceInEur: 2150,
    cardEndings: [], nameRu: 'Накопления', nameEn: 'Savings vault',
  },
];

export const bankHomeTransactions: BankHomeTransaction[] = [
  {
    id: 'cafe-central', merchant: 'Café Central', categoryRu: 'Рестораны · Вена',
    categoryEn: 'Restaurants · Vienna', dateRu: 'Сегодня, 12:40', dateEn: 'Today, 12:40',
    amount: -12.8, currency: 'EUR', initials: 'CC',
  },
  {
    id: 'salary', merchant: 'SEPA Incoming', categoryRu: 'Зарплата', categoryEn: 'Salary',
    dateRu: 'Сегодня, 09:15', dateEn: 'Today, 09:15', amount: 2850, currency: 'EUR', initials: 'SI',
  },
  {
    id: 'obb', merchant: 'ÖBB Tickets', categoryRu: 'Транспорт · Австрия',
    categoryEn: 'Transport · Austria', dateRu: 'Вчера', dateEn: 'Yesterday',
    amount: -48.9, currency: 'EUR', initials: 'ÖB',
  },
  {
    id: 'rewe', merchant: 'REWE Markt', categoryRu: 'Супермаркеты · Берлин',
    categoryEn: 'Groceries · Berlin', dateRu: '17 сентября', dateEn: '17 September',
    amount: -64.32, currency: 'EUR', initials: 'RM',
  },
];

export const bankQuickActions: BankQuickAction[] = [
  { id: 'sepa', icon: 'transfer', labelRu: 'SEPA-перевод', labelEn: 'SEPA transfer' },
  { id: 'iban', icon: 'details', labelRu: 'По IBAN', labelEn: 'By IBAN' },
  { id: 'mobile', icon: 'mobile', labelRu: 'Мобильная связь', labelEn: 'Mobile top-up' },
  { id: 'invoice', icon: 'contract', labelRu: 'Оплатить счёт', labelEn: 'Pay a bill' },
];

export const totalAvailableEur = bankAccounts.reduce(
  (total, account) => total + account.balanceInEur,
  0,
);


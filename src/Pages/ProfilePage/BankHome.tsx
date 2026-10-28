import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cashbackOffer from '../../Assets/Bank/cashback-food.webp';
import { BankGlyph } from './BankGlyph';
import {
  bankAccounts,
  bankQuickActions,
  totalAvailableEur,
} from './bankHomeData';
import { useBankLedger } from './bankLedger';
import './BankHome.scss';

interface BankHomeProps {
  language: 'ru' | 'en';
  onNotice: () => void;
}

const locale = (language: 'ru' | 'en', ru: string, en: string) =>
  language === 'ru' ? ru : en;

export const BankHome: React.FC<BankHomeProps> = ({ language, onNotice }) => {
  const navigate = useNavigate();
  const [activeAccountId, setActiveAccountId] = useState('eur');
  const [search, setSearch] = useState('');
  const { eurBalance, transactions } = useBankLedger();
  const accounts = useMemo(
    () =>
      bankAccounts.map((account) =>
        account.id === 'eur'
          ? { ...account, balance: eurBalance, balanceInEur: eurBalance }
          : account
      ),
    [eurBalance]
  );
  const activeAccount =
    accounts.find((account) => account.id === activeAccountId) ?? accounts[0];
  const availableTotal =
    totalAvailableEur - bankAccounts[0].balance + eurBalance;
  const numberLocale = language === 'ru' ? 'ru-RU' : 'en-IE';

  const formatMoney = (value: number, currency: string) =>
    new Intl.NumberFormat(numberLocale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(numberLocale);
    if (!query) return transactions;
    return transactions.filter((transaction) =>
      `${transaction.merchant} ${language === 'ru' ? transaction.categoryRu : transaction.categoryEn}`
        .toLocaleLowerCase(numberLocale)
        .includes(query)
    );
  }, [language, numberLocale, search, transactions]);

  return (
    <div className="bank-shell bank-home">
      <header className="bank-home__heading">
        <div>
          <p>{locale(language, 'Личный банк', 'Personal banking')}</p>
          <h1>
            {locale(language, 'Добрый день, Данила', 'Good afternoon, Danila')}
          </h1>
        </div>
        <button
          className="bank-home__primary"
          type="button"
          onClick={() => navigate('/bank/payments')}
        >
          <BankGlyph name="transfer" />
          {locale(language, 'Новый перевод', 'New transfer')}
        </button>
      </header>

      <section className="bank-home-overview" aria-labelledby="balance-title">
        <div className="bank-home-balance">
          <span id="balance-title">
            {locale(
              language,
              'Доступно на всех счетах',
              'Available across accounts'
            )}
          </span>
          <strong>{formatMoney(availableTotal, 'EUR')}</strong>
          <p>
            <b>+{formatMoney(2850, 'EUR')}</b>
            {locale(
              language,
              ' поступило в сентябре',
              ' received in September'
            )}
          </p>

          <div
            className="bank-home-accounts"
            aria-label={locale(language, 'Счета', 'Accounts')}
          >
            {accounts.map((account) => (
              <button
                className={activeAccount.id === account.id ? 'active' : ''}
                type="button"
                key={account.id}
                onClick={() => setActiveAccountId(account.id)}
                aria-pressed={activeAccount.id === account.id}
              >
                <span>{account.symbol}</span>
                <span>
                  <small>
                    {language === 'ru' ? account.nameRu : account.nameEn}
                  </small>
                  <strong>
                    {formatMoney(account.balance, account.currency)}
                  </strong>
                </span>
              </button>
            ))}
          </div>
        </div>

        <aside
          className="bank-home-card"
          aria-label={locale(language, 'Выбранная карта', 'Selected card')}
        >
          <div className="bank-home-card__meta">
            <span>
              {language === 'ru' ? activeAccount.nameRu : activeAccount.nameEn}
            </span>
            <button
              type="button"
              onClick={() => navigate(`/bank/account/${activeAccount.id}`)}
            >
              {locale(language, 'Счёт', 'Account')}{' '}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
          <button
            className="bank-home-card__object"
            type="button"
            onClick={() => navigate('/bank/card/4821')}
            aria-label={locale(
              language,
              'Открыть карту Pulse 4821',
              'Open Pulse card 4821'
            )}
          >
            <span className="bank-home-card__brand">PULSE</span>
            <span className="bank-home-card__chip" aria-hidden="true" />
            <span className="bank-home-card__number">•••• 4821</span>
            <span className="bank-home-card__network" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
          <div className="bank-home-card__footer">
            <span>
              {formatMoney(activeAccount.balance, activeAccount.currency)}
            </span>
            <small>{locale(language, 'Основная карта', 'Primary card')}</small>
          </div>
        </aside>
      </section>

      <nav
        className="bank-home-actions"
        aria-label={locale(language, 'Быстрые действия', 'Quick actions')}
      >
        {bankQuickActions.map((action) => (
          <button
            type="button"
            key={action.id}
            onClick={() => navigate('/bank/payments')}
          >
            <BankGlyph name={action.icon} />
            <span>{language === 'ru' ? action.labelRu : action.labelEn}</span>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </nav>

      <div className="bank-home-content">
        <section
          className="bank-home-activity"
          aria-labelledby="activity-title"
        >
          <header>
            <div>
              <h2 id="activity-title">
                {locale(language, 'Последние операции', 'Recent activity')}
              </h2>
              <p>{locale(language, 'Сентябрь 2026', 'September 2026')}</p>
            </div>
            <button type="button" onClick={() => navigate('/bank/operations')}>
              {locale(language, 'Все операции', 'View all')}{' '}
              <span aria-hidden="true">↗</span>
            </button>
          </header>

          <label className="bank-home-search">
            <span className="sr-only">
              {locale(language, 'Поиск по операциям', 'Search activity')}
            </span>
            <BankGlyph name="search" />
            <input
              type="search"
              name="activity-search"
              autoComplete="off"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={locale(
                language,
                'Магазин или категория…',
                'Merchant or category…'
              )}
            />
          </label>

          <div className="bank-home-activity__rows" aria-live="polite">
            {filteredTransactions.length ? (
              filteredTransactions.map((transaction) => (
                <button
                  type="button"
                  key={transaction.id}
                  onClick={() => navigate('/bank/operations')}
                >
                  <span className="bank-home-activity__mark">
                    {transaction.initials}
                  </span>
                  <span className="bank-home-activity__merchant">
                    <strong>{transaction.merchant}</strong>
                    <small>
                      {language === 'ru'
                        ? transaction.categoryRu
                        : transaction.categoryEn}
                    </small>
                  </span>
                  <span className="bank-home-activity__date">
                    {language === 'ru'
                      ? transaction.dateRu
                      : transaction.dateEn}
                  </span>
                  <strong className={transaction.amount > 0 ? 'positive' : ''}>
                    {transaction.amount > 0 ? '+' : ''}
                    {formatMoney(transaction.amount, transaction.currency)}
                  </strong>
                </button>
              ))
            ) : (
              <p className="bank-home-activity__empty">
                {locale(
                  language,
                  'Совпадений не найдено. Попробуйте другой запрос.',
                  'No matches. Try another search.'
                )}
              </p>
            )}
          </div>
        </section>

        <aside className="bank-home-insights">
          <section className="bank-home-spending">
            <header>
              <span>
                {locale(language, 'Расходы в сентябре', 'September spending')}
              </span>
              <strong>{formatMoney(684.01, 'EUR')}</strong>
            </header>
            <div className="bank-home-spending__bar" aria-label="68%">
              <i />
            </div>
            <p>
              {locale(language, 'Осталось ', 'Remaining ')}
              <b>{formatMoney(315.99, 'EUR')}</b>
              {locale(language, ' из месячного плана', ' of the monthly plan')}
            </p>
          </section>

          <button
            className="bank-home-benefit"
            type="button"
            onClick={() => navigate('/bank/bonuses')}
          >
            <img src={cashbackOffer} alt="" width="626" height="272" />
            <span>
              <small>
                {locale(language, 'Предложение недели', 'Offer of the week')}
              </small>
              <strong>
                {locale(
                  language,
                  '10% на городской транспорт',
                  '10% on city transport'
                )}
              </strong>
              <span>
                {locale(language, 'Открыть предложение', 'Open offer')} ↗
              </span>
            </span>
          </button>

          <button
            className="bank-home-add-product"
            type="button"
            onClick={onNotice}
          >
            <span>+</span>
            <span>
              <strong>
                {locale(
                  language,
                  'Новый счёт или продукт',
                  'New account or product'
                )}
              </strong>
              <small>
                {locale(
                  language,
                  'Карты, накопления и инвестиции',
                  'Cards, savings and investments'
                )}
              </small>
            </span>
          </button>
        </aside>
      </div>
    </div>
  );
};

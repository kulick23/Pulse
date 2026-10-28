import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BankGlyph, BankGlyphName } from './BankGlyph';
import cardArtwork from '../../Assets/Bank/card-byn.png';
import driveOffer from '../../Assets/Bank/cashback-food.webp';
import driveMark from '../../Assets/Bank/cashback-drive.webp';
import partnerOne from '../../Assets/Bank/cashback-partner-1.webp';
import partnerTwo from '../../Assets/Bank/cashback-partner-2.webp';
import benefitsPro from '../../Assets/Bank/benefits-pro.webp';
import { LedgerTransaction, useBankLedger } from './bankLedger';
import { BankMoreFlow, MoreFlowKey } from './BankMoreFlow';
import { useBankPreferences } from './bankPreferences';
import {
  BankViewProps,
  DemoModal,
  formatCurrency,
  formatLedgerAmount,
  locale,
  MiniActivity,
  processLocalBankAction,
} from './BankViewShared';

export const OperationsView: React.FC<BankViewProps> = ({ language }) => {
  const navigate = useNavigate();
  const { transactions, eurBalance, cancelPayment, repeatPayment } =
    useBankLedger();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<LedgerTransaction | null>(null);
  const [actionState, setActionState] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [actionMessage, setActionMessage] = useState('');
  const filtered = useMemo(
    () =>
      transactions.filter((item) => {
        const matchesType = filter === 'all' || item.type === filter;
        const matchesQuery =
          `${item.merchant} ${item.categoryRu} ${item.categoryEn}`
            .toLowerCase()
            .includes(query.toLowerCase());
        return matchesType && matchesQuery;
      }),
    [filter, query, transactions]
  );
  const spending = Math.abs(
    transactions
      .filter((item) => item.amount < 0)
      .reduce((total, item) => total + item.amount, 0)
  );
  const income = transactions
    .filter((item) => item.amount > 0)
    .reduce((total, item) => total + item.amount, 0);

  useEffect(() => {
    if (!selected) return;
    const latest = transactions.find((item) => item.id === selected.id);
    if (latest && latest.status !== selected.status) setSelected(latest);
  }, [selected, transactions]);

  const runTransactionAction = async (action: 'cancel' | 'repeat') => {
    if (!selected || actionState === 'loading') return;
    setActionState('loading');
    setActionMessage(
      locale(
        language,
        action === 'cancel' ? 'Отменяем перевод…' : 'Повторяем перевод…',
        action === 'cancel' ? 'Cancelling transfer…' : 'Repeating transfer…'
      )
    );
    await processLocalBankAction();

    if (action === 'repeat' && Math.abs(selected.amount) > eurBalance) {
      setActionState('error');
      setActionMessage(
        locale(
          language,
          `Недостаточно средств. Доступно ${formatCurrency(eurBalance, language)}.`,
          `Insufficient funds. ${formatCurrency(eurBalance, language)} is available.`
        )
      );
      return;
    }

    const completed =
      action === 'cancel'
        ? cancelPayment(selected.id)
        : repeatPayment(selected.id);
    if (!completed) {
      setActionState('error');
      setActionMessage(
        locale(
          language,
          'Не удалось сохранить операцию. Попробуйте ещё раз.',
          'The operation could not be saved. Try again.'
        )
      );
      return;
    }

    setActionState('success');
    setActionMessage(
      locale(
        language,
        action === 'cancel'
          ? 'Перевод отменён, деньги возвращены на EUR-счёт.'
          : 'Перевод повторён и добавлен в историю.',
        action === 'cancel'
          ? 'The transfer was cancelled and refunded to your EUR account.'
          : 'The transfer was repeated and added to your activity.'
      )
    );
  };

  return (
    <div className="bank-shell bank-view bank-operations-view">
      <div className="bank-view__heading">
        <span className="bank-eyebrow">Pulse Bank Europe</span>
        <h1>{locale(language, 'Операции', 'Activity')}</h1>
        <p>
          {locale(
            language,
            'Все счета и карты в одном списке',
            'Every account and card in one timeline'
          )}
        </p>
      </div>
      <label className="bank-search bank-operation-search">
        <span aria-hidden="true">⌕</span>
        <input
          name="activity-search"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          placeholder={locale(
            language,
            'Поиск по операциям',
            'Search activity'
          )}
        />
      </label>
      <div className="bank-filter-row">
        {[
          ['all', 'Все', 'All'],
          ['income', 'Пополнения', 'Income'],
          ['card', 'По карте', 'Card'],
          ['transfer', 'Переводы', 'Transfers'],
        ].map(([id, ru, en]) => (
          <button
            className={filter === id ? 'active' : ''}
            type="button"
            key={id}
            onClick={() => setFilter(id)}
          >
            {language === 'ru' ? ru : en}
          </button>
        ))}
      </div>
      <div className="bank-summary-grid">
        <article>
          <span>{locale(language, 'Расходы', 'Spending')}</span>
          <strong>{formatCurrency(spending, language)}</strong>
          <i />
        </article>
        <article>
          <span>{locale(language, 'Поступления', 'Income')}</span>
          <strong>{formatCurrency(income, language)}</strong>
          <i />
        </article>
        <article>
          <span>{locale(language, 'Кэшбэк', 'Cashback')}</span>
          <strong>18,42 €</strong>
          <i />
        </article>
      </div>
      <section className="bank-panel bank-transaction-list">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <button
              className="bank-transaction"
              type="button"
              key={item.id}
              onClick={() => setSelected(item)}
            >
              <span className="bank-transaction__date">
                {language === 'ru' ? item.dateRu : item.dateEn}
              </span>
              <span
                className={`bank-transaction__icon bank-transaction__icon--${item.type}`}
              >
                {item.initials}
              </span>
              <div>
                <strong>{item.merchant}</strong>
                <small>
                  {language === 'ru' ? item.categoryRu : item.categoryEn}
                </small>
              </div>
              <b className={item.type === 'income' ? 'positive' : ''}>
                {formatLedgerAmount(item.amount, language)}
              </b>
            </button>
          ))
        ) : (
          <div className="bank-empty-state bank-empty-state--timeline">
            <BankGlyph
              name={transactions.length === 0 ? 'transfer' : 'search'}
            />
            <strong>
              {transactions.length === 0
                ? locale(
                    language,
                    'Здесь появятся ваши операции',
                    'Your activity will appear here'
                  )
                : locale(language, 'Ничего не найдено', 'No activity found')}
            </strong>
            <small>
              {transactions.length === 0
                ? locale(
                    language,
                    'Совершите первый перевод или платёж.',
                    'Make your first transfer or payment.'
                  )
                : locale(
                    language,
                    'Измените запрос или сбросьте фильтры.',
                    'Change the query or reset the filters.'
                  )}
            </small>
            <button
              type="button"
              onClick={() => {
                if (transactions.length === 0) navigate('/bank/payments');
                else {
                  setFilter('all');
                  setQuery('');
                }
              }}
            >
              {transactions.length === 0
                ? locale(language, 'Новый перевод', 'New transfer')
                : locale(language, 'Сбросить фильтры', 'Reset filters')}
            </button>
          </div>
        )}
      </section>
      {selected && (
        <DemoModal
          title={selected.merchant}
          closeLabel={locale(language, 'Закрыть', 'Close')}
          onClose={() => {
            setSelected(null);
            setActionState('idle');
            setActionMessage('');
          }}
        >
          <div className="bank-receipt">
            <span>{locale(language, 'Сумма', 'Amount')}</span>
            <strong>{formatLedgerAmount(selected.amount, language)}</strong>
            <dl>
              <div>
                <dt>{locale(language, 'Дата', 'Date')}</dt>
                <dd>{language === 'ru' ? selected.dateRu : selected.dateEn}</dd>
              </div>
              <div>
                <dt>{locale(language, 'Категория', 'Category')}</dt>
                <dd>
                  {language === 'ru'
                    ? selected.categoryRu
                    : selected.categoryEn}
                </dd>
              </div>
              <div>
                <dt>{locale(language, 'Статус', 'Status')}</dt>
                <dd>
                  {selected.status === 'cancelled'
                    ? locale(language, 'Отменено', 'Cancelled')
                    : locale(language, 'Выполнено', 'Completed')}
                </dd>
              </div>
            </dl>
            {selected.type === 'transfer' && selected.amount < 0 && (
              <div className="bank-receipt__actions">
                <button
                  className="bank-primary-button"
                  type="button"
                  disabled={actionState === 'loading'}
                  onClick={() => runTransactionAction('repeat')}
                >
                  {locale(language, 'Повторить перевод', 'Repeat transfer')}
                </button>
                {selected.status === 'completed' && selected.reversible && (
                  <button
                    className="bank-secondary-button bank-secondary-button--danger"
                    type="button"
                    disabled={actionState === 'loading'}
                    onClick={() => runTransactionAction('cancel')}
                  >
                    {locale(language, 'Отменить перевод', 'Cancel transfer')}
                  </button>
                )}
              </div>
            )}
            {actionState !== 'idle' && (
              <div
                className={`bank-operation-feedback bank-operation-feedback--${actionState}`}
                role={actionState === 'error' ? 'alert' : 'status'}
                aria-live="polite"
              >
                {actionState === 'loading' && <span aria-hidden="true" />}
                <p>{actionMessage}</p>
                {actionState === 'error' && (
                  <button type="button" onClick={() => setActionState('idle')}>
                    {locale(language, 'Закрыть', 'Dismiss')}
                  </button>
                )}
              </div>
            )}
            <button
              className="bank-receipt__done"
              type="button"
              onClick={() => setSelected(null)}
            >
              {locale(language, 'Готово', 'Done')}
            </button>
          </div>
        </DemoModal>
      )}
    </div>
  );
};

const ActionGrid: React.FC<{
  title: string;
  items: ActionItem[];
  language: 'ru' | 'en';
  onSelect: (item: ActionItem) => void;
}> = ({ title, items, language, onSelect }) => (
  <section className="bank-panel bank-action-grid">
    <h2>{title}</h2>
    <div>
      {items.map((item) => (
        <button type="button" key={item[1]} onClick={() => onSelect(item)}>
          <span>
            <BankGlyph name={item[0]} />
          </span>
          {language === 'ru' ? item[1] : item[2]}
        </button>
      ))}
    </div>
  </section>
);

import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BankGlyph, BankGlyphName } from './BankGlyph';
import cardArtwork from '../../assets/Bank/card-byn.png';
import driveOffer from '../../assets/Bank/cashback-food.webp';
import driveMark from '../../assets/Bank/cashback-drive.webp';
import partnerOne from '../../assets/Bank/cashback-partner-1.webp';
import partnerTwo from '../../assets/Bank/cashback-partner-2.webp';
import benefitsPro from '../../assets/Bank/benefits-pro.webp';
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

type PaymentFlow =
  | 'bank'
  | 'between'
  | 'card'
  | 'agreement'
  | 'details'
  | 'swift'
  | 'mobile'
  | 'utilities'
  | 'games'
  | 'government'
  | 'loan'
  | 'internet'
  | 'invoice'
  | 'request';
type ActionItem = [BankGlyphName, string, string];
type ModalKind =
  | 'sepa'
  | 'between'
  | 'card'
  | 'mobile'
  | 'invoice'
  | 'request'
  | null;

const FlowField: React.FC<{
  label: string;
  name: string;
  placeholder?: string;
  type?: 'input' | 'select';
  required?: boolean;
}> = ({ label, name, placeholder, type = 'input', required = true }) => (
  <label className="bank-transfer-field">
    <span>{label}</span>
    {type === 'select' ? (
      <select name={name} required={required} defaultValue="">
        <option value="" disabled>
          {placeholder}
        </option>
        <option>Pulse Current · GBP</option>
        <option>Pulse Current · USD</option>
      </select>
    ) : (
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
      />
    )}
  </label>
);

interface PaymentDraft {
  recipient: string;
  amount: number;
  reference: string;
}

const PaymentFlowScreen: React.FC<{
  kind: PaymentFlow;
  language: 'ru' | 'en';
  onBack: () => void;
}> = ({ kind, language, onBack }) => {
  const [stage, setStage] = useState<'form' | 'review' | 'done'>('form');
  const [draft, setDraft] = useState<PaymentDraft>({
    recipient: '',
    amount: 0,
    reference: '',
  });
  const [error, setError] = useState('');
  const [submissionState, setSubmissionState] = useState<
    'idle' | 'loading' | 'error'
  >('idle');
  const [submissionError, setSubmissionError] = useState('');
  const { eurBalance, addPayment } = useBankLedger();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [stage]);
  const title = paymentFlowTitles[kind][language === 'ru' ? 0 : 1];
  const isRequest = kind === 'request';
  const formatEur = (value: number) =>
    new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  const openInvoice = (recipient: string, amount: number) => {
    setDraft({
      recipient,
      amount,
      reference: locale(language, 'Оплата счёта', 'Bill payment'),
    });
    setError('');
    setSubmissionState('idle');
    setSubmissionError('');
    setStage('review');
  };
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const amount = Number(
      String(data.get('amount') ?? '')
        .replace(/\s/g, '')
        .replace(',', '.')
    );
    const recipient =
      String(data.get('recipient') ?? data.get('details') ?? title).trim() ||
      title;
    if (!Number.isFinite(amount) || amount <= 0) {
      setError(
        locale(
          language,
          'Введите сумму больше нуля.',
          'Enter an amount greater than zero.'
        )
      );
      return;
    }
    if (!isRequest && amount > eurBalance) {
      setError(
        locale(
          language,
          'На EUR-счёте недостаточно средств.',
          'There is not enough money in your EUR account.'
        )
      );
      return;
    }
    setDraft({
      recipient,
      amount,
      reference: String(data.get('reference') ?? '').trim(),
    });
    setError('');
    setSubmissionState('idle');
    setSubmissionError('');
    setStage('review');
  };
  const confirm = async () => {
    if (submissionState === 'loading') return;
    setSubmissionState('loading');
    setSubmissionError('');
    await processLocalBankAction();

    if (!isRequest) {
      if (draft.amount > eurBalance) {
        setSubmissionState('error');
        setSubmissionError(
          locale(
            language,
            `Недостаточно средств. На EUR-счёте доступно ${formatEur(eurBalance)}.`,
            `Insufficient funds. ${formatEur(eurBalance)} is available in your EUR account.`
          )
        );
        return;
      }
      const completed = addPayment({
        recipient: draft.recipient,
        amount: draft.amount,
        categoryRu: paymentFlowTitles[kind][0],
        categoryEn: paymentFlowTitles[kind][1],
      });
      if (!completed) {
        setSubmissionState('error');
        setSubmissionError(
          locale(
            language,
            'Не удалось сохранить операцию. Проверьте локальное хранилище и попробуйте ещё раз.',
            'The operation could not be saved. Check local storage and try again.'
          )
        );
        return;
      }
    }
    setSubmissionState('idle');
    setStage('done');
  };

  if (stage === 'done') {
    return (
      <div className="bank-shell bank-view bank-transfer-page">
        <button className="bank-back-button" type="button" onClick={onBack}>
          ← {locale(language, 'К платежам', 'Back to payments')}
        </button>
        <section className="bank-transfer-result">
          <span>✓</span>
          <h1>
            {locale(
              language,
              isRequest ? 'Запрос отправлен' : 'Перевод выполнен',
              isRequest ? 'Request sent' : 'Transfer complete'
            )}
          </h1>
          <p>
            {isRequest
              ? locale(
                  language,
                  `Запрос на ${formatEur(draft.amount)} отправлен получателю ${draft.recipient}.`,
                  `A request for ${formatEur(draft.amount)} was sent to ${draft.recipient}.`
                )
              : locale(
                  language,
                  `Операция добавлена в историю. На EUR-счёте осталось ${formatEur(eurBalance)}.`,
                  `The payment is now in your activity. Your EUR balance is ${formatEur(eurBalance)}.`
                )}
          </p>
          <button
            className="bank-primary-button"
            type="button"
            onClick={onBack}
          >
            {locale(language, 'Готово', 'Done')}
          </button>
        </section>
      </div>
    );
  }

  if (stage === 'review') {
    return (
      <div className="bank-shell bank-view bank-transfer-page">
        <button
          className="bank-back-button"
          type="button"
          disabled={submissionState === 'loading'}
          onClick={() => {
            setSubmissionState('idle');
            setSubmissionError('');
            setStage('form');
          }}
        >
          ← {locale(language, 'Изменить', 'Edit')}
        </button>
        <div className="bank-transfer-heading">
          <span className="bank-eyebrow">PULSE BANK EUROPE</span>
          <h1>{locale(language, 'Проверьте данные', 'Review details')}</h1>
        </div>
        <section className="bank-transfer-summary">
          <div>
            <span>{locale(language, 'Операция', 'Operation')}</span>
            <strong>{title}</strong>
          </div>
          <div>
            <span>{locale(language, 'Получатель', 'Recipient')}</span>
            <strong>{draft.recipient}</strong>
          </div>
          {!isRequest && (
            <div>
              <span>{locale(language, 'Со счёта', 'From')}</span>
              <strong>Pulse Current · EUR</strong>
            </div>
          )}
          <div>
            <span>{locale(language, 'Сумма', 'Amount')}</span>
            <strong>{formatEur(draft.amount)}</strong>
          </div>
          <div>
            <span>{locale(language, 'Комиссия', 'Fee')}</span>
            <strong>{formatEur(0)}</strong>
          </div>
          {submissionState === 'loading' && (
            <div
              className="bank-transfer-status bank-transfer-status--loading"
              role="status"
            >
              <span aria-hidden="true" />
              <div>
                <strong>
                  {locale(
                    language,
                    'Обрабатываем операцию',
                    'Processing operation'
                  )}
                </strong>
                <small>
                  {locale(
                    language,
                    'Проверяем баланс и сохраняем перевод.',
                    'Checking the balance and saving the transfer.'
                  )}
                </small>
              </div>
            </div>
          )}
          {submissionState === 'error' && (
            <div
              className="bank-transfer-status bank-transfer-status--error"
              role="alert"
            >
              <BankGlyph name="shield" />
              <div>
                <strong>
                  {locale(
                    language,
                    'Операция не выполнена',
                    'Operation not completed'
                  )}
                </strong>
                <small>{submissionError}</small>
              </div>
              <div className="bank-transfer-status__actions">
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionState('idle');
                    setSubmissionError('');
                    setStage('form');
                  }}
                >
                  {locale(language, 'Изменить сумму', 'Change amount')}
                </button>
                <button type="button" onClick={confirm}>
                  {locale(language, 'Повторить', 'Try again')}
                </button>
              </div>
            </div>
          )}
          <button
            className="bank-primary-button"
            type="button"
            disabled={submissionState === 'loading'}
            aria-busy={submissionState === 'loading'}
            onClick={confirm}
          >
            {submissionState === 'loading'
              ? locale(language, 'Обработка…', 'Processing…')
              : locale(
                  language,
                  isRequest ? 'Отправить запрос' : 'Подтвердить',
                  isRequest ? 'Send request' : 'Confirm'
                )}
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="bank-shell bank-view bank-transfer-page">
      <button className="bank-back-button" type="button" onClick={onBack}>
        ← {locale(language, 'Назад', 'Back')}
      </button>
      <div className="bank-transfer-heading">
        <span className="bank-eyebrow">PULSE BANK EUROPE</span>
        <h1>{title}</h1>
        <p>
          {kind === 'swift'
            ? 'SWIFT · SHA / OUR'
            : kind === 'bank' || kind === 'details'
              ? 'SEPA Instant · SEPA Credit Transfer'
              : 'EUR · Pulse Secure'}
        </p>
      </div>
      <form className="bank-transfer-form" onSubmit={submit}>
        {kind !== 'invoice' && kind !== 'request' && (
          <section className="bank-transfer-step">
            <h2>{locale(language, 'Откуда', 'From')}</h2>
            <button className="bank-source-account" type="button">
              <span>€</span>
              <div>
                <strong>Pulse Current</strong>
                <small>{formatEur(eurBalance)}</small>
              </div>
              <b>⌄</b>
            </button>
          </section>
        )}
        <section className="bank-transfer-step">
          <h2>
            {locale(
              language,
              kind === 'invoice'
                ? 'Выберите счёт'
                : isRequest
                  ? 'Кому отправить запрос'
                  : 'Куда',
              kind === 'invoice'
                ? 'Choose a bill'
                : isRequest
                  ? 'Who to request from'
                  : 'To'
            )}
          </h2>
          {kind === 'invoice' ? (
            <div className="bank-flow-bills">
              <button
                type="button"
                onClick={() => openInvoice('Wien Energie', 82.4)}
              >
                <span>
                  <BankGlyph name="utilities" />
                </span>
                <div>
                  <strong>Wien Energie</strong>
                  <small>
                    {locale(language, 'До 24 сентября', 'Due 24 September')}
                  </small>
                </div>
                <b>82,40 €</b>
              </button>
              <button
                type="button"
                onClick={() => openInvoice('Magenta Telekom', 39.9)}
              >
                <span>
                  <BankGlyph name="internet" />
                </span>
                <div>
                  <strong>Magenta Telekom</strong>
                  <small>
                    {locale(language, 'До 28 сентября', 'Due 28 September')}
                  </small>
                </div>
                <b>39,90 €</b>
              </button>
            </div>
          ) : (
            <>
              {kind === 'between' && (
                <FlowField
                  name="recipient"
                  label={locale(
                    language,
                    'Счёт получателя',
                    'Destination account'
                  )}
                  placeholder={locale(
                    language,
                    'Выберите счёт',
                    'Choose account'
                  )}
                  type="select"
                />
              )}
              {kind === 'card' && (
                <FlowField
                  name="recipient"
                  label={locale(language, 'Номер карты', 'Card number')}
                  placeholder="0000 0000 0000 0000"
                />
              )}
              {kind === 'agreement' && (
                <FlowField
                  name="recipient"
                  label={locale(language, 'Номер договора', 'Agreement number')}
                  placeholder="PLS-00000000"
                />
              )}
              {(kind === 'bank' || kind === 'details') && (
                <>
                  <FlowField
                    name="recipient"
                    label={locale(language, 'Получатель', 'Beneficiary')}
                    placeholder="Sofia Laurent"
                  />
                  <FlowField
                    name="details"
                    label="IBAN"
                    placeholder="DE89 3704 0044 0532 0130 00"
                  />
                </>
              )}
              {kind === 'swift' && (
                <>
                  <FlowField
                    name="country"
                    label={locale(language, 'Страна банка', 'Bank country')}
                    placeholder={locale(
                      language,
                      'Выберите страну',
                      'Choose country'
                    )}
                    type="select"
                  />
                  <FlowField
                    name="details"
                    label="SWIFT / BIC"
                    placeholder="PULSDEFFXXX"
                  />
                  <FlowField
                    name="recipient"
                    label={locale(language, 'Получатель', 'Beneficiary')}
                    placeholder="Sofia Laurent"
                  />
                </>
              )}
              {kind === 'mobile' && (
                <FlowField
                  name="recipient"
                  label={locale(language, 'Номер телефона', 'Phone number')}
                  placeholder="+49 151 000 00 00"
                />
              )}
              {kind === 'utilities' && (
                <>
                  <FlowField
                    name="recipient"
                    label={locale(language, 'Поставщик', 'Provider')}
                    placeholder="Wien Energie"
                  />
                  <FlowField
                    name="details"
                    label={locale(language, 'Номер клиента', 'Customer number')}
                    placeholder="1000 2000 3000"
                  />
                </>
              )}
              {kind === 'games' && (
                <>
                  <FlowField
                    name="recipient"
                    label={locale(language, 'Сервис', 'Service')}
                    placeholder="PlayStation Network"
                  />
                  <FlowField
                    name="details"
                    label="Email"
                    placeholder="name@example.eu"
                  />
                </>
              )}
              {kind === 'government' && (
                <FlowField
                  name="recipient"
                  label={locale(language, 'Налоговый номер', 'Tax identifier')}
                  placeholder="EU-123456789"
                />
              )}
              {kind === 'loan' && (
                <FlowField
                  name="recipient"
                  label={locale(
                    language,
                    'IBAN кредитного счёта',
                    'Loan account IBAN'
                  )}
                  placeholder="DE89 3704 0044 0532 0130 00"
                />
              )}
              {kind === 'internet' && (
                <>
                  <FlowField
                    name="recipient"
                    label={locale(language, 'Оператор', 'Provider')}
                    placeholder="Magenta Telekom"
                  />
                  <FlowField
                    name="details"
                    label={locale(
                      language,
                      'Номер договора',
                      'Contract number'
                    )}
                    placeholder="AT-000000"
                  />
                </>
              )}
              {isRequest && (
                <FlowField
                  name="recipient"
                  label={locale(
                    language,
                    'Имя, телефон или email',
                    'Name, phone or email'
                  )}
                  placeholder="Sofia Laurent"
                />
              )}
            </>
          )}
        </section>
        {kind !== 'invoice' && (
          <section className="bank-transfer-step">
            <h2>
              {locale(
                language,
                isRequest ? 'Сколько запросить' : 'Сколько перевести',
                isRequest ? 'Amount to request' : 'Amount'
              )}
            </h2>
            <div className="bank-transfer-amount">
              <input
                name="amount"
                aria-label={locale(language, 'Сумма', 'Amount')}
                required
                inputMode="decimal"
                placeholder="0,00"
                defaultValue={draft.amount || ''}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'bank-transfer-error' : undefined}
              />
              <span>EUR</span>
            </div>
            <FlowField
              name="reference"
              required={false}
              label={locale(language, 'Назначение', 'Reference')}
              placeholder={locale(language, 'Необязательно', 'Optional')}
            />
            <small>
              {isRequest
                ? locale(
                    language,
                    'Запрос не изменит баланс счёта',
                    'A request will not change your balance'
                  )
                : locale(
                    language,
                    `Доступно ${formatEur(eurBalance)}`,
                    `Available ${formatEur(eurBalance)}`
                  )}
            </small>
            {error && (
              <div
                id="bank-transfer-error"
                className="bank-transfer-error"
                role="alert"
              >
                <BankGlyph name="shield" />
                <div>
                  <strong>
                    {locale(
                      language,
                      'Проверьте данные операции',
                      'Check the operation details'
                    )}
                  </strong>
                  <small>{error}</small>
                </div>
              </div>
            )}
          </section>
        )}
        {kind !== 'invoice' && (
          <button
            className="bank-primary-button bank-transfer-submit"
            type="submit"
          >
            {locale(language, 'Продолжить', 'Continue')}
          </button>
        )}
      </form>
    </div>
  );
};

const PaymentActions: React.FC<{
  title: string;
  items: Array<[BankGlyphName, string, string, PaymentFlow]>;
  language: 'ru' | 'en';
  onSelect: (flow: PaymentFlow) => void;
}> = ({ title, items, language, onSelect }) => (
  <section className="bank-panel bank-action-grid">
    <h2>{title}</h2>
    <div>
      {items.map(([icon, ru, en, flow]) => (
        <button type="button" key={flow} onClick={() => onSelect(flow)}>
          <span>
            <BankGlyph name={icon} />
          </span>
          {language === 'ru' ? ru : en}
        </button>
      ))}
    </div>
  </section>
);

export const PaymentsView: React.FC<BankViewProps> = ({ language }) => {
  const [flow, setFlow] = useState<PaymentFlow | null>(null);
  const [query, setQuery] = useState('');
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [flow]);
  if (flow)
    return (
      <PaymentFlowScreen
        kind={flow}
        language={language}
        onBack={() => setFlow(null)}
      />
    );
  const transfers: Array<[BankGlyphName, string, string, PaymentFlow]> = [
    ['bank', 'Из другого банка', 'From another bank', 'bank'],
    ['between', 'Между счетами', 'Between accounts', 'between'],
    ['card', 'По номеру карты', 'By card number', 'card'],
    ['contract', 'По номеру договора', 'By agreement number', 'agreement'],
    ['details', 'По реквизитам', 'Bank details', 'details'],
    ['swift', 'SWIFT-перевод', 'SWIFT transfer', 'swift'],
  ];
  const payments: Array<[BankGlyphName, string, string, PaymentFlow]> = [
    ['mobile', 'Мобильная связь', 'Mobile', 'mobile'],
    ['utilities', 'Коммунальные услуги', 'Utilities', 'utilities'],
    ['games', 'Цифровые сервисы', 'Digital services', 'games'],
    ['government', 'Налоги и сборы', 'Taxes and fees', 'government'],
    ['loan', 'Погашение кредита', 'Loan repayment', 'loan'],
    ['internet', 'Интернет и ТВ', 'Internet and TV', 'internet'],
  ];
  const matches = (item: [BankGlyphName, string, string, PaymentFlow]) =>
    `${item[1]} ${item[2]}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase());
  const filteredTransfers = transfers.filter(matches);
  const filteredPayments = payments.filter(matches);
  const hasResults =
    filteredTransfers.length > 0 || filteredPayments.length > 0;

  return (
    <div className="bank-shell bank-view bank-payments-view">
      <div className="bank-view__heading">
        <span className="bank-eyebrow">PULSE BANK EUROPE</span>
        <h1>
          {locale(language, 'Платежи и переводы', 'Payments and transfers')}
        </h1>
      </div>
      <div className="bank-payments-layout">
        <aside>
          <button
            className="bank-panel bank-invoice-button"
            type="button"
            onClick={() => setFlow('invoice')}
          >
            <BankGlyph name="contract" />
            {locale(language, 'Счета на оплату', 'Bills to pay')}
            <b>2</b>
          </button>
          <section className="bank-panel bank-favorites">
            <h2>{locale(language, 'Избранное', 'Favorites')}</h2>
            <button type="button" onClick={() => setFlow('details')}>
              + {locale(language, 'Добавить', 'Add')}
            </button>
            <div>
              <span>SL</span>
              <p>
                <strong>Sofia Laurent</strong>
                <small>DE89 · SEPA</small>
              </p>
            </div>
          </section>
        </aside>
        <div className="bank-payments-main">
          <label className="bank-search">
            <BankGlyph name="search" />
            <input
              name="payment-search"
              autoComplete="off"
              spellCheck={false}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={locale(
                language,
                'Поиск платежа или получателя',
                'Search payment or recipient'
              )}
            />
          </label>
          <section className="bank-panel bank-phone-transfer">
            <h2>
              {locale(language, 'Перевод контакту', 'Transfer to a contact')}{' '}
              <span>›</span>
            </h2>
            <button type="button" onClick={() => setFlow('details')}>
              <span>+49</span>
              {locale(
                language,
                'Имя, телефон или email',
                'Name, phone or email'
              )}
            </button>
            <div>
              {[
                ['ME', 'Себе'],
                ['SL', 'Sofia'],
                ['NL', 'Noah'],
                ['AM', 'Anna'],
                ['MK', 'Marc'],
                ['EM', 'Emma'],
              ].map(([initials, name]) => (
                <button
                  type="button"
                  key={initials}
                  onClick={() =>
                    setFlow(initials === 'ME' ? 'between' : 'details')
                  }
                >
                  <span>{initials}</span>
                  <small>
                    {initials === 'ME'
                      ? locale(language, 'Себе', 'Myself')
                      : name}
                  </small>
                </button>
              ))}
            </div>
          </section>
          {hasResults ? (
            <>
              {filteredTransfers.length > 0 && (
                <PaymentActions
                  title={locale(language, 'Переводы', 'Transfers')}
                  items={filteredTransfers}
                  language={language}
                  onSelect={setFlow}
                />
              )}
              {filteredPayments.length > 0 && (
                <PaymentActions
                  title={locale(language, 'Платежи', 'Payments')}
                  items={filteredPayments}
                  language={language}
                  onSelect={setFlow}
                />
              )}
            </>
          ) : (
            <section className="bank-panel bank-search-empty">
              <BankGlyph name="search" />
              <strong>
                {locale(language, 'Ничего не найдено', 'Nothing found')}
              </strong>
              <span>
                {locale(
                  language,
                  'Попробуйте изменить запрос',
                  'Try a different search'
                )}
              </span>
            </section>
          )}
          <PaymentActions
            title={locale(language, 'Действия', 'Actions')}
            items={[
              ['request', 'Запросить деньги', 'Request money', 'request'],
            ]}
            language={language}
            onSelect={setFlow}
          />
        </div>
      </div>
    </div>
  );
};

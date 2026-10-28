import React, { useMemo, useState } from 'react';
import { BankGlyph, BankGlyphName } from './BankGlyph';
import { useBankPreferences } from './bankPreferences';

export type MoreFlowKey =
  | 'budget'
  | 'schedule'
  | 'exchange'
  | 'tax'
  | 'devices'
  | 'verify'
  | 'limits'
  | 'emergency'
  | 'support'
  | 'info'
  | 'shield'
  | 'bank';

interface BankMoreFlowProps {
  kind: MoreFlowKey;
  language: 'ru' | 'en';
  onBack: () => void;
}

const locale = (language: 'ru' | 'en', ru: string, en: string) =>
  language === 'ru' ? ru : en;

const titles: Record<MoreFlowKey, [string, string, BankGlyphName]> = {
  budget: ['Бюджеты', 'Budgets', 'budget'],
  schedule: ['Регулярные платежи', 'Scheduled payments', 'schedule'],
  exchange: ['Обмен валют', 'Exchange', 'exchange'],
  tax: ['Налоговые документы', 'Tax documents', 'tax'],
  devices: ['Устройства и сессии', 'Devices and sessions', 'devices'],
  verify: ['Подтверждение входа', 'Login verification', 'verify'],
  limits: ['Лимиты и ограничения', 'Limits and controls', 'limits'],
  emergency: ['Экстренная блокировка', 'Emergency lock', 'emergency'],
  support: ['Чат с поддержкой', 'Support chat', 'support'],
  info: ['Помощь и документы', 'Help and documents', 'info'],
  shield: ['Защита вкладов', 'Deposit protection', 'shield'],
  bank: ['О Pulse Bank Europe', 'About Pulse Bank Europe', 'bank'],
};

const Toggle: React.FC<{
  active: boolean;
  label: string;
  description: string;
  onClick: () => void;
}> = ({ active, label, description, onClick }) => (
  <button
    className="bank-more-toggle"
    type="button"
    onClick={onClick}
    aria-pressed={active}
  >
    <span>
      <strong>{label}</strong>
      <small>{description}</small>
    </span>
    <i className={active ? 'active' : ''}>
      <b />
    </i>
  </button>
);

export const BankMoreFlow: React.FC<BankMoreFlowProps> = ({
  kind,
  language,
  onBack,
}) => {
  const { preferences, update, toggleScheduledPayment, removeDevice } =
    useBankPreferences();
  const [status, setStatus] = useState('');
  const [exchangeAmount, setExchangeAmount] = useState('250');
  const [exchangeTarget, setExchangeTarget] = useState<'GBP' | 'USD' | 'CHF'>(
    'GBP'
  );
  const [supportMessage, setSupportMessage] = useState('');
  const [budgetDraft, setBudgetDraft] = useState(
    String(preferences.monthlyBudget)
  );
  const [dailyLimit, setDailyLimit] = useState(
    String(preferences.dailyTransferLimit)
  );
  const [onlineLimit, setOnlineLimit] = useState(
    String(preferences.onlinePaymentLimit)
  );
  const [, , icon] = titles[kind];
  const title = titles[kind][language === 'ru' ? 0 : 1];
  const currency = (value: number, code = 'EUR') =>
    new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-IE', {
      style: 'currency',
      currency: code,
    }).format(value);
  const rates = { GBP: 0.86, USD: 1.17, CHF: 0.93 };
  const converted = useMemo(() => {
    const amount = Number(exchangeAmount.replace(',', '.')) || 0;
    return amount * rates[exchangeTarget];
  }, [exchangeAmount, exchangeTarget]);

  const saveBudget = (event: React.FormEvent) => {
    event.preventDefault();
    const value = Number(budgetDraft.replace(',', '.'));
    if (!Number.isFinite(value) || value < 100) {
      setStatus(
        locale(
          language,
          'Минимальный бюджет — 100 €.',
          'The minimum budget is €100.'
        )
      );
      return;
    }
    update({ monthlyBudget: value });
    setStatus(
      locale(language, 'Месячный бюджет обновлён.', 'Monthly budget updated.')
    );
  };

  const saveLimits = (event: React.FormEvent) => {
    event.preventDefault();
    const daily = Number(dailyLimit.replace(',', '.'));
    const online = Number(onlineLimit.replace(',', '.'));
    if (daily <= 0 || online <= 0) {
      setStatus(
        locale(language, 'Введите корректные лимиты.', 'Enter valid limits.')
      );
      return;
    }
    update({ dailyTransferLimit: daily, onlinePaymentLimit: online });
    setStatus(locale(language, 'Лимиты сохранены.', 'Limits saved.'));
  };

  const downloadTaxDocument = (year: string) => {
    const content = `Pulse Bank Europe\nAnnual account statement ${year}\nDemo document — not valid for tax filing.`;
    const url = URL.createObjectURL(
      new Blob([content], { type: 'text/plain' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `pulse-tax-statement-${year}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus(locale(language, 'Документ подготовлен.', 'Document prepared.'));
  };

  const content = (() => {
    if (kind === 'budget') {
      const categories = [
        [locale(language, 'Покупки', 'Shopping'), 420, 650],
        [locale(language, 'Рестораны', 'Restaurants'), 162, 260],
        [locale(language, 'Транспорт', 'Transport'), 102, 190],
      ] as const;
      return (
        <>
          <div className="bank-more-metric">
            <span>
              {locale(language, 'Потрачено в этом месяце', 'Spent this month')}
            </span>
            <strong>{currency(684.01)}</strong>
            <small>
              {locale(
                language,
                `из ${currency(preferences.monthlyBudget)}`,
                `of ${currency(preferences.monthlyBudget)}`
              )}
            </small>
          </div>
          <div className="bank-budget-list">
            {categories.map(([name, spent, limit]) => (
              <div key={name}>
                <header>
                  <strong>{name}</strong>
                  <span>
                    {currency(spent)} / {currency(limit)}
                  </span>
                </header>
                <i>
                  <b
                    style={{
                      width: `${Math.min((spent / limit) * 100, 100)}%`,
                    }}
                  />
                </i>
              </div>
            ))}
          </div>
          <form className="bank-more-form" onSubmit={saveBudget}>
            <label>
              {locale(language, 'Месячный бюджет', 'Monthly budget')}
              <div className="bank-amount-input">
                <input
                  value={budgetDraft}
                  inputMode="decimal"
                  onChange={(event) => setBudgetDraft(event.target.value)}
                />
                <span>EUR</span>
              </div>
            </label>
            <button className="bank-primary-button" type="submit">
              {locale(language, 'Сохранить бюджет', 'Save budget')}
            </button>
          </form>
        </>
      );
    }
    if (kind === 'schedule') {
      return (
        <div className="bank-scheduled-list">
          {preferences.scheduledPayments.map((payment) => (
            <Toggle
              key={payment.id}
              active={payment.active}
              onClick={() => toggleScheduledPayment(payment.id)}
              label={payment.name}
              description={`${currency(payment.amount)} · ${locale(language, `${payment.day}-го числа`, `Day ${payment.day}`)}`}
            />
          ))}
        </div>
      );
    }
    if (kind === 'exchange') {
      return (
        <>
          <div className="bank-exchange-grid">
            <label>
              <span>{locale(language, 'Отдаёте', 'You sell')}</span>
              <div>
                <input
                  value={exchangeAmount}
                  inputMode="decimal"
                  onChange={(event) => setExchangeAmount(event.target.value)}
                />
                <b>EUR</b>
              </div>
            </label>
            <span aria-hidden="true">→</span>
            <label>
              <span>{locale(language, 'Получаете', 'You receive')}</span>
              <div>
                <strong>{currency(converted, exchangeTarget)}</strong>
                <select
                  value={exchangeTarget}
                  onChange={(event) =>
                    setExchangeTarget(
                      event.target.value as 'GBP' | 'USD' | 'CHF'
                    )
                  }
                >
                  <option>GBP</option>
                  <option>USD</option>
                  <option>CHF</option>
                </select>
              </div>
            </label>
          </div>
          <p className="bank-more-note">
            1 EUR = {rates[exchangeTarget].toFixed(2)} {exchangeTarget} ·{' '}
            {locale(
              language,
              'Курс зафиксирован на 30 секунд',
              'Rate held for 30 seconds'
            )}
          </p>
          <button
            className="bank-primary-button"
            type="button"
            onClick={() =>
              setStatus(
                locale(
                  language,
                  'Расчёт сохранён. Обмен не списывает демо-средства.',
                  'Quote saved. No demo funds were exchanged.'
                )
              )
            }
          >
            {locale(language, 'Сохранить расчёт', 'Save quote')}
          </button>
        </>
      );
    }
    if (kind === 'tax') {
      return (
        <div className="bank-document-list">
          {['2025', '2024', '2023'].map((year) => (
            <button
              type="button"
              key={year}
              onClick={() => downloadTaxDocument(year)}
            >
              <span>
                <BankGlyph name="tax" />
              </span>
              <div>
                <strong>
                  {locale(
                    language,
                    `Годовая выписка за ${year}`,
                    `${year} annual statement`
                  )}
                </strong>
                <small>
                  PDF/A · {locale(language, 'Английский', 'English')}
                </small>
              </div>
              <b>{locale(language, 'Скачать', 'Download')}</b>
            </button>
          ))}
        </div>
      );
    }
    if (kind === 'devices') {
      return (
        <div className="bank-device-list">
          {preferences.trustedDevices.map((device) => (
            <div key={device.id}>
              <span>
                <BankGlyph name="devices" />
              </span>
              <div>
                <strong>{device.name}</strong>
                <small>
                  {device.location}
                  {device.current
                    ? ` · ${locale(language, 'Текущая сессия', 'Current session')}`
                    : ''}
                </small>
              </div>
              {device.current ? (
                <b>{locale(language, 'Сейчас', 'Now')}</b>
              ) : (
                <button type="button" onClick={() => removeDevice(device.id)}>
                  {locale(language, 'Завершить', 'Revoke')}
                </button>
              )}
            </div>
          ))}
        </div>
      );
    }
    if (kind === 'verify') {
      return (
        <div className="bank-more-toggle-list">
          <Toggle
            active={preferences.loginApproval}
            onClick={() =>
              update({ loginApproval: !preferences.loginApproval })
            }
            label={locale(
              language,
              'Подтверждать новые входы',
              'Approve new sign-ins'
            )}
            description={locale(
              language,
              'Запрос появится на доверенном устройстве',
              'A prompt appears on a trusted device'
            )}
          />
          <Toggle
            active={preferences.biometricApproval}
            onClick={() =>
              update({ biometricApproval: !preferences.biometricApproval })
            }
            label={locale(
              language,
              'Биометрия для операций',
              'Biometric approval'
            )}
            description={locale(
              language,
              'Для переводов и просмотра реквизитов',
              'For transfers and card details'
            )}
          />
        </div>
      );
    }
    if (kind === 'limits') {
      return (
        <form className="bank-more-form" onSubmit={saveLimits}>
          <label>
            {locale(language, 'Переводы в день', 'Daily transfers')}
            <div className="bank-amount-input">
              <input
                value={dailyLimit}
                inputMode="decimal"
                onChange={(event) => setDailyLimit(event.target.value)}
              />
              <span>EUR</span>
            </div>
          </label>
          <label>
            {locale(language, 'Покупки в интернете', 'Online payments')}
            <div className="bank-amount-input">
              <input
                value={onlineLimit}
                inputMode="decimal"
                onChange={(event) => setOnlineLimit(event.target.value)}
              />
              <span>EUR</span>
            </div>
          </label>
          <button className="bank-primary-button" type="submit">
            {locale(language, 'Сохранить лимиты', 'Save limits')}
          </button>
        </form>
      );
    }
    if (kind === 'emergency') {
      return (
        <div
          className={`bank-emergency-panel ${preferences.emergencyLock ? 'active' : ''}`}
        >
          <BankGlyph name="emergency" />
          <strong>
            {preferences.emergencyLock
              ? locale(
                  language,
                  'Все карты заблокированы',
                  'All cards are locked'
                )
              : locale(
                  language,
                  'Экстренная защита выключена',
                  'Emergency protection is off'
                )}
          </strong>
          <p>
            {locale(
              language,
              'Блокировка применяется ко всем картам и онлайн-платежам в этом демо-профиле.',
              'The lock applies to every card and online payment in this demo profile.'
            )}
          </p>
          <button
            type="button"
            onClick={() =>
              update({ emergencyLock: !preferences.emergencyLock })
            }
          >
            {preferences.emergencyLock
              ? locale(language, 'Снять блокировку', 'Unlock cards')
              : locale(language, 'Заблокировать всё', 'Lock everything')}
          </button>
        </div>
      );
    }
    if (kind === 'support') {
      return (
        <form
          className="bank-more-form"
          onSubmit={(event) => {
            event.preventDefault();
            update({ supportRequests: preferences.supportRequests + 1 });
            setSupportMessage('');
            setStatus(
              locale(
                language,
                `Обращение PC-${1048 + preferences.supportRequests} создано.`,
                `Request PC-${1048 + preferences.supportRequests} created.`
              )
            );
          }}
        >
          <label>
            {locale(language, 'Сообщение', 'Message')}
            <textarea
              required
              rows={6}
              value={supportMessage}
              onChange={(event) => setSupportMessage(event.target.value)}
              placeholder={locale(
                language,
                'Коротко опишите ситуацию',
                'Describe the issue briefly'
              )}
            />
          </label>
          <button className="bank-primary-button" type="submit">
            {locale(language, 'Создать обращение', 'Create request')}
          </button>
        </form>
      );
    }
    if (kind === 'info') {
      return (
        <div className="bank-help-list">
          {[
            [
              locale(
                language,
                'Как работает SEPA Instant',
                'How SEPA Instant works'
              ),
              locale(
                language,
                'Переводы в евро обычно приходят за несколько секунд.',
                'Euro transfers usually arrive within seconds.'
              ),
            ],
            [
              locale(language, 'Где найти IBAN', 'Where to find your IBAN'),
              locale(
                language,
                'Откройте EUR-счёт и выберите «Реквизиты счёта».',
                'Open your EUR account and choose Account details.'
              ),
            ],
            [
              locale(
                language,
                'Что делать при потере карты',
                'What to do if a card is lost'
              ),
              locale(
                language,
                'Сразу заморозьте карту в её настройках.',
                'Freeze the card immediately from its settings.'
              ),
            ],
          ].map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      );
    }
    const info =
      kind === 'shield'
        ? [
            locale(language, 'Средства защищены', 'Your funds are protected'),
            locale(
              language,
              'Депозиты в Pulse Bank Europe защищены в пределах европейской системы гарантирования вкладов. Данные на этой странице демонстрационные.',
              'Deposits at Pulse Bank Europe are covered by the European deposit guarantee framework. This page contains demo information.'
            ),
          ]
        : [
            locale(
              language,
              'Европейский цифровой банк',
              'A European digital bank'
            ),
            locale(
              language,
              'Pulse Bank Europe — портфолио-концепт единой финансовой экосистемы для повседневных денег, поездок и сервисов.',
              'Pulse Bank Europe is a portfolio concept for one financial ecosystem spanning everyday money, travel, and services.'
            ),
          ];
    return (
      <div className="bank-more-statement">
        <span>
          <BankGlyph name={kind === 'shield' ? 'shield' : 'bank'} />
        </span>
        <h2>{info[0]}</h2>
        <p>{info[1]}</p>
        <dl>
          <div>
            <dt>{locale(language, 'Регион', 'Region')}</dt>
            <dd>EEA</dd>
          </div>
          <div>
            <dt>{locale(language, 'Основная валюта', 'Base currency')}</dt>
            <dd>EUR</dd>
          </div>
          <div>
            <dt>{locale(language, 'Режим', 'Mode')}</dt>
            <dd>{locale(language, 'Демо', 'Demo')}</dd>
          </div>
        </dl>
      </div>
    );
  })();

  return (
    <div className="bank-shell bank-view bank-more-flow">
      <button className="bank-back-button" type="button" onClick={onBack}>
        ← {locale(language, 'Назад', 'Back')}
      </button>
      <header>
        <span>
          <BankGlyph name={icon} />
        </span>
        <div>
          <small>PULSE CONTROL</small>
          <h1>{title}</h1>
        </div>
      </header>
      <section className="bank-panel bank-more-workspace">
        {content}
        {status && (
          <p className="bank-more-status" role="status">
            {status}
          </p>
        )}
      </section>
    </div>
  );
};

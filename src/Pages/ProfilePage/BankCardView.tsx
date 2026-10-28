import React, { useEffect, useMemo, useRef, useState } from 'react';
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

const ToggleRow: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button className="bank-toggle-row" type="button" onClick={onClick}>
    <span>{label}</span>
    <i className={active ? 'active' : ''}>
      <b />
    </i>
  </button>
);

export const CardView: React.FC<BankViewProps> = ({ language }) => {
  const navigate = useNavigate();
  const { eurBalance } = useBankLedger();
  const { preferences, toggleFrozenCard, updateCardSetting } =
    useBankPreferences();
  const eurBalanceLabel = new Intl.NumberFormat(
    language === 'ru' ? 'ru-RU' : 'en-IE',
    { style: 'currency', currency: 'EUR' }
  ).format(eurBalance);
  const [limitOpen, setLimitOpen] = useState(false);
  const [action, setAction] = useState<'block' | 'reissue' | null>(null);
  const [selectedCard, setSelectedCard] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const settings = preferences.cardSettings;
  const touchStart = useRef<number | null>(null);
  const toggle = (key: keyof typeof settings) =>
    updateCardSetting(key, !settings[key]);
  const linkedAccounts = useMemo(
    () => ({
      eur: { balance: eurBalanceLabel, currency: 'EUR' },
      gbp: {
        balance: new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-GB', {
          style: 'currency',
          currency: 'GBP',
        }).format(920.1),
        currency: 'GBP',
      },
      usd: {
        balance: new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(1245),
        currency: 'USD',
      },
    }),
    [eurBalanceLabel, language]
  );
  const linkedAccount = linkedAccounts[preferences.linkedCardAccount];
  const cards = useMemo(
    () => [
      {
        id: '4821',
        nameRu: 'Pulse Current',
        nameEn: 'Pulse Current',
        kindRu: 'Дебетовая',
        kindEn: 'Debit',
        balance: linkedAccount.balance,
        currency: linkedAccount.currency,
        number: '5355 1200 0048 4821',
        expiry: '09 / 30',
        cvc: '728',
        tone: 'ink',
      },
      {
        id: '5793',
        nameRu: 'Pulse Travel',
        nameEn: 'Pulse Travel',
        kindRu: 'Для путешествий',
        kindEn: 'Travel',
        balance: '920,10 £',
        currency: 'GBP',
        number: '5355 1200 0057 5793',
        expiry: '11 / 29',
        cvc: '314',
        tone: 'blue',
      },
      {
        id: '1088',
        nameRu: 'Pulse Virtual',
        nameEn: 'Pulse Virtual',
        kindRu: 'Виртуальная',
        kindEn: 'Virtual',
        balance: '1 245,00 $',
        currency: 'USD',
        number: '5355 1200 0010 1088',
        expiry: '04 / 31',
        cvc: '506',
        tone: 'silver',
      },
    ],
    [linkedAccount.balance, linkedAccount.currency]
  );
  const card = cards[selectedCard];
  const frozen =
    preferences.emergencyLock || preferences.frozenCardIds.includes(card.id);
  const moveCard = (direction: number) => {
    setSelectedCard(
      (current) => (current + direction + cards.length) % cards.length
    );
    setDetailsVisible(false);
  };
  const freezeCard = () => {
    if (preferences.emergencyLock) {
      navigate('/bank/more?tool=emergency');
      return;
    }
    toggleFrozenCard(card.id);
  };

  useEffect(() => {
    if (
      sliderPaused ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return undefined;
    const timer = window.setInterval(
      () => setSelectedCard((current) => (current + 1) % cards.length),
      6000
    );
    return () => window.clearInterval(timer);
  }, [cards.length, sliderPaused]);

  return (
    <div className="bank-shell bank-view bank-detail-view">
      <button
        className="bank-back-button"
        type="button"
        onClick={() => navigate('/bank/account/eur')}
      >
        ← {locale(language, 'Карты', 'Cards')}
      </button>
      <div className="bank-detail-grid bank-card-detail-grid">
        <aside className="bank-detail-side">
          <section
            className="bank-card-slider"
            aria-label={locale(language, 'Выбор карты', 'Choose a card')}
            onMouseEnter={() => setSliderPaused(true)}
            onMouseLeave={() => setSliderPaused(false)}
            onFocusCapture={() => setSliderPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setSliderPaused(false);
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') moveCard(-1);
              if (event.key === 'ArrowRight') moveCard(1);
            }}
            onTouchStart={(event) => {
              touchStart.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              if (touchStart.current === null) return;
              const distance =
                event.changedTouches[0].clientX - touchStart.current;
              if (Math.abs(distance) > 45) moveCard(distance > 0 ? -1 : 1);
              touchStart.current = null;
            }}
          >
            <div className="bank-card-slider__stage">
              {cards.map((item, index) => {
                const offset =
                  (index - selectedCard + cards.length) % cards.length;
                const position =
                  offset === 0
                    ? 'is-active'
                    : offset === 1
                      ? 'is-next'
                      : 'is-prev';
                const isFrozen =
                  preferences.emergencyLock ||
                  preferences.frozenCardIds.includes(item.id);
                return (
                  <button
                    className={`bank-physical-card bank-physical-card--${item.tone} ${position} ${isFrozen ? 'is-frozen' : ''}`}
                    type="button"
                    key={item.id}
                    tabIndex={position === 'is-active' ? 0 : -1}
                    aria-label={`${language === 'ru' ? item.nameRu : item.nameEn}, ${item.balance}`}
                    aria-pressed={position === 'is-active'}
                    onClick={() => setSelectedCard(index)}
                  >
                    <strong>PULSE</strong>
                    <span
                      className="bank-physical-card__chip"
                      aria-hidden="true"
                    />
                    <em>
                      {isFrozen
                        ? locale(language, 'Заморожена', 'Frozen')
                        : `${language === 'ru' ? item.kindRu : item.kindEn} · ${item.currency}`}
                    </em>
                    <div>
                      <span>•••• {item.id}</span>
                      <b>{item.balance}</b>
                    </div>
                    <span
                      className="bank-physical-card__network"
                      aria-hidden="true"
                    >
                      <i />
                      <i />
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="bank-card-slider__controls">
              <button
                type="button"
                onClick={() => moveCard(-1)}
                aria-label={locale(
                  language,
                  'Предыдущая карта',
                  'Previous card'
                )}
              >
                ←
              </button>
              <div
                role="tablist"
                aria-label={locale(language, 'Карты', 'Cards')}
              >
                {cards.map((item, index) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={selectedCard === index}
                    className={selectedCard === index ? 'active' : ''}
                    key={item.id}
                    onClick={() => setSelectedCard(index)}
                  >
                    <span>{language === 'ru' ? item.nameRu : item.nameEn}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => moveCard(1)}
                aria-label={locale(language, 'Следующая карта', 'Next card')}
              >
                →
              </button>
            </div>
            <div className="bank-card-slider__caption" aria-live="polite">
              <strong>{language === 'ru' ? card.nameRu : card.nameEn}</strong>
              <span>
                {language === 'ru' ? card.kindRu : card.kindEn} ·{' '}
                {card.currency}
              </span>
            </div>
          </section>
          <section className="bank-panel bank-account-actions">
            {(
              [
                ['lock', 'Блокировать', 'Block'],
                ['refresh', 'Перевыпустить', 'Reissue'],
                [
                  'freeze',
                  frozen ? 'Разморозить' : 'Заморозить',
                  frozen ? 'Unfreeze' : 'Freeze',
                ],
              ] as ActionItem[]
            ).map(([icon, ru, en], index) => (
              <button
                type="button"
                key={String(ru)}
                onClick={() =>
                  index === 0
                    ? setAction('block')
                    : index === 1
                      ? setAction('reissue')
                      : freezeCard()
                }
              >
                <span>
                  <BankGlyph name={icon} />
                </span>
                {language === 'ru' ? ru : en}
              </button>
            ))}
          </section>
          <section className="bank-panel bank-card-details">
            <div className="bank-panel__title">
              <h2>{locale(language, 'Реквизиты', 'Details')}</h2>
              <button
                type="button"
                onClick={() => setDetailsVisible((value) => !value)}
              >
                {detailsVisible
                  ? locale(language, 'Скрыть', 'Hide')
                  : locale(language, 'Показать', 'Show')}
              </button>
            </div>
            <div>
              {detailsVisible ? card.number : `•••• •••• •••• ${card.id}`}
            </div>
            <div>
              <span>{detailsVisible ? card.expiry : '•• / ••'}</span>
              <span>{detailsVisible ? card.cvc : '•••'}</span>
            </div>
          </section>
        </aside>
        <div className="bank-detail-main">
          {preferences.emergencyLock && (
            <button
              className="bank-card-security-notice"
              type="button"
              onClick={() => navigate('/bank/more?tool=emergency')}
            >
              <BankGlyph name="emergency" />
              <span>
                <strong>
                  {locale(
                    language,
                    'Включена экстренная блокировка',
                    'Emergency lock is active'
                  )}
                </strong>
                <small>
                  {locale(
                    language,
                    'Все карты и онлайн-платежи приостановлены',
                    'Every card and online payment is paused'
                  )}
                </small>
              </span>
              <b>›</b>
            </button>
          )}
          <section className="bank-panel">
            <div className="bank-panel__title">
              <h2>{locale(language, 'Операции по карте', 'Card activity')}</h2>
              <button
                type="button"
                onClick={() => navigate('/bank/operations')}
              >
                {locale(language, 'Все', 'All')}
              </button>
            </div>
            <MiniActivity language={language} limit={2} />
          </section>
          <section className="bank-detail-two">
            <article className="bank-panel bank-inline-action">
              <div>
                <h2>{locale(language, 'Месячный лимит', 'Monthly limit')}</h2>
                <p>
                  2 500 {card.currency} ·{' '}
                  {locale(
                    language,
                    'доступно для изменения',
                    'available to adjust'
                  )}
                </p>
              </div>
              <button type="button" onClick={() => setLimitOpen(true)}>
                {locale(language, 'Изменить', 'Change')}
              </button>
            </article>
            <article className="bank-panel bank-inline-action">
              <div>
                <h2>
                  {locale(language, 'Привязана к счёту', 'Linked account')}
                </h2>
                <p>
                  {card.balance} · {card.currency} Current
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/bank/card/4821/link-account')}
              >
                {locale(language, 'Изменить', 'Change')}
              </button>
            </article>
          </section>
          <section className="bank-panel bank-settings-list">
            <h2>{locale(language, 'Настройки карты', 'Card settings')}</h2>
            <button type="button" onClick={() => setAction('reissue')}>
              {locale(language, 'Изменить ПИН-код', 'Change PIN')}
              <span>›</span>
            </button>
            <ToggleRow
              label={locale(
                language,
                'Оповещения об операциях',
                'Activity notifications'
              )}
              active={settings.notifications}
              onClick={() => toggle('notifications')}
            />
            <ToggleRow
              label={locale(
                language,
                'Покупки в интернете',
                'Online purchases'
              )}
              active={settings.online}
              onClick={() => toggle('online')}
            />
            <ToggleRow
              label={locale(
                language,
                'Бесконтактная оплата',
                'Contactless payments'
              )}
              active={settings.contactless}
              onClick={() => toggle('contactless')}
            />
            <ToggleRow
              label={locale(language, 'Снятие наличных', 'Cash withdrawals')}
              active={settings.cash}
              onClick={() => toggle('cash')}
            />
            <ToggleRow
              label={locale(
                language,
                'Операции за пределами ЕЭЗ',
                'Payments outside the EEA'
              )}
              active={settings.abroad}
              onClick={() => toggle('abroad')}
            />
          </section>
        </div>
      </div>
      {limitOpen && (
        <DemoModal
          title={locale(language, 'Лимит на траты', 'Spending limit')}
          closeLabel={locale(language, 'Закрыть', 'Close')}
          onClose={() => setLimitOpen(false)}
        >
          <div className="bank-filter-row">
            <button className="active" type="button">
              {locale(language, 'В месяц', 'Monthly')}
            </button>
            <button type="button">
              {locale(language, 'В неделю', 'Weekly')}
            </button>
            <button type="button">
              {locale(language, 'За операцию', 'Per payment')}
            </button>
          </div>
          <label>
            {locale(language, 'Сумма лимита', 'Limit amount')}
            <div className="bank-amount-input">
              <input
                name="spending-limit"
                type="text"
                inputMode="decimal"
                defaultValue="2500"
              />
              <span>{card.currency}</span>
            </div>
          </label>
          <button
            className="bank-primary-button"
            type="button"
            onClick={() => setLimitOpen(false)}
          >
            {locale(language, 'Сохранить', 'Save')}
          </button>
        </DemoModal>
      )}
      {action && (
        <DemoModal
          title={locale(
            language,
            action === 'block' ? 'Заблокировать карту?' : 'Настройки карты',
            action === 'block' ? 'Block this card?' : 'Card service'
          )}
          closeLabel={locale(language, 'Закрыть', 'Close')}
          onClose={() => setAction(null)}
        >
          <div className="bank-confirmation">
            <p>
              {locale(
                language,
                action === 'block'
                  ? 'Карта будет заморожена. Покупки и снятие наличных остановятся до ручной разблокировки.'
                  : 'Выберите причину перевыпуска в демонстрационном сценарии.',
                action === 'block'
                  ? 'The card will be frozen. Purchases and cash withdrawals will stop until you unlock it.'
                  : 'Choose a reason for this demo reissue flow.'
              )}
            </p>
            {action === 'reissue' && (
              <select
                name="reissue-reason"
                aria-label={locale(
                  language,
                  'Причина перевыпуска',
                  'Reissue reason'
                )}
                defaultValue="expired"
              >
                <option value="expired">
                  {locale(language, 'Повреждена', 'Damaged')}
                </option>
                <option value="lost">
                  {locale(language, 'Утеряна', 'Lost')}
                </option>
              </select>
            )}
            <div>
              <button type="button" onClick={() => setAction(null)}>
                {locale(language, 'Отмена', 'Cancel')}
              </button>
              <button
                className="bank-primary-button"
                type="button"
                onClick={() => {
                  if (
                    action === 'block' &&
                    !preferences.frozenCardIds.includes(card.id)
                  ) {
                    toggleFrozenCard(card.id);
                  }
                  setAction(null);
                }}
              >
                {locale(language, 'Подтвердить', 'Confirm')}
              </button>
            </div>
          </div>
        </DemoModal>
      )}
    </div>
  );
};

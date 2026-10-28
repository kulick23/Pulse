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

export const AccountView: React.FC<BankViewProps> = ({ language }) => {
  const navigate = useNavigate();
  const { eurBalance } = useBankLedger();
  const balance = new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(eurBalance);
  const [modal, setModal] = useState<'details' | 'roundup' | 'virtual' | null>(
    null
  );
  return (
    <div className="bank-shell bank-view bank-detail-view">
      <button
        className="bank-back-button"
        type="button"
        onClick={() => navigate('/bank')}
      >
        ← {locale(language, 'Назад', 'Back')}
      </button>
      <section className="bank-account-hero">
        <div>
          <span className="bank-eyebrow">PULSE CURRENT · EUR</span>
          <h1>{balance}</h1>
          <p>{locale(language, 'Основной евро-счёт', 'Main euro account')}</p>
          <div className="bank-mini-cards">
            {['4821', '5793'].map((card) => (
              <button
                type="button"
                key={card}
                onClick={() => navigate(`/bank/card/${card}`)}
              >
                <img src={cardArtwork} alt="" />
                <span>•• {card}</span>
              </button>
            ))}
          </div>
        </div>
        <aside>
          <span>18,42 €</span>
          <strong>
            {locale(language, 'Кэшбэк в сентябре', 'September cashback')}
          </strong>
          <small>
            {locale(language, 'Начислим 1 октября', 'Paid on 1 October')}
          </small>
        </aside>
      </section>
      <div className="bank-detail-grid">
        <aside className="bank-detail-side">
          <section className="bank-panel bank-account-actions">
            {(
              [
                ['pay', 'Оплатить', 'Pay'],
                ['topup', 'Пополнить', 'Top up'],
                ['transfer', 'Перевести', 'Transfer'],
              ] as ActionItem[]
            ).map(([icon, ru, en]) => (
              <button
                type="button"
                key={ru}
                onClick={() => navigate('/bank/payments')}
              >
                <span>
                  <BankGlyph name={icon} />
                </span>
                {language === 'ru' ? ru : en}
              </button>
            ))}
          </section>
          <section className="bank-panel bank-roundup-card">
            <div>
              <h2>
                {locale(language, 'Округление покупок', 'Purchase round-up')}
              </h2>
              <p>
                {locale(
                  language,
                  'Разница отправляется в накопления.',
                  'Spare change goes to your vault.'
                )}
              </p>
            </div>
            <button type="button" onClick={() => setModal('roundup')}>
              {locale(language, 'Настроить', 'Set up')}
            </button>
          </section>
        </aside>
        <div className="bank-detail-main">
          <section className="bank-panel">
            <div className="bank-panel__title">
              <h2>
                {locale(language, 'Операции по счёту', 'Account activity')}
              </h2>
              <button
                type="button"
                onClick={() => navigate('/bank/operations')}
              >
                {locale(language, 'Все', 'All')}
              </button>
            </div>
            <MiniActivity language={language} />
          </section>
          <section className="bank-panel">
            <div className="bank-panel__title">
              <h2>
                {locale(
                  language,
                  'Преимущества Pulse Current',
                  'Pulse Current benefits'
                )}
              </h2>
              <button type="button" onClick={() => navigate('/bank/bonuses')}>
                {locale(language, 'Все', 'All')}
              </button>
            </div>
            <div className="bank-perk-row">
              {['40 €', '5%', '3,4%', '2×'].map((perk) => (
                <button
                  type="button"
                  key={perk}
                  onClick={() => navigate('/bank/bonuses')}
                >
                  <strong>{perk}</strong>
                  <small>
                    {locale(
                      language,
                      'Персональная привилегия',
                      'Personal benefit'
                    )}
                  </small>
                </button>
              ))}
            </div>
          </section>
          <section className="bank-panel bank-inline-action">
            <div>
              <h2>
                {locale(
                  language,
                  'Добавить виртуальную карту',
                  'Add a virtual card'
                )}
              </h2>
              <p>
                {locale(
                  language,
                  'Отдельные реквизиты для безопасных онлайн-покупок.',
                  'Separate details for safer online shopping.'
                )}
              </p>
            </div>
            <button type="button" onClick={() => setModal('virtual')}>
              {locale(language, 'Добавить', 'Add')}
            </button>
          </section>
          <button
            className="bank-panel bank-account-identifiers"
            type="button"
            onClick={() => setModal('details')}
          >
            <div>
              <h2>{locale(language, 'Реквизиты счёта', 'Account details')}</h2>
              <span>IBAN · BIC · SEPA</span>
            </div>
            <b>›</b>
          </button>
          <section className="bank-detail-two">
            <button
              className="bank-panel"
              type="button"
              onClick={() => setModal('details')}
            >
              <h2>QR</h2>
              <span>
                {locale(
                  language,
                  'Поделиться реквизитами',
                  'Share account details'
                )}
              </span>
            </button>
            <button
              className="bank-panel"
              type="button"
              onClick={() => setModal('details')}
            >
              <h2>{locale(language, 'Платёжная ссылка', 'Payment link')}</h2>
              <span>
                {locale(
                  language,
                  'Получать евро онлайн',
                  'Receive euros online'
                )}
              </span>
            </button>
          </section>
          <section className="bank-panel bank-settings-list">
            <h2>{locale(language, 'Детали счёта', 'Account settings')}</h2>
            {[
              ['Лимиты SEPA', 'SEPA limits'],
              ['Тариф Pulse Current', 'Pulse Current plan'],
              ['Выписка по счёту', 'Account statement'],
              ['Налоговый документ', 'Tax document'],
              ['Защита средств', 'Funds protection'],
            ].map(([ru, en]) => (
              <button
                type="button"
                key={ru}
                onClick={() => setModal('details')}
              >
                {language === 'ru' ? ru : en}
                <span>›</span>
              </button>
            ))}
          </section>
        </div>
      </div>
      {modal && (
        <DemoModal
          title={locale(
            language,
            modal === 'details'
              ? 'Реквизиты EUR-счёта'
              : modal === 'roundup'
                ? 'Округление покупок'
                : 'Новая виртуальная карта',
            modal === 'details'
              ? 'EUR account details'
              : modal === 'roundup'
                ? 'Purchase round-up'
                : 'New virtual card'
          )}
          closeLabel={locale(language, 'Закрыть', 'Close')}
          onClose={() => setModal(null)}
        >
          {modal === 'details' ? (
            <div className="bank-account-details-modal">
              <dl>
                <div>
                  <dt>IBAN</dt>
                  <dd>DE89 3704 0044 0532 0130 00</dd>
                </div>
                <div>
                  <dt>BIC / SWIFT</dt>
                  <dd>PULSDEFFXXX</dd>
                </div>
                <div>
                  <dt>{locale(language, 'Получатель', 'Beneficiary')}</dt>
                  <dd>Pulse Demo Customer</dd>
                </div>
                <div>
                  <dt>{locale(language, 'Банк', 'Bank')}</dt>
                  <dd>Pulse Bank Europe S.A.</dd>
                </div>
              </dl>
              <small>
                {locale(
                  language,
                  'Демо-реквизиты, не используйте для переводов.',
                  'Demo details, do not use for transfers.'
                )}
              </small>
              <button
                className="bank-primary-button"
                type="button"
                onClick={() => setModal(null)}
              >
                {locale(language, 'Готово', 'Done')}
              </button>
            </div>
          ) : (
            <div className="bank-flow-form">
              <label>
                {locale(
                  language,
                  modal === 'roundup' ? 'Множитель округления' : 'Валюта карты',
                  modal === 'roundup' ? 'Round-up multiplier' : 'Card currency'
                )}
                <select
                  name={
                    modal === 'roundup' ? 'roundup-multiplier' : 'card-currency'
                  }
                  defaultValue={modal === 'roundup' ? '1' : 'EUR'}
                >
                  {modal === 'roundup' ? (
                    <>
                      <option value="1">1×</option>
                      <option value="2">2×</option>
                      <option value="5">5×</option>
                    </>
                  ) : (
                    <>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="USD">USD</option>
                    </>
                  )}
                </select>
              </label>
              <button
                className="bank-primary-button"
                type="button"
                onClick={() => setModal(null)}
              >
                {locale(
                  language,
                  modal === 'roundup' ? 'Сохранить' : 'Создать карту',
                  modal === 'roundup' ? 'Save' : 'Create card'
                )}
              </button>
            </div>
          )}
        </DemoModal>
      )}
    </div>
  );
};

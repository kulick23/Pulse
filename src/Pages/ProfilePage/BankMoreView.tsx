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

export const LinkAccountView: React.FC<BankViewProps> = ({ language }) => {
  const navigate = useNavigate();
  const { preferences, update } = useBankPreferences();
  const [selected, setSelected] = useState<'eur' | 'gbp' | 'usd'>(
    preferences.linkedCardAccount
  );
  const { eurBalance } = useBankLedger();
  const eurBalanceLabel = new Intl.NumberFormat(
    language === 'ru' ? 'ru-RU' : 'en-IE',
    { style: 'currency', currency: 'EUR' }
  ).format(eurBalance);
  const accounts = [
    ['eur', 'Pulse Current EUR', eurBalanceLabel, '€'],
    ['gbp', 'Pulse Current GBP', '920,10 £', '£'],
    ['usd', 'Pulse Current USD', '1 245,00 $', '$'],
  ];
  return (
    <div className="bank-shell bank-view bank-link-account">
      <button
        className="bank-back-button"
        type="button"
        onClick={() => navigate('/bank/card/4821')}
      >
        ← {locale(language, 'Назад', 'Back')}
      </button>
      <span className="bank-eyebrow">PULSE CARD</span>
      <h1>
        {locale(
          language,
          'К какому счёту привязать карту?',
          'Which account should this card use?'
        )}
      </h1>
      <p>
        {locale(
          language,
          'Платежи будут списываться в выбранной валюте.',
          'Payments will be charged in the selected currency.'
        )}
      </p>
      <div className="bank-panel bank-account-options">
        {accounts.map(([id, title, amount, code]) => (
          <button
            type="button"
            key={id}
            className={selected === id ? 'active' : ''}
            onClick={() => setSelected(id as 'eur' | 'gbp' | 'usd')}
          >
            <span className="bank-account-card__currency bank-account-card__currency--blue">
              {code}
            </span>
            <div>
              <strong>{title}</strong>
              <small>{amount}</small>
            </div>
            <i />
          </button>
        ))}
      </div>
      <div className="bank-link-account__actions">
        <button
          className="bank-primary-button"
          type="button"
          onClick={() => {
            update({ linkedCardAccount: selected });
            navigate('/bank/card/4821');
          }}
        >
          {locale(language, 'Привязать', 'Link account')}
        </button>
        <button type="button" onClick={() => navigate('/bank/card/4821')}>
          {locale(language, 'Отмена', 'Cancel')}
        </button>
      </div>
    </div>
  );
};

const moreFlowKeys: MoreFlowKey[] = [
  'budget',
  'schedule',
  'exchange',
  'tax',
  'devices',
  'verify',
  'limits',
  'emergency',
  'support',
  'info',
  'shield',
  'bank',
];

const readMoreFlow = (search: string) => {
  const value = new URLSearchParams(search).get('tool') as MoreFlowKey | null;
  return value && moreFlowKeys.includes(value) ? value : null;
};

export const MoreView: React.FC<BankViewProps> = ({ language }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState<MoreFlowKey | null>(() =>
    readMoreFlow(location.search)
  );
  useEffect(() => {
    setSelected(readMoreFlow(location.search));
  }, [location.search]);
  const groups = [
    {
      titleRu: 'Управление финансами',
      titleEn: 'Money management',
      items: [
        ['budget', 'Бюджеты', 'Budgets', 'budget'],
        ['schedule', 'Регулярные платежи', 'Scheduled payments', 'schedule'],
        ['exchange', 'Обмен валют', 'Exchange', 'exchange'],
        ['tax', 'Налоговые документы', 'Tax documents', 'tax'],
      ] as Array<[BankGlyphName, string, string, MoreFlowKey]>,
    },
    {
      titleRu: 'Безопасность',
      titleEn: 'Security',
      items: [
        ['devices', 'Устройства и сессии', 'Devices and sessions', 'devices'],
        ['verify', 'Подтверждение входа', 'Login verification', 'verify'],
        ['limits', 'Лимиты и ограничения', 'Limits and controls', 'limits'],
        ['emergency', 'Экстренная блокировка', 'Emergency lock', 'emergency'],
      ] as Array<[BankGlyphName, string, string, MoreFlowKey]>,
    },
    {
      titleRu: 'Поддержка',
      titleEn: 'Support',
      items: [
        ['support', 'Чат с поддержкой', 'Support chat', 'support'],
        ['info', 'Помощь и документы', 'Help and documents', 'info'],
        ['shield', 'Защита вкладов', 'Deposit protection', 'shield'],
        ['bank', 'О Pulse Bank Europe', 'About Pulse Bank Europe', 'bank'],
      ] as Array<[BankGlyphName, string, string, MoreFlowKey]>,
    },
  ];
  if (selected) {
    return (
      <BankMoreFlow
        kind={selected}
        language={language}
        onBack={() => navigate('/bank/more')}
      />
    );
  }
  return (
    <div className="bank-shell bank-view">
      <div className="bank-view__heading">
        <span className="bank-eyebrow">PULSE BANK EUROPE</span>
        <h1>{locale(language, 'Ещё', 'More')}</h1>
        <p>
          {locale(
            language,
            'Настройки, безопасность и документы',
            'Settings, security and documents'
          )}
        </p>
      </div>
      <div className="bank-more-grid">
        {groups.map((group) => (
          <section className="bank-panel" key={group.titleEn}>
            <h2>{language === 'ru' ? group.titleRu : group.titleEn}</h2>
            {group.items.map(([icon, ru, en, flow]) => (
              <button
                type="button"
                key={en}
                onClick={() => navigate(`/bank/more?tool=${flow}`)}
              >
                <span>
                  <BankGlyph name={icon} />
                </span>
                <strong>{language === 'ru' ? ru : en}</strong>
                <b>›</b>
              </button>
            ))}
          </section>
        ))}
      </div>
      <section className="bank-eu-protection">
        <span>EU</span>
        <div>
          <strong>
            {locale(
              language,
              'Европейская защита данных',
              'European data protection'
            )}
          </strong>
          <p>
            {locale(
              language,
              'Интерфейс соответствует принципам GDPR. Это демонстрация, данные не отправляются.',
              'The interface follows GDPR principles. This demo does not transmit data.'
            )}
          </p>
        </div>
      </section>
    </div>
  );
};

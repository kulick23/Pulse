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

type RewardOffer = {
  titleRu: string;
  titleEn: string;
  subtitleRu: string;
  subtitleEn: string;
  rate: string;
  image: string;
  color: string;
  category: string;
};

const rewardOffers: RewardOffer[] = [
  {
    titleRu: 'Европейские кофейни',
    titleEn: 'European coffee shops',
    subtitleRu: 'За одну покупку онлайн или офлайн',
    subtitleEn: 'For one online or in-store purchase',
    rate: '12%',
    image: driveMark,
    color: '#2c4662',
    category: 'food',
  },
  {
    titleRu: 'Транспорт и каршеринг',
    titleEn: 'Transit and car sharing',
    subtitleRu: 'По всей Европе',
    subtitleEn: 'Across Europe',
    rate: '20%',
    image: driveOffer,
    color: '#244d64',
    category: 'transport',
  },
  {
    titleRu: 'Продукты с доставкой',
    titleEn: 'Grocery delivery',
    subtitleRu: 'До 30 сентября',
    subtitleEn: 'Until 30 September',
    rate: '15%',
    image: partnerOne,
    color: '#39415f',
    category: 'shopping',
  },
  {
    titleRu: 'Отели и путешествия',
    titleEn: 'Hotels and travel',
    subtitleRu: 'При бронировании в Pulse Travel',
    subtitleEn: 'When booked in Pulse Travel',
    rate: '7%',
    image: partnerTwo,
    color: '#314d58',
    category: 'travel',
  },
];

const RewardDetail: React.FC<{
  offer: RewardOffer;
  language: 'ru' | 'en';
  onBack: () => void;
}> = ({ offer, language, onBack }) => {
  const [active, setActive] = useState(false);
  return (
    <div className="bank-shell bank-view bank-reward-detail">
      <button className="bank-back-button" type="button" onClick={onBack}>
        ← {locale(language, 'Все предложения', 'All offers')}
      </button>
      <section
        className="bank-reward-detail__hero"
        style={{ backgroundColor: offer.color }}
      >
        <div>
          <span className="bank-eyebrow">PULSE BENEFITS</span>
          <strong>{offer.rate}</strong>
          <h1>{language === 'ru' ? offer.titleRu : offer.titleEn}</h1>
          <p>{language === 'ru' ? offer.subtitleRu : offer.subtitleEn}</p>
        </div>
        <img src={offer.image} alt="" />
      </section>
      <div className="bank-reward-detail__grid">
        <section className="bank-panel">
          <h2>
            {locale(language, 'Как получить кэшбэк', 'How to get cashback')}
          </h2>
          <ol>
            <li>
              {locale(
                language,
                'Активируйте предложение',
                'Activate this offer'
              )}
            </li>
            <li>
              {locale(
                language,
                'Оплатите покупку картой Pulse',
                'Pay with your Pulse card'
              )}
            </li>
            <li>
              {locale(
                language,
                'Кэшбэк появится после обработки операции',
                'Cashback appears after the payment is processed'
              )}
            </li>
          </ol>
        </section>
        <aside className="bank-panel">
          <span>{locale(language, 'Доступно до', 'Available until')}</span>
          <strong>30.09.2026</strong>
          <small>
            {locale(language, 'Лимит кэшбэка: 60 €', 'Cashback cap: €60')}
          </small>
          <button
            className="bank-primary-button"
            type="button"
            onClick={() => setActive(true)}
          >
            {active
              ? locale(language, 'Активировано', 'Activated')
              : locale(language, 'Активировать', 'Activate')}
          </button>
        </aside>
      </div>
    </div>
  );
};

export const RewardsView: React.FC<BankViewProps> = ({ language }) => {
  const [selected, setSelected] = useState<RewardOffer | null>(null);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [selected]);
  if (selected)
    return (
      <RewardDetail
        offer={selected}
        language={language}
        onBack={() => setSelected(null)}
      />
    );
  const categories: Array<[string, BankGlyphName, string, string]> = [
    ['all', 'card', 'Все', 'All'],
    ['food', 'games', 'Еда', 'Food'],
    ['transport', 'between', 'Транспорт', 'Transport'],
    ['travel', 'swift', 'Путешествия', 'Travel'],
    ['shopping', 'utilities', 'Покупки', 'Shopping'],
  ];
  const visibleOffers = rewardOffers.filter((offer) => {
    const matchesCategory = category === 'all' || offer.category === category;
    const matchesQuery =
      `${offer.titleRu} ${offer.titleEn} ${offer.subtitleRu} ${offer.subtitleEn}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase());
    return matchesCategory && matchesQuery;
  });
  return (
    <div className="bank-shell bank-view bank-rewards-view">
      <div className="bank-view__heading">
        <span className="bank-eyebrow">PULSE BENEFITS</span>
        <h1>
          {locale(language, 'Кэшбэк и привилегии', 'Cashback and benefits')}
        </h1>
        <p>
          {locale(
            language,
            'Предложения действуют в странах ЕЭЗ',
            'Offers available across the EEA'
          )}
        </p>
      </div>
      <div className="bank-rewards-layout">
        <aside className="bank-pro-banner">
          <img src={benefitsPro} alt="" />
          <span>PULSE METAL</span>
          <strong>
            {locale(
              language,
              'Больше кэшбэка и бонусов',
              'More cashback and benefits'
            )}
          </strong>
          <button type="button" onClick={() => setSelected(rewardOffers[3])}>
            {locale(language, 'Подробнее', 'Learn more')}
          </button>
        </aside>
        <div className="bank-rewards-main">
          <label className="bank-search">
            <BankGlyph name="search" />
            <input
              name="rewards-search"
              autoComplete="off"
              spellCheck={false}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={locale(
                language,
                'Поиск предложений',
                'Search offers'
              )}
            />
          </label>
          <section className="bank-panel bank-reward-benefits">
            <h2>
              {locale(language, 'Получайте больше выгоды', 'Get more value')}
            </h2>
            <div>
              {rewardOffers.map((offer, index) => (
                <button
                  type="button"
                  key={offer.titleEn}
                  onClick={() => setSelected(offer)}
                  className={`tone-${index}`}
                >
                  <img src={offer.image} alt="" />
                  <span>{offer.rate}</span>
                  <strong>
                    {language === 'ru' ? offer.titleRu : offer.titleEn}
                  </strong>
                  <small>
                    {language === 'ru' ? offer.subtitleRu : offer.subtitleEn}
                  </small>
                </button>
              ))}
            </div>
          </section>
          <section className="bank-panel bank-reward-categories">
            <div className="bank-panel__title">
              <h2>
                {locale(language, 'Кэшбэк у партнёров', 'Partner cashback')}
              </h2>
              <button type="button" onClick={() => setCategory('all')}>
                {locale(language, 'Сбросить', 'Reset')}
              </button>
            </div>
            <div>
              {categories.map(([id, icon, ru, en]) => (
                <button
                  className={category === id ? 'active' : ''}
                  type="button"
                  key={id}
                  onClick={() => setCategory(id)}
                >
                  <BankGlyph name={icon} />
                  <span>{language === 'ru' ? ru : en}</span>
                </button>
              ))}
            </div>
          </section>
          <section className="bank-panel bank-partner-offers">
            <div className="bank-panel__title">
              <h2>
                {locale(language, 'Популярные предложения', 'Popular offers')}
              </h2>
              <span>{visibleOffers.length}</span>
            </div>
            {visibleOffers.length ? (
              <div>
                {visibleOffers.map((offer, index) => (
                  <button
                    type="button"
                    key={`${offer.titleEn}-${index}`}
                    onClick={() => setSelected(offer)}
                  >
                    <div style={{ backgroundColor: offer.color }}>
                      <img src={offer.image} alt="" />
                      <b>{offer.rate}</b>
                    </div>
                    <strong>
                      {language === 'ru' ? offer.titleRu : offer.titleEn}
                    </strong>
                    <small>
                      {language === 'ru' ? offer.subtitleRu : offer.subtitleEn}
                    </small>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bank-search-empty">
                <BankGlyph name="search" />
                <strong>
                  {locale(
                    language,
                    'Предложений не найдено',
                    'No offers found'
                  )}
                </strong>
                <span>
                  {locale(
                    language,
                    'Измените запрос или категорию',
                    'Change the search or category'
                  )}
                </span>
              </div>
            )}
          </section>
          <section className="bank-panel bank-invite">
            <div>
              <h2>
                {locale(language, 'Приглашайте друзей', 'Invite friends')}
              </h2>
              <p>
                {locale(
                  language,
                  'Получите 40 €, когда друг впервые оплатит покупку картой Pulse.',
                  'Get €40 when a friend first pays with a Pulse card.'
                )}
              </p>
            </div>
            <button type="button" onClick={() => setSelected(rewardOffers[0])}>
              {locale(language, 'Пригласить', 'Invite')}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProfilePage.scss';
import './BankWorkspace.scss';
import { BankHome } from './BankHome';
import {
  AccountView,
  CardView,
  LinkAccountView,
  MoreView,
  OperationsView,
  PaymentsView,
  RewardsView,
} from './BankViews';
import { TravelPage } from '../TravelPage';
import { ShopPage } from '../ShopPage';
import {
  BusinessPage,
  InsurancePage,
  InvestingPage,
  MobilePage,
} from '../ServicePages';
import { BankGlyph, BankGlyphName } from './BankGlyph';
import { useAccessibleDialog } from '../../Hooks/useAccessibleDialog';

const copy = {
  ru: {
    services: [
      'Личный банк',
      'Бизнес',
      'Инвестиции',
      'Связь',
      'Страхование',
      'Путешествия',
      'Магазин',
    ],
    home: 'Главная',
    operations: 'Операции',
    payments: 'Платежи',
    cashback: 'Бонусы',
    more: 'Ещё',
    allProducts: 'Все продукты',
    search: 'Поиск по банку',
    greeting: 'Добрый день',
    demo: 'Демо-режим',
    rub: 'Основной счёт',
    byn: 'Счёт в фунтах',
    usd: 'Счёт в долларах',
    eur: 'Счёт во франках',
    savings: 'Накопительный счёт',
    savingsHint: 'До 3,4% годовых',
    addProduct: 'Открыть счёт или продукт',
    quick: 'Быстрые действия',
    byPhone: 'SEPA-перевод',
    byDetails: 'Перевести по IBAN',
    mobile: 'Оплатить мобильный',
    qr: 'Сканировать счёт',
    bonuses: 'Кэшбэк и привилегии',
    allOffers: 'Все предложения',
    bonusOne: '5% в супермаркетах',
    bonusTwo: '10% на транспорт',
    history: 'Операции в сентябре',
    expenses: 'Траты',
    income: 'Пополнения',
    empty: 'Последние операции',
    emptyHint: 'Все суммы показаны в демо-режиме.',
    preparing: 'Этот банковский раздел уже в работе',
    preparingHint:
      'Сейчас доступен главный экран. Реальные операции и данные подключим позже.',
    notification: 'Этот сервис появится на следующем этапе',
    back: 'Вернуться на сайт',
    help: 'Помощь',
    security: 'Безопасность',
  },
  en: {
    services: [
      'Personal',
      'Business',
      'Investing',
      'Mobile',
      'Insurance',
      'Travel',
      'Shop',
    ],
    home: 'Home',
    operations: 'Activity',
    payments: 'Payments',
    cashback: 'Rewards',
    more: 'More',
    allProducts: 'All products',
    search: 'Search the bank',
    greeting: 'Good afternoon',
    demo: 'Demo mode',
    rub: 'Main account',
    byn: 'British pound account',
    usd: 'US dollar account',
    eur: 'Swiss franc account',
    savings: 'Savings vault',
    savingsHint: 'Up to 3.4% annually',
    addProduct: 'Open an account or product',
    quick: 'Quick actions',
    byPhone: 'SEPA transfer',
    byDetails: 'Transfer by IBAN',
    mobile: 'Pay for mobile',
    qr: 'Scan an invoice',
    bonuses: 'Cashback and benefits',
    allOffers: 'All offers',
    bonusOne: '5% on groceries',
    bonusTwo: '10% on transport',
    history: 'September activity',
    expenses: 'Spending',
    income: 'Income',
    empty: 'Latest activity',
    emptyHint: 'All amounts are demo data.',
    preparing: 'This banking section is in progress',
    preparingHint:
      'The main dashboard is ready. Real transactions and data will be connected later.',
    notification: 'This service is coming in the next stage',
    back: 'Back to site',
    help: 'Help',
    security: 'Security',
  },
};

export const ProfilePage: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const language = i18n.language.startsWith('ru') ? 'ru' : 'en';
  const text = copy[language];
  const [notice, setNotice] = useState('');
  const [allProductsOpen, setAllProductsOpen] = useState(false);
  const [productQuery, setProductQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const productsDialogRef = useAccessibleDialog<HTMLElement>(() => {
    setAllProductsOpen(false);
    setProductQuery('');
  }, allProductsOpen);
  const profileDialogRef = useAccessibleDialog<HTMLElement>(
    () => setProfileOpen(false),
    profileOpen
  );
  const supportDialogRef = useAccessibleDialog<HTMLElement>(
    () => setSupportOpen(false),
    supportOpen
  );
  const isTravel = location.pathname.startsWith('/travel');
  const isShop = location.pathname.startsWith('/shop');
  const serviceKind = location.pathname.startsWith('/business')
    ? 'business'
    : location.pathname.startsWith('/investing')
      ? 'investing'
      : location.pathname.startsWith('/mobile')
        ? 'mobile'
        : location.pathname.startsWith('/insurance')
          ? 'insurance'
          : null;
  const isCoreService = serviceKind !== null;

  const currentView = serviceKind
    ? serviceKind
    : isTravel
      ? 'travel'
      : isShop
        ? 'shop'
        : location.pathname.includes('/link-account')
          ? 'link-account'
          : location.pathname.includes('/card/')
            ? 'card'
            : location.pathname.includes('/account/')
              ? 'account'
              : location.pathname.includes('/operations')
                ? 'operations'
                : location.pathname.includes('/payments')
                  ? 'payments'
                  : location.pathname.includes('/bonuses')
                    ? 'cashback'
                    : location.pathname.includes('/more')
                      ? 'more'
                      : 'home';
  const activeSection = ['account', 'card', 'link-account'].includes(
    currentView
  )
    ? 'home'
    : currentView;

  const bankNav = useMemo(
    () => [
      { id: 'home' as const, label: text.home },
      { id: 'operations' as const, label: text.operations },
      { id: 'payments' as const, label: text.payments },
      { id: 'cashback' as const, label: text.cashback },
      { id: 'more' as const, label: text.more },
    ],
    [text]
  );

  const products: Array<{
    icon: BankGlyphName;
    title: string;
    subtitle: string;
    route: string;
  }> =
    language === 'ru'
      ? [
          {
            icon: 'bank',
            title: 'Текущие счета',
            subtitle: 'EUR · GBP · USD · CHF',
            route: '/bank',
          },
          {
            icon: 'swift',
            title: 'SEPA и международные',
            subtitle: 'Мгновенные переводы по Европе',
            route: '/bank/payments',
          },
          {
            icon: 'schedule',
            title: 'Операции',
            subtitle: 'Единая история по всем счетам',
            route: '/bank/operations',
          },
          {
            icon: 'transfer',
            title: 'Платежи и переводы',
            subtitle: 'SEPA, SWIFT и регулярные платежи',
            route: '/bank/payments',
          },
          {
            icon: 'card',
            title: 'Карты',
            subtitle: 'Физические и виртуальные карты',
            route: '/bank/card/4821',
          },
          {
            icon: 'budget',
            title: 'Накопления',
            subtitle: 'Гибкие сейфы до 3,4%',
            route: '/bank/account/eur',
          },
          {
            icon: 'budget',
            title: 'Бюджеты',
            subtitle: 'Лимиты и контроль расходов',
            route: '/bank/more?tool=budget',
          },
          {
            icon: 'exchange',
            title: 'Обмен валют',
            subtitle: 'EUR, GBP, USD и CHF',
            route: '/bank/more?tool=exchange',
          },
          {
            icon: 'bookmark',
            title: 'Кэшбэк и привилегии',
            subtitle: 'Предложения Pulse Benefits',
            route: '/bank/bonuses',
          },
          {
            icon: 'details',
            title: 'Инвестиции',
            subtitle: 'ETF и европейские рынки',
            route: '/investing',
          },
          {
            icon: 'shield',
            title: 'Страхование',
            subtitle: 'Защита путешествий и покупок',
            route: '/insurance',
          },
          {
            icon: 'contract',
            title: 'Бизнес',
            subtitle: 'Счета, инвойсы и корпоративные карты',
            route: '/business',
          },
          {
            icon: 'mobile',
            title: 'Мобильная связь',
            subtitle: 'Тариф, eSIM и роуминг',
            route: '/mobile',
          },
          {
            icon: 'swift',
            title: 'Путешествия',
            subtitle: 'Направления и план поездки',
            route: '/travel',
          },
          {
            icon: 'games',
            title: 'Магазин',
            subtitle: 'Товары, избранное и заказы',
            route: '/shop',
          },
        ]
      : [
          {
            icon: 'bank',
            title: 'Current accounts',
            subtitle: 'EUR · GBP · USD · CHF',
            route: '/bank',
          },
          {
            icon: 'swift',
            title: 'SEPA & international',
            subtitle: 'Instant transfers in Europe',
            route: '/bank/payments',
          },
          {
            icon: 'schedule',
            title: 'Activity',
            subtitle: 'One timeline across every account',
            route: '/bank/operations',
          },
          {
            icon: 'transfer',
            title: 'Payments and transfers',
            subtitle: 'SEPA, SWIFT and scheduled payments',
            route: '/bank/payments',
          },
          {
            icon: 'card',
            title: 'Cards',
            subtitle: 'Physical and virtual cards',
            route: '/bank/card/4821',
          },
          {
            icon: 'budget',
            title: 'Savings',
            subtitle: 'Flexible vaults up to 3.4%',
            route: '/bank/account/eur',
          },
          {
            icon: 'budget',
            title: 'Budgets',
            subtitle: 'Spending limits and controls',
            route: '/bank/more?tool=budget',
          },
          {
            icon: 'exchange',
            title: 'Exchange',
            subtitle: 'EUR, GBP, USD and CHF',
            route: '/bank/more?tool=exchange',
          },
          {
            icon: 'bookmark',
            title: 'Cashback and benefits',
            subtitle: 'Pulse Benefits offers',
            route: '/bank/bonuses',
          },
          {
            icon: 'details',
            title: 'Investments',
            subtitle: 'ETFs and European markets',
            route: '/investing',
          },
          {
            icon: 'shield',
            title: 'Insurance',
            subtitle: 'Travel and purchase cover',
            route: '/insurance',
          },
          {
            icon: 'contract',
            title: 'Business',
            subtitle: 'Accounts, invoices and company cards',
            route: '/business',
          },
          {
            icon: 'mobile',
            title: 'Mobile',
            subtitle: 'Plan, eSIM and roaming',
            route: '/mobile',
          },
          {
            icon: 'swift',
            title: 'Travel',
            subtitle: 'Destinations and trip planning',
            route: '/travel',
          },
          {
            icon: 'games',
            title: 'Shop',
            subtitle: 'Products, saved items and orders',
            route: '/shop',
          },
        ];

  const filteredProducts = (() => {
    const query = productQuery.trim().toLocaleLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      `${product.title} ${product.subtitle}`.toLocaleLowerCase().includes(query)
    );
  })();

  const showNotice = (message?: string) => {
    setNotice(message ?? text.notification);
    window.setTimeout(() => setNotice(''), 2400);
  };

  const openSection = (section: string) => {
    navigate(
      section === 'home'
        ? '/bank'
        : `/bank/${section === 'cashback' ? 'bonuses' : section}`
    );
  };

  return (
    <main
      className={`bank-app bank-app--modern ${currentView === 'home' ? 'bank-app--home' : ''} ${isTravel ? 'travel-app' : ''} ${isShop ? 'shop-app' : ''} ${isCoreService ? 'service-app' : ''}`}
    >
      <a className="bank-skip-link" href="#bank-content">
        {language === 'ru' ? 'К основному содержанию' : 'Skip to main content'}
      </a>
      <header className="bank-global-nav">
        <div className="bank-shell bank-global-nav__inner">
          <Link className="bank-brand" to="/" aria-label="Pulse">
            PULSE
          </Link>
          <nav className="bank-services" aria-label="Pulse services">
            {text.services.map((service, index) => (
              <button
                type="button"
                key={service}
                className={
                  (index === 0 && !isTravel && !isShop && !isCoreService) ||
                  (index === 1 && serviceKind === 'business') ||
                  (index === 2 && serviceKind === 'investing') ||
                  (index === 3 && serviceKind === 'mobile') ||
                  (index === 4 && serviceKind === 'insurance') ||
                  (index === 5 && isTravel) ||
                  (index === 6 && isShop)
                    ? 'active'
                    : ''
                }
                onClick={
                  index === 0
                    ? () => navigate('/bank')
                    : index === 1
                      ? () => navigate('/business')
                      : index === 2
                        ? () => navigate('/investing')
                        : index === 3
                          ? () => navigate('/mobile')
                          : index === 4
                            ? () => navigate('/insurance')
                            : index === 5
                              ? () => navigate('/travel')
                              : () => navigate('/shop')
                }
              >
                {service}
              </button>
            ))}
          </nav>
          <div className="bank-user">
            <span className="bank-demo-badge">{text.demo}</span>
            <button
              type="button"
              className="bank-global-search-button"
              onClick={() => setAllProductsOpen(true)}
              aria-label={text.search}
              title={text.search}
            >
              <BankGlyph name="search" />
            </button>
            <div className="bank-language" aria-label="Language">
              <button
                type="button"
                className={language === 'ru' ? 'active' : ''}
                onClick={() => i18n.changeLanguage('ru')}
              >
                RU
              </button>
              <button
                type="button"
                className={language === 'en' ? 'active' : ''}
                onClick={() => i18n.changeLanguage('en')}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              className="bank-profile-button"
              onClick={() => setProfileOpen(true)}
              aria-label="Profile"
            >
              D
            </button>
          </div>
        </div>
      </header>

      <div className="bank-product-nav">
        <div className="bank-shell bank-product-nav__inner">
          {isCoreService ? (
            <nav aria-label="Service navigation">
              <button
                type="button"
                className="active"
                onClick={() =>
                  document
                    .getElementById('service-overview')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                {language === 'ru' ? 'Обзор' : 'Overview'}
              </button>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById('service-workspace')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                {serviceKind === 'business'
                  ? language === 'ru'
                    ? 'Финансы'
                    : 'Finance'
                  : serviceKind === 'investing'
                    ? language === 'ru'
                      ? 'Портфель'
                      : 'Portfolio'
                    : serviceKind === 'mobile'
                      ? language === 'ru'
                        ? 'Тариф'
                        : 'Plan'
                      : language === 'ru'
                        ? 'Полисы'
                        : 'Policies'}
              </button>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById('service-tools')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                {language === 'ru' ? 'Инструменты' : 'Tools'}
              </button>
            </nav>
          ) : isTravel ? (
            <nav aria-label="Travel navigation">
              <button
                type="button"
                className="active"
                onClick={() => navigate('/travel')}
              >
                {language === 'ru' ? 'Обзор' : 'Discover'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (location.pathname !== '/travel') navigate('/travel');
                  window.setTimeout(
                    () =>
                      document
                        .getElementById('travel-destinations')
                        ?.scrollIntoView({ behavior: 'smooth' }),
                    50
                  );
                }}
              >
                {language === 'ru' ? 'Направления' : 'Destinations'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (location.pathname !== '/travel') navigate('/travel');
                  window.setTimeout(
                    () =>
                      document
                        .getElementById('travel-planner')
                        ?.scrollIntoView({ behavior: 'smooth' }),
                    50
                  );
                }}
              >
                {language === 'ru' ? 'План поездки' : 'Trip planner'}
              </button>
            </nav>
          ) : isShop ? (
            <nav aria-label="Shop navigation">
              <button
                type="button"
                className="active"
                onClick={() => navigate('/shop')}
              >
                {language === 'ru' ? 'Витрина' : 'Featured'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (location.pathname !== '/shop') navigate('/shop');
                  window.setTimeout(
                    () =>
                      document
                        .getElementById('shop-catalog')
                        ?.scrollIntoView({ behavior: 'smooth' }),
                    50
                  );
                }}
              >
                {language === 'ru' ? 'Каталог' : 'Catalog'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/shop?view=orders')}
              >
                {language === 'ru' ? 'Заказы' : 'Orders'}
              </button>
            </nav>
          ) : (
            <nav aria-label="Bank navigation">
              {bankNav.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={activeSection === item.id ? 'active' : ''}
                  onClick={() => openSection(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
          <button
            type="button"
            className="bank-all-products"
            onClick={() =>
              isCoreService
                ? setSupportOpen(true)
                : isTravel
                  ? navigate('/travel?view=trips')
                  : isShop
                    ? navigate('/shop?view=saved')
                    : setAllProductsOpen(true)
            }
          >
            {isCoreService
              ? language === 'ru'
                ? 'Поддержка'
                : 'Support'
              : isTravel
                ? language === 'ru'
                  ? 'Мои поездки'
                  : 'My trips'
                : isShop
                  ? language === 'ru'
                    ? 'Избранное'
                    : 'Saved'
                  : text.allProducts}
            <span aria-hidden="true">{isCoreService ? '?' : '▦'}</span>
          </button>
        </div>
      </div>

      <div id="bank-content" tabIndex={-1}>
        {serviceKind === 'business' ? (
          <BusinessPage language={language} onNotice={showNotice} />
        ) : serviceKind === 'investing' ? (
          <InvestingPage language={language} onNotice={showNotice} />
        ) : serviceKind === 'mobile' ? (
          <MobilePage language={language} onNotice={showNotice} />
        ) : serviceKind === 'insurance' ? (
          <InsurancePage language={language} onNotice={showNotice} />
        ) : isTravel ? (
          <TravelPage language={language} onNotice={showNotice} />
        ) : isShop ? (
          <ShopPage language={language} onNotice={showNotice} />
        ) : currentView === 'home' ? (
          <BankHome language={language} onNotice={showNotice} />
        ) : currentView === 'operations' ? (
          <OperationsView language={language} onNotice={showNotice} />
        ) : currentView === 'payments' ? (
          <PaymentsView language={language} onNotice={showNotice} />
        ) : currentView === 'cashback' ? (
          <RewardsView language={language} onNotice={showNotice} />
        ) : currentView === 'account' ? (
          <AccountView language={language} onNotice={showNotice} />
        ) : currentView === 'card' ? (
          <CardView language={language} onNotice={showNotice} />
        ) : currentView === 'link-account' ? (
          <LinkAccountView language={language} onNotice={showNotice} />
        ) : currentView === 'more' ? (
          <MoreView language={language} onNotice={showNotice} />
        ) : (
          <div className="bank-shell bank-placeholder">
            <span className="bank-placeholder__icon">
              {activeSection === 'cashback' ? '%' : '↗'}
            </span>
            <span className="bank-eyebrow">PULSE BANK</span>
            <h1>{bankNav.find((item) => item.id === activeSection)?.label}</h1>
            <p>{text.preparing}</p>
            <small>{text.preparingHint}</small>
            <button type="button" onClick={() => navigate('/bank')}>
              {text.home}
            </button>
          </div>
        )}
      </div>

      <footer className="bank-footer">
        <div className="bank-shell bank-footer__inner">
          <Link className="bank-brand" to="/">
            PULSE
          </Link>
          <div>
            <button type="button" onClick={() => navigate('/bank/more')}>
              {text.security}
            </button>
            <button type="button" onClick={() => setSupportOpen(true)}>
              {text.help}
            </button>
            <Link to="/">{text.back}</Link>
          </div>
        </div>
      </footer>
      {notice && (
        <div className="bank-toast" role="status">
          {notice}
        </div>
      )}
      {allProductsOpen && (
        <div
          className="bank-modal-overlay"
          onMouseDown={() => {
            setAllProductsOpen(false);
            setProductQuery('');
          }}
        >
          <aside
            ref={productsDialogRef}
            className="bank-products-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={text.allProducts}
            tabIndex={-1}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="bank-modal-close"
              type="button"
              aria-label={language === 'ru' ? 'Закрыть' : 'Close'}
              onClick={() => {
                setAllProductsOpen(false);
                setProductQuery('');
              }}
            >
              ×
            </button>
            <span className="bank-eyebrow">PULSE EUROPE</span>
            <h2>{text.allProducts}</h2>
            <label className="bank-products-search">
              <BankGlyph name="search" />
              <input
                data-dialog-initial-focus
                type="search"
                name="product-search"
                autoComplete="off"
                spellCheck={false}
                value={productQuery}
                onChange={(event) => setProductQuery(event.target.value)}
                placeholder={text.search}
              />
            </label>
            <div className="bank-products-list" aria-live="polite">
              {filteredProducts.map((product) => (
                <button
                  type="button"
                  key={product.title}
                  onClick={() => {
                    setAllProductsOpen(false);
                    setProductQuery('');
                    navigate(product.route);
                  }}
                >
                  <span>
                    <BankGlyph name={product.icon} />
                  </span>
                  <div>
                    <strong>{product.title}</strong>
                    <small>{product.subtitle}</small>
                  </div>
                  <b>›</b>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <div className="bank-products-empty">
                  <BankGlyph name="search" />
                  <strong>
                    {language === 'ru'
                      ? 'Ничего не найдено'
                      : 'No products found'}
                  </strong>
                  <small>
                    {language === 'ru'
                      ? 'Попробуйте другой запрос'
                      : 'Try a different search'}
                  </small>
                </div>
              )}
            </div>
            <small className="bank-products-drawer__legal">
              {language === 'ru'
                ? 'Pulse Bank Europe · Демо-интерфейс · Все суммы показаны только для демонстрации'
                : 'Pulse Bank Europe · Demo banking interface · Deposits shown for demonstration only'}
            </small>
          </aside>
        </div>
      )}
      {profileOpen && (
        <div
          className="bank-modal-overlay"
          onMouseDown={() => setProfileOpen(false)}
        >
          <aside
            ref={profileDialogRef}
            className="bank-products-drawer bank-profile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={language === 'ru' ? 'Профиль' : 'Profile'}
            tabIndex={-1}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="bank-modal-close"
              type="button"
              aria-label={language === 'ru' ? 'Закрыть' : 'Close'}
              onClick={() => setProfileOpen(false)}
            >
              ×
            </button>
            <div className="bank-profile-summary">
              <span>D</span>
              <div>
                <small>Pulse ID</small>
                <h2>Danila</h2>
                <p>danila@pulse.eu</p>
              </div>
            </div>
            <div className="bank-profile-actions">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/bank/more');
                }}
              >
                <span>
                  <BankGlyph name="verify" />
                </span>
                <div>
                  <strong>
                    {language === 'ru'
                      ? 'Профиль и документы'
                      : 'Profile and documents'}
                  </strong>
                  <small>Pulse ID · GDPR</small>
                </div>
                <b>›</b>
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/bank/card/4821');
                }}
              >
                <span>
                  <BankGlyph name="card" />
                </span>
                <div>
                  <strong>
                    {language === 'ru'
                      ? 'Карты и безопасность'
                      : 'Cards and security'}
                  </strong>
                  <small>
                    {language === 'ru'
                      ? 'Лимиты и устройства'
                      : 'Limits and devices'}
                  </small>
                </div>
                <b>›</b>
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  setSupportOpen(true);
                }}
              >
                <span>
                  <BankGlyph name="support" />
                </span>
                <div>
                  <strong>{language === 'ru' ? 'Поддержка' : 'Support'}</strong>
                  <small>
                    {language === 'ru' ? 'Ответим в чате' : 'Chat with us'}
                  </small>
                </div>
                <b>›</b>
              </button>
            </div>
            <button
              className="bank-profile-exit"
              type="button"
              onClick={() => navigate('/')}
            >
              {language === 'ru'
                ? 'Выйти из демо-профиля'
                : 'Exit demo profile'}
            </button>
          </aside>
        </div>
      )}
      {supportOpen && (
        <div
          className="bank-modal-overlay"
          onMouseDown={() => setSupportOpen(false)}
        >
          <aside
            ref={supportDialogRef}
            className="bank-products-drawer bank-support-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={language === 'ru' ? 'Поддержка' : 'Support'}
            tabIndex={-1}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="bank-modal-close"
              type="button"
              aria-label={language === 'ru' ? 'Закрыть' : 'Close'}
              onClick={() => setSupportOpen(false)}
            >
              ×
            </button>
            <span className="bank-eyebrow">PULSE CARE</span>
            <h2>{language === 'ru' ? 'Чем помочь?' : 'How can we help?'}</h2>
            <p>
              {language === 'ru'
                ? 'Опишите вопрос. Обращение сохранится в этом демо-сеансе.'
                : 'Tell us what happened. The request will be saved in this demo session.'}
            </p>
            <form
              className="bank-support-form"
              onSubmit={(event) => {
                event.preventDefault();
                setSupportOpen(false);
                showNotice(
                  language === 'ru'
                    ? 'Обращение PC-1048 создано'
                    : 'Request PC-1048 created'
                );
              }}
            >
              <label>
                {language === 'ru' ? 'Тема' : 'Topic'}
                <select name="topic" defaultValue="payment">
                  <option value="payment">
                    {language === 'ru'
                      ? 'Платёж или перевод'
                      : 'Payment or transfer'}
                  </option>
                  <option value="card">
                    {language === 'ru' ? 'Карта' : 'Card'}
                  </option>
                  <option value="travel">
                    {language === 'ru' ? 'Путешествие' : 'Travel'}
                  </option>
                  <option value="other">
                    {language === 'ru' ? 'Другое' : 'Other'}
                  </option>
                </select>
              </label>
              <label>
                {language === 'ru' ? 'Сообщение' : 'Message'}
                <textarea
                  required
                  name="message"
                  rows={5}
                  placeholder={
                    language === 'ru'
                      ? 'Коротко опишите ситуацию'
                      : 'Describe the issue briefly'
                  }
                />
              </label>
              <button type="submit">
                {language === 'ru' ? 'Создать обращение' : 'Create request'}
              </button>
            </form>
            <div className="bank-support-emergency">
              <BankGlyph name="emergency" />
              <div>
                <strong>
                  {language === 'ru' ? 'Карта потеряна?' : 'Lost your card?'}
                </strong>
                <small>
                  {language === 'ru'
                    ? 'Мгновенно заморозьте её в разделе карт'
                    : 'Freeze it instantly in Cards'}
                </small>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSupportOpen(false);
                  navigate('/bank/card/4821');
                }}
              >
                {language === 'ru' ? 'Открыть' : 'Open'}
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
};

export default ProfilePage;

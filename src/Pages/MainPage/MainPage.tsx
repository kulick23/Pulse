import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../Components/Header/Header';
import travelImage from '../../Assets/Travel/indonesia-hero.webp';
import shopImage from '../../Assets/Shop/hero.webp';
import './MainPage.scss';

const transactionRows = [
  { initials: 'ÖB', name: 'ÖBB Tickets', metaRu: 'Транспорт · Вена', metaEn: 'Transport · Vienna', amount: '−48,90 €' },
  { initials: 'PS', name: 'Pulse Shop', metaRu: 'Техника и стиль', metaEn: 'Technology & style', amount: '−329,00 €' },
  { initials: 'SI', name: 'SEPA Incoming', metaRu: 'Зарплата', metaEn: 'Salary', amount: '+2 850,00 €', income: true },
];

export const MainPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isRu = i18n.language.startsWith('ru');

  return (
    <main className="public-home">
      <Header />

      <section className="public-intro public-section">
        <div className="public-section__heading">
          <p className="public-eyebrow">{isRu ? 'ОДИН PULSE' : 'ONE PULSE'}</p>
          <h2>{isRu ? 'Один баланс. Все ваши планы.' : 'One balance. Every plan.'}</h2>
          <p>
            {isRu
              ? 'Покупка билета, новый тариф или инвестиция не живут отдельно: каждое действие видно в общей истории и сразу учитывается в бюджете.'
              : 'A train ticket, a mobile plan or an investment never lives in isolation: every action appears in one timeline and updates your budget instantly.'}
          </p>
        </div>

        <div className="public-bank-preview" aria-label={isRu ? 'Превью личного банка' : 'Personal banking preview'}>
          <aside className="public-bank-preview__accounts">
            <span>{isRu ? 'Общий баланс' : 'Total balance'}</span>
            <strong>4 225,82 €</strong>
            <button type="button" tabIndex={-1}>EUR <small>{isRu ? 'Основной' : 'Main account'}</small></button>
            <button type="button" tabIndex={-1}>GBP <small>1 180,00 £</small></button>
            <button type="button" tabIndex={-1}>USD <small>640,00 $</small></button>
          </aside>
          <div className="public-bank-preview__main">
            <header>
              <div>
                <span>{isRu ? 'Октябрь' : 'October'}</span>
                <strong>{isRu ? 'Доступно для трат' : 'Available to spend'}</strong>
              </div>
              <Link to="/bank/operations">{isRu ? 'Все операции' : 'All activity'} <span aria-hidden="true">→</span></Link>
            </header>
            <div className="public-bank-preview__metrics">
              <div><span>{isRu ? 'Расходы' : 'Spending'}</span><strong>1 278,81 €</strong></div>
              <div><span>{isRu ? 'Кэшбэк' : 'Cashback'}</span><strong>18,42 €</strong></div>
            </div>
            <div className="public-bank-preview__transactions">
              {transactionRows.map((row) => (
                <div key={row.name}>
                  <span className="public-bank-preview__initials">{row.initials}</span>
                  <p><strong>{row.name}</strong><small>{isRu ? row.metaRu : row.metaEn}</small></p>
                  <strong className={row.income ? 'is-income' : ''}>{row.amount}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="public-ecosystem public-section">
        <div className="public-section__heading public-section__heading--wide">
          <p className="public-eyebrow">PULSE ECOSYSTEM</p>
          <h2>{isRu ? 'Банк продолжается за пределами карты' : 'Banking beyond the card'}</h2>
        </div>

        <article className="public-feature public-feature--travel">
          <img src={travelImage} alt={isRu ? 'Вулкан Бромо в Индонезии' : 'Mount Bromo in Indonesia'} width="1600" height="1067" loading="lazy" />
          <div>
            <p className="public-eyebrow">PULSE TRAVEL</p>
            <h3>{isRu ? 'Планируйте поездку там, где платите' : 'Plan where you pay'}</h3>
            <p>{isRu ? 'Маршрут, бюджет, сохранённые места и страховка работают рядом со счётом.' : 'Itinerary, budget, saved places and cover stay next to your account.'}</p>
            <Link to="/travel">{isRu ? 'Открыть Travel' : 'Open Travel'} <span aria-hidden="true">→</span></Link>
          </div>
        </article>

        <div className="public-feature-pair">
          <article className="public-feature public-feature--compact public-feature--shop">
            <img src={shopImage} alt={isRu ? 'Продукты Pulse Shop' : 'Pulse Shop products'} width="1600" height="900" loading="lazy" />
            <div>
              <p className="public-eyebrow">PULSE SHOP</p>
              <h3>{isRu ? 'Выбранные вещи. Честная цена.' : 'Selected goods. Clear pricing.'}</h3>
              <Link to="/shop">{isRu ? 'В магазин' : 'Shop now'} <span aria-hidden="true">→</span></Link>
            </div>
          </article>
          <article className="public-feature public-feature--compact public-feature--signal">
            <div>
              <p className="public-eyebrow">PULSE MOBILE</p>
              <h3>{isRu ? 'Связь дома и в поездке' : 'Connected at home and away'}</h3>
              <p>{isRu ? 'eSIM, понятный тариф и роуминг без неожиданностей.' : 'eSIM, a clear plan and roaming without surprises.'}</p>
              <div className="public-signal" aria-hidden="true"><i /><i /><i /><i /></div>
              <Link to="/mobile">{isRu ? 'Настроить связь' : 'Set up mobile'} <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        </div>
      </section>

      <section className="public-security public-section">
        <div>
          <p className="public-eyebrow">PULSE CONTROL</p>
          <h2>{isRu ? 'Спокойствие встроено в продукт' : 'Peace of mind, built in'}</h2>
        </div>
        <ul>
          <li><span>01</span><strong>{isRu ? 'Заморозка карты одним нажатием' : 'Freeze a card in one tap'}</strong></li>
          <li><span>02</span><strong>{isRu ? 'Лимиты и уведомления в реальном времени' : 'Real-time limits and notifications'}</strong></li>
          <li><span>03</span><strong>{isRu ? 'Страхование рядом с покупками и поездками' : 'Cover next to purchases and trips'}</strong></li>
        </ul>
      </section>

      <section className="public-cta public-section">
        <p className="public-eyebrow">{isRu ? 'ВАШ PULSE' : 'YOUR PULSE'}</p>
        <h2>{isRu ? 'Начните с личного банка' : 'Start with personal banking'}</h2>
        <p>{isRu ? 'Демо-аккаунт уже готов: данные хранятся только в вашем браузере.' : 'Your demo account is ready. Its data stays in this browser.'}</p>
        <Link className="public-button public-button--primary" to="/bank">{isRu ? 'Перейти в приложение' : 'Enter the app'} <span aria-hidden="true">↗</span></Link>
      </section>
    </main>
  );
};

export default MainPage;

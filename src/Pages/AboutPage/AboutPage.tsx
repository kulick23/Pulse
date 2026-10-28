import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import aboutImage from '../../Assets/Public/pulse-lisbon-payment.webp';
import '../../Styles/PublicPages.scss';

export const AboutPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isRu = i18n.language.startsWith('ru');
  const values = isRu
    ? [
        ['01', 'Понятность', 'Условия, комиссии и результат действия видны до подтверждения.'],
        ['02', 'Связность', 'Банк, поездки, покупки и связь используют единый финансовый контекст.'],
        ['03', 'Контроль', 'Пользователь управляет картами, лимитами и безопасностью самостоятельно.'],
      ]
    : [
        ['01', 'Clarity', 'Terms, fees and outcomes are visible before confirmation.'],
        ['02', 'Continuity', 'Banking, trips, shopping and mobile share one financial context.'],
        ['03', 'Control', 'People manage cards, limits and security without support tickets.'],
      ];

  return (
    <main className="public-page">
      <header className="public-page__media-hero">
        <img src={aboutImage} alt={isRu ? 'Повседневный платёж в Лиссабоне' : 'An everyday payment in Lisbon'} width="1920" height="1080" />
        <div>
          <p className="public-eyebrow">ABOUT PULSE</p>
          <h1>{isRu ? 'Банк для жизни между странами и сервисами' : 'Banking for life across borders and services'}</h1>
          <p>{isRu ? 'Pulse — самостоятельный продуктовый концепт европейского супераппа. Мы проектируем его вокруг решений человека, а не банковских разделов.' : 'Pulse is an independent product concept for a European super app, designed around people’s decisions rather than banking departments.'}</p>
        </div>
      </header>

      <section className="public-copy-grid">
        {values.map(([number, title, description]) => (
          <article key={number}><span>{number}</span><h2>{title}</h2><p>{description}</p></article>
        ))}
      </section>

      <section className="public-page__band public-page__band--light">
        <p className="public-eyebrow">PRODUCT VISION</p>
        <h2>{isRu ? 'Один интерфейс вместо набора разрозненных кабинетов' : 'One interface instead of disconnected portals'}</h2>
        <p>{isRu ? 'История операций связывает все сервисы. Пользователь видит, как поездка, покупка, связь или инвестиция влияют на общий бюджет, и может продолжить сценарий с того же места.' : 'One activity timeline connects every service. People see how a trip, purchase, mobile plan or investment affects their budget and continue the flow from the same place.'}</p>
      </section>

      <section className="public-page__band">
        <p className="public-eyebrow">BUILD WITH US</p>
        <h2>{isRu ? 'Продукт растёт вместе с командой' : 'The product grows with the team'}</h2>
        <p>{isRu ? 'Ищем людей, которым интересны финтех, сложные сценарии и спокойный интерфейс без лишнего шума.' : 'We are looking for people drawn to fintech, complex flows and calm interfaces without unnecessary noise.'}</p>
        <Link className="public-button public-button--primary" to="/job">{isRu ? 'Посмотреть вакансии' : 'View open roles'} <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
};

export default AboutPage;

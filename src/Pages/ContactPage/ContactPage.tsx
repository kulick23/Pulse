import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../Styles/PublicPages.scss';

export const ContactPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isRu = i18n.language.startsWith('ru');
  const contacts = isRu
    ? [
        ['Поддержка', 'Вопросы по приложению и операциям', 'support@pulsebank.dev'],
        ['Партнёрства', 'Travel, Shop и сервисы экосистемы', 'partners@pulsebank.dev'],
        ['Пресса', 'Комментарии и материалы о продукте', 'media@pulsebank.dev'],
        ['Карьера', 'Вакансии и команда Pulse', 'careers@pulsebank.dev'],
      ]
    : [
        ['Support', 'Questions about the app and activity', 'support@pulsebank.dev'],
        ['Partnerships', 'Travel, Shop and ecosystem services', 'partners@pulsebank.dev'],
        ['Press', 'Product comments and media resources', 'media@pulsebank.dev'],
        ['Careers', 'Open roles and the Pulse team', 'careers@pulsebank.dev'],
      ];

  return (
    <main className="public-page">
      <header className="public-page__hero">
        <p className="public-eyebrow">CONTACT PULSE</p>
        <h1>{isRu ? 'Начнём с правильной команды' : 'Start with the right team'}</h1>
        <p>{isRu ? 'Выберите тему — письмо сразу попадёт людям, которые отвечают за этот продуктовый сценарий.' : 'Choose a topic and your email goes directly to the people responsible for that product area.'}</p>
      </header>

      <section className="public-contact-list">
        {contacts.map(([title, description, email]) => (
          <div className="public-contact-row" key={email}>
            <span>{title}</span><strong>{description}</strong><a href={`mailto:${email}`}>{email} ↗</a>
          </div>
        ))}
      </section>

      <section className="public-page__band public-page__band--light">
        <p className="public-eyebrow">SELF-SERVICE</p>
        <h2>{isRu ? 'Основные вопросы решаются прямо в приложении' : 'Most questions are solved inside the app'}</h2>
        <p>{isRu ? 'Заморозка карты, лимиты, eSIM, страховые обращения и история заказов доступны без ожидания ответа поддержки.' : 'Card freeze, limits, eSIM, insurance claims and order history are available without waiting for support.'}</p>
        <Link className="public-button public-button--primary" to="/bank">{isRu ? 'Перейти в Pulse' : 'Open Pulse'} <span aria-hidden="true">↗</span></Link>
      </section>
    </main>
  );
};

export default ContactPage;

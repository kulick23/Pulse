import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import servicesStore from '../../Store/ServicesStore/ServicesStore';
import '../../Styles/PublicPages.scss';

export const ServicesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('ru') ? 'ru' : 'en';
  const services = servicesStore.getServicesByLanguage(lang);

  return (
    <main className="public-page">
      <header className="public-page__hero">
        <p className="public-eyebrow">PULSE ECOSYSTEM</p>
        <h1>{lang === 'ru' ? 'Один вход в повседневные финансы' : 'One place for everyday finance'}</h1>
        <p>{lang === 'ru' ? 'Сервисы Pulse используют один профиль, единый баланс и общую историю. Вы переходите между задачами, а не между разными продуктами.' : 'Pulse services share one profile, one balance and one timeline. Move between real tasks, not disconnected products.'}</p>
      </header>

      <section className="public-service-grid" aria-label={lang === 'ru' ? 'Сервисы Pulse' : 'Pulse services'}>
        {services.map((service) => (
          <article className="public-service-card" key={service.id}>
            <img src={service.image} alt="" width="1200" height="800" loading={service.id === 1 ? 'eager' : 'lazy'} />
            <div>
              <span>{service.type}</span>
              <h2>{service.title}</h2>
              <p>{service.desc}</p>
              <Link to={`/services/${service.id}`}>{lang === 'ru' ? 'Подробнее' : 'Explore'} <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        ))}
      </section>

      <section className="public-page__band">
        <p className="public-eyebrow">PULSE BANK EUROPE</p>
        <h2>{lang === 'ru' ? 'Счёт остаётся в центре' : 'Your account stays at the centre'}</h2>
        <p>{lang === 'ru' ? 'Покупки, мобильные пакеты, страховые полисы и инвестиции сразу отражаются в банковском балансе. Это уже работает в демо-приложении.' : 'Purchases, mobile add-ons, insurance policies and investments update your bank balance instantly. It already works in the demo app.'}</p>
        <Link className="public-button public-button--primary" to="/bank">{lang === 'ru' ? 'Открыть личный банк' : 'Open personal banking'} <span aria-hidden="true">↗</span></Link>
      </section>
    </main>
  );
};

export default ServicesPage;

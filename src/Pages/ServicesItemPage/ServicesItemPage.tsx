import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import servicesStore from '../../Store/ServicesStore/ServicesStore';
import '../../Styles/PublicPages.scss';

const appRoutes: Record<number, string> = {
  1: '/bank',
  2: '/bank/payments',
  3: '/travel',
  4: '/travel',
  5: '/shop',
  6: '/business',
  7: '/investing',
};

export const ServicesItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('ru') ? 'ru' : 'en';
  const serviceId = Number(id);
  const service = servicesStore.getServiceById(serviceId, lang);

  if (!service) {
    return <main className="public-page"><header className="public-page__hero"><h1>{lang === 'ru' ? 'Сервис не найден' : 'Service not found'}</h1><Link to="/services">← {lang === 'ru' ? 'К экосистеме' : 'Back to ecosystem'}</Link></header></main>;
  }

  const points = [
    [service.titlePunkt1, service.subtitlePunkt1],
    [service.titlePunkt2, service.subtitlePunkt2],
    [service.titlePunkt3, service.subtitlePunkt3],
  ];

  return (
    <main className="public-page">
      <header className="public-page__media-hero">
        <img src={service.image} alt="" width="1600" height="1000" />
        <div>
          <p className="public-eyebrow">{service.type}</p>
          <h1>{service.title}</h1>
          <p>{service.desc}</p>
          <Link className="public-button public-button--primary" to={appRoutes[serviceId]}>{lang === 'ru' ? 'Попробовать в Pulse' : 'Try it in Pulse'} <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <section className="public-copy-grid">
        {points.map(([title, description], index) => (
          <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{description}</p></article>
        ))}
      </section>

      <section className="public-page__band">
        <p className="public-eyebrow">ONE PULSE</p>
        <h2>{lang === 'ru' ? 'Работает с общим счётом и историей' : 'Connected to one account and timeline'}</h2>
        <p>{lang === 'ru' ? 'Действия внутри сервиса отражаются в личном банке: баланс, категория, дата и источник операции всегда доступны в одном месте.' : 'Service activity appears in personal banking with balance impact, category, date and source available in one place.'}</p>
        <Link className="public-button public-button--primary" to={appRoutes[serviceId]}>{lang === 'ru' ? 'Открыть сервис' : 'Open service'} <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
};

export default ServicesItemPage;

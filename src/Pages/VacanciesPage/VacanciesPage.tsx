import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import jobStore from '../../Store/JobStore/JobStore';
import '../../Styles/PublicPages.scss';

const roleNames: Record<number, { ru: string; en: string }> = {
  1: { ru: 'ML-инженер', en: 'ML Engineer' },
  2: { ru: 'Технический лидер', en: 'Engineering Lead' },
  6: { ru: 'Platform-инженер', en: 'Platform Engineer' },
  9: { ru: 'Fullstack-разработчик', en: 'Fullstack Engineer' },
};

export const VacanciesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('ru') ? 'ru' : 'en';
  const roleId = Number(id);
  const job = jobStore.vacanciec.find((item) => item.id === roleId);

  if (!job) {
    return <main className="public-page"><article className="public-article"><h1>{lang === 'ru' ? 'Вакансия не найдена' : 'Role not found'}</h1><Link to="/job">← {lang === 'ru' ? 'Все вакансии' : 'All roles'}</Link></article></main>;
  }

  const title = roleNames[roleId]?.[lang] ?? job.title[lang];

  return (
    <main className="public-page">
      <article className="public-article vacancy-detail">
        <Link to="/job">← {lang === 'ru' ? 'Все вакансии' : 'All roles'}</Link>
        <p className="public-eyebrow">PULSE CAREERS</p>
        <h1>{title}</h1>
        <div className="public-article__meta"><span>{lang === 'ru' ? 'Берлин / удалённо' : 'Berlin / remote'}</span><span>{lang === 'ru' ? 'Полная занятость' : 'Full-time'}</span><span>{lang === 'ru' ? 'Европейская команда' : 'European team'}</span></div>
        <p className="public-article__lead">{lang === 'ru' ? 'Вы будете развивать европейскую финтех-экосистему Pulse вместе с продуктовой, дизайнерской и risk-командами, отвечая за результат от идеи до эксплуатации.' : 'You will develop the European Pulse fintech ecosystem with product, design and risk teams, owning outcomes from first idea to production.'}</p>

        <section className="vacancy-detail__columns">
          <div><h2>{lang === 'ru' ? 'Задачи' : 'What you will do'}</h2><ul>{job.responsibilities[lang].slice(0, 7).map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h2>{lang === 'ru' ? 'Что важно' : 'What matters'}</h2><ul>{job.requirements[lang].slice(0, 6).map((item) => <li key={item}>{item}</li>)}</ul></div>
        </section>

        <section className="vacancy-detail__apply">
          <h2>{lang === 'ru' ? 'Познакомимся?' : 'Let’s meet'}</h2>
          <p>{lang === 'ru' ? 'Пришлите короткий рассказ о себе и ссылку на профиль или портфолио.' : 'Send us a short introduction and a link to your profile or portfolio.'}</p>
          <a className="public-button public-button--primary" href={`mailto:careers@pulsebank.dev?subject=${encodeURIComponent(title)}`}>{lang === 'ru' ? 'Откликнуться' : 'Apply'} <span aria-hidden="true">↗</span></a>
        </section>
      </article>
    </main>
  );
};

export default VacanciesPage;

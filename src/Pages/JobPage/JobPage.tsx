import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../Styles/PublicPages.scss';

const roles = [
  { id: 2, ru: 'Технический лидер', en: 'Engineering Lead', areaRu: 'Banking platform', areaEn: 'Banking platform' },
  { id: 9, ru: 'Fullstack-разработчик', en: 'Fullstack Engineer', areaRu: 'Web application', areaEn: 'Web application' },
  { id: 6, ru: 'DevOps-инженер', en: 'Platform Engineer', areaRu: 'Infrastructure', areaEn: 'Infrastructure' },
  { id: 1, ru: 'ML-инженер', en: 'ML Engineer', areaRu: 'Risk & personalisation', areaEn: 'Risk & personalisation' },
];

export const JobPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isRu = i18n.language.startsWith('ru');

  return (
    <main className="public-page">
      <header className="public-page__hero">
        <p className="public-eyebrow">CAREERS AT PULSE</p>
        <h1>{isRu ? 'Создавайте банк, которым хочется пользоваться' : 'Build a bank people want to use'}</h1>
        <p>{isRu ? 'Небольшие кросс-функциональные команды отвечают за сценарий целиком: от идеи и риска до интерфейса и эксплуатации.' : 'Small cross-functional teams own complete journeys, from product idea and risk to interface and operations.'}</p>
      </header>

      <section className="public-job-list" aria-label={isRu ? 'Открытые вакансии' : 'Open positions'}>
        {roles.map((role) => (
          <Link className="public-job-row" to={`/vacancies/${role.id}`} key={role.id}>
            <h2>{isRu ? role.ru : role.en}</h2>
            <p>{isRu ? role.areaRu : role.areaEn}</p>
            <span>{isRu ? 'Берлин / удалённо' : 'Berlin / remote'}</span>
            <i aria-hidden="true">→</i>
          </Link>
        ))}
      </section>

      <section className="public-page__band">
        <p className="public-eyebrow">WORKING AT PULSE</p>
        <h2>{isRu ? 'Ответственность без лишней иерархии' : 'Ownership without unnecessary hierarchy'}</h2>
        <p>{isRu ? 'Гибридный формат в Европе, прозрачные цели, бюджет на развитие и возможность влиять на продуктовые решения с первого дня.' : 'A Europe-first hybrid setup, transparent goals, a learning budget and influence on product decisions from day one.'}</p>
        <a className="public-button public-button--primary" href="mailto:careers@pulsebank.dev">{isRu ? 'Написать команде' : 'Contact the team'} <span aria-hidden="true">↗</span></a>
      </section>
    </main>
  );
};

export default JobPage;

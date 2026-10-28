import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../Styles/PublicPages.scss';

const NotFoundPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isRu = i18n.language.startsWith('ru');

  return (
    <main className="public-page">
      <header className="public-page__hero">
        <p className="public-eyebrow">404 · PULSE</p>
        <h1>{isRu ? 'Такой страницы нет' : 'This page does not exist'}</h1>
        <p>{isRu ? 'Адрес мог измениться. Вернитесь на главную или откройте личный банк.' : 'The address may have changed. Return home or open personal banking.'}</p>
        <div className="public-hero__actions">
          <Link className="public-button public-button--primary" to="/">{isRu ? 'На главную' : 'Go home'}</Link>
          <Link className="public-button" to="/bank">{isRu ? 'Открыть банк' : 'Open banking'}</Link>
        </div>
      </header>
    </main>
  );
};

export default NotFoundPage;

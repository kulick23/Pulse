import React from 'react';
import { useTranslation } from 'react-i18next';
import { policyContentsEng } from './policyContentsEn';
import { policyContentsRus } from './policyContentsRus';
import './PolicyPage.scss';
import '../../Styles/PublicPages.scss';

export const PrivacyPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  const content = language.startsWith('ru')
    ? policyContentsRus[1]
    : policyContentsEng[1];

  const isRu = language.startsWith('ru');

  return (
    <main className="public-page PrivacyPage">
      <header className="PrivacyPage__hero">
        <div className="PrivacyPage__hero-inner">
          <p className="public-eyebrow">PULSE · LEGAL</p>
          <h1>{t('policy.title')}</h1>
          <p>
            {isRu
              ? 'Как Pulse обрабатывает данные в рамках этого демонстрационного продукта.'
              : 'How Pulse handles data within this demonstration product.'}
          </p>
          <div className="PrivacyPage__hero-meta">
            <time dateTime="2026-10-23">{t('policy.update')}</time>
            <a href="#privacy-content">{isRu ? 'Перейти к документу' : 'Read the document'} ↓</a>
          </div>
        </div>
      </header>
      <section className="PrivacyPage__layout">
        <aside>
          <span>{isRu ? 'Режим данных' : 'Data mode'}</span>
          <strong>{isRu ? 'Локальное хранение' : 'Local browser storage'}</strong>
          <p>
            {isRu
              ? 'Локальные демо-данные не отправляются на сервер.'
              : 'Local demo data is not sent to a server.'}
          </p>
        </aside>
        <article
          id="privacy-content"
          className="PrivacyPage__content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>
    </main>
  );
};

export default PrivacyPage;

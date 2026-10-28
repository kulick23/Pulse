import React from 'react';
import { useTranslation } from 'react-i18next';
import './TeamAbout.scss';

export const TeamAbout = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('ru') ? 'ru' : 'en';
  return (
    <section className={`TeamAbout TeamAbout--${lang}`}>
      <p dangerouslySetInnerHTML={{ __html: t('TeamAbout.text') }} />
    </section>
  );
};

export default TeamAbout;

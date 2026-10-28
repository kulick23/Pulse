import React from 'react';
import { useTranslation } from 'react-i18next';
import './Quote.scss';
import quoteImage from '../../Assets/Public/pulse-lisbon-payment.webp';

export const Quote = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('ru') ? 'ru' : 'en';

  return (
    <section className={`Quote Quote--${lang}`}>
      <div className="Quote__block">
        <img
          src={quoteImage}
          alt=""
          width="1920"
          height="1080"
          className="Quote__image"
          aria-hidden="true"
        />
        <div className="Quote__quote">
          <h4>{t('team.text2')}</h4>
          <p>{t('team.author')}</p>
        </div>
      </div>
    </section>
  );
};

export default Quote;

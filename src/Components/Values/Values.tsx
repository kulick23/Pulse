import React from 'react';
import { useTranslation } from 'react-i18next';
import './Values.scss';

interface ValuesProps {
  variant?: 'about' | 'case' | 'contact';
}

const valuesData = {
  about: [
    { key: 'courage', textKey: 'courage-text' },
    { key: 'perseverance', textKey: 'perseverance-text' },
    { key: 'reliability', textKey: 'reliability-text' },
    { key: 'responsibility', textKey: 'responsibility-text' },
  ],
  case: [
    { key: 'bravery', textKey: 'bravery-text' },
    { key: 'responsibility', textKey: 'responsibility-text' },
    { key: 'persistence', textKey: 'persistence-text' },
    { key: 'reliability', textKey: 'reliability-text' },
  ],
  contact: [
    { key: 'carears', textKey: 'carears-text' },
    { key: 'sales', textKey: 'sales-text' },
    { key: 'marketing', textKey: 'marketing-text' },
    { key: 'general', textKey: 'general-text' },
  ],
};

export const Values: React.FC<ValuesProps> = ({ variant = 'about' }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('ru') ? 'ru' : 'en';

  return (
    <section className="Values">
      {variant === 'about' && (
        <div className={`AboutValues AboutValues--${lang}`}>
          <span>{lang === 'ru' ? 'НАШИ ЦЕННОСТИ' : 'VALUES'}</span>
          <div className="AboutValues__block">
            {valuesData.about.map(({ key, textKey }) => (
              <div key={key} className="AboutValues__container">
                <h3>{t(`Values.${key}`)}</h3>
                <p>{t(`Values.${textKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === 'case' && (
        <div className="CaseValues__list">
          {valuesData.case.map(({ key, textKey }) => (
            <div key={key} className="CaseValues__list--container">
              <h3>{t(`Values.${key}`)}</h3>
              <p dangerouslySetInnerHTML={{ __html: t(`Values.${textKey}`) }} />
            </div>
          ))}
        </div>
      )}

      {variant === 'contact' && (
        <div className="ContactValues">
          <span>{lang === 'ru' ? 'КОНТАКТЫ' : 'CONTACT'}</span>
          <div className="CaseValues__list ContactValues__list">
            {valuesData.contact.map(({ key, textKey }) => (
              <div key={key} className="CaseValues__list--container">
                <h3>{t(`Values.${key}`)}</h3>
                <p
                  dangerouslySetInnerHTML={{ __html: t(`Values.${textKey}`) }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Values;

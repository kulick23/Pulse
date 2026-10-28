import React, { ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authImage from '../../Assets/Public/pulse-lisbon-payment.webp';
import './AuthShell.scss';

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  eyebrow,
  title,
  description,
  children,
  footer,
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language.startsWith('ru') ? 'ru' : 'en';
  const isRu = currentLanguage === 'ru';

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <main className="auth-shell">
      <Link className="auth-shell__brand" to="/" aria-label={isRu ? 'Главная Pulse' : 'Pulse home'}>
        PULSE<span aria-hidden="true">•</span>
      </Link>
      <section className="auth-shell__visual" aria-hidden="true">
        <img src={authImage} alt="" width="1920" height="1080" />
        <div>
          <span>Pulse Bank Europe</span>
          <strong>{isRu ? 'Повседневные финансы по всей Европе.' : 'Everyday money, across Europe.'}</strong>
        </div>
      </section>
      <section className="auth-shell__content">
        <div className="auth-shell__utility">
          <Link to="/">← {isRu ? 'На главную' : 'Back to Pulse'}</Link>
          <div className="auth-shell__languages" aria-label={isRu ? 'Выбор языка' : 'Language'}>
            <button type="button" className={isRu ? 'active' : ''} aria-pressed={isRu} onClick={() => i18n.changeLanguage('ru')}>RU</button>
            <button type="button" className={!isRu ? 'active' : ''} aria-pressed={!isRu} onClick={() => i18n.changeLanguage('en')}>EN</button>
          </div>
        </div>
        <div className="auth-shell__intro">
          <span>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {children}
        {footer && <footer>{footer}</footer>}
      </section>
    </main>
  );
};

export default AuthShell;

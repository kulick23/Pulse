import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heroImage from '../../Assets/Public/pulse-lisbon-payment.webp';
import './Header.scss';

export const Header: React.FC = () => {
  const { i18n } = useTranslation();
  const isRu = i18n.language.startsWith('ru');

  return (
    <header className="public-hero">
      <img
        className="public-hero__image"
        src={heroImage}
        alt={
          isRu
            ? 'Оплата телефоном в городском кафе Лиссабона'
            : 'Paying by phone at a city cafe in Lisbon'
        }
        width="1920"
        height="1080"
        fetchPriority="high"
      />
      <div className="public-hero__shade" aria-hidden="true" />
      <div className="public-hero__content">
        <p className="public-eyebrow">PULSE BANK EUROPE</p>
        <h1>
          {isRu ? 'Деньги следуют за вашей жизнью' : 'Money that moves with you'}
        </h1>
        <p className="public-hero__lead">
          {isRu
            ? 'Счета в разных валютах, путешествия, инвестиции и повседневные сервисы в одном европейском приложении.'
            : 'Multi-currency accounts, travel, investing and everyday services in one European app.'}
        </p>
        <div className="public-hero__actions">
          <Link className="public-button public-button--primary" to="/bank">
            {isRu ? 'Открыть личный банк' : 'Open personal banking'}
            <span aria-hidden="true">↗</span>
          </Link>
          <Link className="public-button public-button--quiet" to="/services">
            {isRu ? 'Все сервисы' : 'Explore services'}
          </Link>
        </div>
        <dl className="public-hero__facts">
          <div>
            <dt>3</dt>
            <dd>{isRu ? 'валютных счёта' : 'currency accounts'}</dd>
          </div>
          <div>
            <dt>7</dt>
            <dd>{isRu ? 'сервисов Pulse' : 'connected services'}</dd>
          </div>
          <div>
            <dt>24/7</dt>
            <dd>{isRu ? 'контроль расходов' : 'spending control'}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
};

export default Header;

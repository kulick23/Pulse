import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.scss';

export const Footer: React.FC = () => {
  const { i18n } = useTranslation();
  const isRu = i18n.language.startsWith('ru');

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <Link to="/">PULSE<span aria-hidden="true">•</span></Link>
          <p>{isRu ? 'Европейская финансовая экосистема для повседневной жизни.' : 'A European financial ecosystem for everyday life.'}</p>
        </div>
        <div className="footer__links">
          <div><strong>{isRu ? 'Продукты' : 'Products'}</strong><Link to="/bank">{isRu ? 'Личный банк' : 'Personal banking'}</Link><Link to="/business">{isRu ? 'Бизнес' : 'Business'}</Link><Link to="/investing">{isRu ? 'Инвестиции' : 'Investing'}</Link><Link to="/mobile">{isRu ? 'Связь' : 'Mobile'}</Link></div>
          <div><strong>{isRu ? 'Экосистема' : 'Ecosystem'}</strong><Link to="/travel">Travel</Link><Link to="/insurance">{isRu ? 'Страхование' : 'Insurance'}</Link><Link to="/shop">Shop</Link><Link to="/services">{isRu ? 'Все сервисы' : 'All services'}</Link></div>
          <div><strong>Pulse</strong><Link to="/about">{isRu ? 'О нас' : 'About'}</Link><Link to="/news">{isRu ? 'Новости' : 'News'}</Link><Link to="/job">{isRu ? 'Вакансии' : 'Careers'}</Link><Link to="/contact">{isRu ? 'Контакты' : 'Contact'}</Link></div>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© 2026 Pulse Bank Europe · {isRu ? 'Концепт цифрового продукта' : 'Digital product concept'}</p>
        <div><Link to="/privacy">{isRu ? 'Конфиденциальность' : 'Privacy'}</Link><a href="mailto:hello@pulsebank.dev">hello@pulsebank.dev</a></div>
      </div>
    </footer>
  );
};

export default Footer;

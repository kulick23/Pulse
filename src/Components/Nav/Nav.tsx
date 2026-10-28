import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Nav.scss';

export const Nav: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentLanguage = i18n.language.startsWith('ru') ? 'ru' : 'en';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  useEffect(() => {
    document.body.classList.toggle('public-menu-open', menuOpen);
    return () => document.body.classList.remove('public-menu-open');
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const menu = mobileMenuRef.current;
    const focusable = menu?.querySelectorAll<HTMLElement>('a, button:not([disabled])');
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    const focusFrame = window.requestAnimationFrame(() => first?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== 'Tab' || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const navItems = [
    { label: t('nav.services'), link: '/services' },
    { label: t('nav.about'), link: '/about' },
    { label: t('nav.news'), link: '/news' },
    { label: t('nav.job'), link: '/job' },
    { label: t('nav.contact'), link: '/contact' },
  ];

  return (
    <>
      <nav className={`Nav ${scrolled || menuOpen ? 'Nav--solid' : ''}`} aria-label={currentLanguage === 'ru' ? 'Основная навигация' : 'Primary navigation'}>
        <div className="Nav__inner">
          <Link className="Nav__logo" to="/" aria-label={currentLanguage === 'ru' ? 'Главная Pulse' : 'Pulse home'}>PULSE<span aria-hidden="true">•</span></Link>
          <div className="Nav__desktop-links">
            {navItems.map((item) => <Link key={item.link} to={item.link}>{item.label}</Link>)}
          </div>
          <div className="Nav__actions">
            <div className="Nav__languages" aria-label={currentLanguage === 'ru' ? 'Выбор языка' : 'Language'}>
              <button className={currentLanguage === 'ru' ? 'active' : ''} onClick={() => i18n.changeLanguage('ru')} type="button">RU</button>
              <button className={currentLanguage === 'en' ? 'active' : ''} onClick={() => i18n.changeLanguage('en')} type="button">EN</button>
            </div>
            <Link className="Nav__login" to="/bank">{t('nav.login')}</Link>
            <button ref={menuButtonRef} className={`Nav__menu-button ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="public-mobile-menu" aria-label={menuOpen ? (currentLanguage === 'ru' ? 'Закрыть меню' : 'Close menu') : (currentLanguage === 'ru' ? 'Открыть меню' : 'Open menu')} type="button"><span /><span /></button>
          </div>
        </div>
      </nav>

      <div ref={mobileMenuRef} className={`Nav__mobile-menu ${menuOpen ? 'open' : ''}`} id="public-mobile-menu" aria-hidden={!menuOpen}>
        <div className="Nav__mobile-links">
          {navItems.map((item, index) => <Link key={item.link} to={item.link}><span>0{index + 1}</span>{item.label}</Link>)}
        </div>
        <div className="Nav__mobile-bottom">
          <div>
            <p>{currentLanguage === 'ru' ? 'Банк, который живёт вместе с вами.' : 'Banking that moves with your life.'}</p>
            <div className="Nav__mobile-languages" aria-label={currentLanguage === 'ru' ? 'Выбор языка' : 'Language'}>
              <button className={currentLanguage === 'ru' ? 'active' : ''} onClick={() => i18n.changeLanguage('ru')} type="button" aria-pressed={currentLanguage === 'ru'}>RU</button>
              <button className={currentLanguage === 'en' ? 'active' : ''} onClick={() => i18n.changeLanguage('en')} type="button" aria-pressed={currentLanguage === 'en'}>EN</button>
            </div>
          </div>
          <Link to="/bank">{currentLanguage === 'ru' ? 'Открыть приложение' : 'Open the app'} <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </>
  );
};

export default Nav;

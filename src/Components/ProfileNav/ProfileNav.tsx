import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProfileNav.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/auth';
import { useLogoutMutation } from '../../redux/auth/api';
import logoutIcon from '../../Assets/Icons/logout.svg';

export const ProfileNav: React.FC = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [scrollDirection, setScrollDirection] = React.useState('up');
  const [pastThreshold, setPastThreshold] = React.useState(false);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const navigate = useNavigate();

  // Получаем информацию об авторизации
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // RTK Query хук для выхода
  const [logoutApi] = useLogoutMutation();

  React.useEffect(() => {
    let lastScrollY = window.scrollY;

    function handleResizeAndScroll() {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (window.scrollY > 150) {
        setPastThreshold(true);
        if (window.scrollY > lastScrollY) {
          setScrollDirection('down');
        } else {
          setScrollDirection('up');
        }
      } else {
        setPastThreshold(false);
      }

      lastScrollY = window.scrollY;
    }

    window.addEventListener('resize', handleResizeAndScroll);
    window.addEventListener('scroll', handleResizeAndScroll);

    return () => {
      window.removeEventListener('resize', handleResizeAndScroll);
      window.removeEventListener('scroll', handleResizeAndScroll);
    };
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  // Обработчик выхода
  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate('/'); // Переход на главную страницу после выхода
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      // В случае ошибки все равно делаем локальный выход и переходим на главную
      dispatch(logout());
      navigate('/');
    }
  };

  return (
    <nav
      className={`ProfileNav ${scrolled ? 'scrolled' : ''} ${
        pastThreshold ? (scrollDirection === 'down' ? 'hide' : 'show') : ''
      }`}
    >
      <Link to="/">
        <span className="ProfileNav__logo">PULSE</span>
      </Link>

      <div className="ProfileNav__right-block">
        <div className="ProfileNav__switch">
          <button
            className={`switch_rus ${currentLanguage === 'ru' ? 'selected' : ''}`}
            onClick={() => changeLanguage('ru')}
            aria-label="Переключить на русский"
            type="button"
          >
            Rus
          </button>
          <button
            className={`switch_eng ${currentLanguage === 'en' ? 'selected' : ''}`}
            onClick={() => changeLanguage('en')}
            aria-label="Switch to English"
            type="button"
          >
            Eng
          </button>
        </div>

        <div className="ProfileNav__desktop-only">
          <button className="ProfileNav__company">
            {t('nav.companyName', 'Название Компании')}
          </button>
        </div>

        <button className="ProfileNav__logout" onClick={handleLogout}>
          <img src={logoutIcon} alt={t('nav.logout')} />
        </button>
      </div>
    </nav>
  );
};

export default ProfileNav;

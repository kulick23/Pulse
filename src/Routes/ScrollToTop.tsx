import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname: string, isRu: boolean) => {
  const title = (ru: string, en: string) => (isRu ? ru : en);

  if (pathname === '/') return title('Pulse — европейский банк', 'Pulse — European bank');
  if (/^\/services\/[^/]+$/.test(pathname)) return title('Сервис Pulse', 'Pulse service');
  if (pathname === '/services') return title('Экосистема', 'Ecosystem');
  if (pathname === '/about') return title('О Pulse', 'About Pulse');
  if (/^\/vacancies\/[^/]+$/.test(pathname)) return title('Вакансия', 'Vacancy');
  if (pathname === '/job') return title('Вакансии', 'Careers');
  if (pathname === '/contact') return title('Контакты', 'Contact');
  if (/^\/news\/[^/]+$/.test(pathname)) return title('Новость Pulse', 'Pulse news');
  if (pathname === '/news') return title('Новости', 'News');
  if (pathname === '/registration') return title('Создать Pulse ID', 'Create Pulse ID');
  if (pathname === '/recovery') return title('Восстановить доступ', 'Recover access');
  if (pathname === '/confirmation') return title('Подтвердить email', 'Confirm email');
  if (pathname === '/privacy') return title('Конфиденциальность', 'Privacy');
  if (pathname === '/business' || pathname.startsWith('/business/')) return title('Pulse для бизнеса', 'Pulse Business');
  if (pathname === '/investing' || pathname.startsWith('/investing/')) return title('Инвестиции', 'Investing');
  if (pathname === '/mobile' || pathname.startsWith('/mobile/')) return title('Мобильная связь', 'Mobile');
  if (pathname === '/insurance' || pathname.startsWith('/insurance/')) return title('Страхование', 'Insurance');
  if (/^\/travel\/[^/]+$/.test(pathname)) return title('Направление', 'Destination');
  if (pathname === '/travel') return title('Путешествия', 'Travel');
  if (/^\/shop\/product\/[^/]+$/.test(pathname)) return title('Товар Pulse Shop', 'Pulse Shop product');
  if (pathname === '/shop') return 'Pulse Shop';
  if (pathname === '/bank/operations') return title('Операции', 'Activity');
  if (pathname === '/bank/payments') return title('Платежи и переводы', 'Payments and transfers');
  if (pathname === '/bank/bonuses') return title('Кэшбэк и бонусы', 'Cashback and benefits');
  if (pathname === '/bank/more') return title('Ещё', 'More');
  if (pathname.startsWith('/bank/card/')) return title('Карта Pulse', 'Pulse card');
  if (pathname.startsWith('/bank/account/')) return title('Счёт Pulse', 'Pulse account');
  if (pathname === '/bank' || pathname === '/profile' || pathname === '/login') return title('Личный банк', 'Personal banking');

  return title('Страница не найдена', 'Page not found');
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const isRu = i18n.language.startsWith('ru');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${getPageTitle(pathname, isRu)} · Pulse`;
  }, [isRu, pathname]);

  return null;
};

export default ScrollToTop;

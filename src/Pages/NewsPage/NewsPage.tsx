import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import newsStore from '../../Store/NewsStore/NewsStore';
import NewsPreview from '../../Components/NewsPreview/NewsPreview';
import '../../Styles/PublicPages.scss';

export const NewsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('ru') ? 'ru' : 'en';
  const news = newsStore.getNewsByLanguage(lang).slice().reverse();

  return (
    <main className="public-page">
      <header className="public-page__hero">
        <p className="public-eyebrow">PULSE JOURNAL</p>
        <h1>{lang === 'ru' ? 'Как меняются деньги и сервисы вокруг них' : 'How money and its services are changing'}</h1>
        <p>{lang === 'ru' ? 'Новости продукта, разборы финансовых привычек и заметки о том, как строится единая европейская экосистема Pulse.' : 'Product news, financial behaviour notes and stories about building the connected European Pulse ecosystem.'}</p>
      </header>

      <section className="public-news-list">
        {news.map((item) => (
          <Link className="public-news-card" to={`/news/${item.id}`} key={item.id}>
            <NewsPreview id={item.id} title={item.title} type={item.type} />
            <div className="public-news-card__meta"><span>{item.type}</span><time>{item.date}</time></div>
            <h2>{item.title}</h2>
            <p>{item.desc1}</p>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default NewsPage;

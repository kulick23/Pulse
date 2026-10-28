import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import newsStore from '../../Store/NewsStore/NewsStore';
import NewsPreview from '../../Components/NewsPreview/NewsPreview';
import '../../Styles/PublicPages.scss';

export const NewsItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('ru') ? 'ru' : 'en';
  const item = newsStore.getNewsById(Number(id), lang);

  if (!item) {
    return <main className="public-page"><article className="public-article"><h1>{lang === 'ru' ? 'Материал не найден' : 'Story not found'}</h1><Link to="/news">← {lang === 'ru' ? 'К новостям' : 'Back to news'}</Link></article></main>;
  }

  return (
    <main className="public-page">
      <article className="public-article">
        <Link to="/news">← {lang === 'ru' ? 'Все материалы' : 'All stories'}</Link>
        <p className="public-eyebrow">{item.type}</p>
        <h1>{item.title}</h1>
        <div className="public-article__meta"><span>{item.author}</span><time>{item.date}</time></div>
        <NewsPreview id={item.id} title={item.title} type={item.type} />
        <p className="public-article__lead">{item.desc1}</p>
        <p className="public-article__lead">{item.desc2}</p>
        <div className="public-article__body" dangerouslySetInnerHTML={{ __html: item.content }} />
      </article>
    </main>
  );
};

export default NewsItemPage;

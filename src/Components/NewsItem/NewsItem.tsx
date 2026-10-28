import React from 'react';
import { useTranslation } from 'react-i18next';
import './NewsItem.scss';
import arrow from '../../Assets/Icons/Arrow.svg';

interface NewsProps {
  image: string;
  title: string;
  desc1: string;
  author: string;
  date: string;
  type: string;
  onClick?: () => void;
  featured?: boolean;
}

export const NewsItem: React.FC<NewsProps> = ({
  image,
  title,
  desc1,
  author,
  date,
  type,
  onClick,
  featured,
}) => {
  const { t } = useTranslation();

  if (featured) {
    return (
      <div className="NewsItem featured" onClick={onClick}>
        <div className="NewsItem__container">
          <span>{t('news.latest')}</span>
          <h3>{title}</h3>
          <div className="NewsItem__meta">
            By {author} | {date}
          </div>
          <p>{desc1}</p>
          <button>
            {t('news.more')}
            <img src={arrow} alt="arrow" className="button-arrow" />
          </button>
        </div>
        <img src={image} alt={title} />
      </div>
    );
  }

  return (
    <div className="NewsItem" onClick={onClick}>
      <img src={image} alt={title} />
      <div className="NewsItem__container">
        <span>{type}</span>
        <h3>{title}</h3>
        <p>{desc1}</p>
      </div>
    </div>
  );
};

export default NewsItem;

import React from 'react';

interface NewsPreviewProps {
  id: number;
  title: string;
  type: string;
}

const getPreviewTokens = (title: string) => {
  const words = title
    .replace(/[\u2014:,.!?()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const focalWord = words.reduce(
    (longest, word) => (word.length > longest.length ? word : longest),
    words[0] ?? 'Pulse'
  );
  const initials = words
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toLocaleUpperCase();

  return { focalWord, initials: initials || 'P' };
};

export const NewsPreview: React.FC<NewsPreviewProps> = ({ id, title, type }) => {
  const { focalWord, initials } = getPreviewTokens(title);
  const variant = (id - 1) % 4;

  return (
    <div className={`news-preview news-preview--${variant}`} aria-hidden="true">
      <div className="news-preview__topline">
        <span>Pulse Journal</span>
        <span>№ {String(id).padStart(2, '0')}</span>
      </div>

      <span className="news-preview__initials">{initials}</span>

      <div className="news-preview__pulse">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="news-preview__footer">
        <strong>{focalWord}</strong>
        <span>{type}</span>
      </div>
    </div>
  );
};

export default NewsPreview;

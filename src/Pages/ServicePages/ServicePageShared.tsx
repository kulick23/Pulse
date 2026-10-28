import React, { ReactNode } from 'react';
import { useAccessibleDialog } from '../../Hooks/useAccessibleDialog';
import { BankGlyph, BankGlyphName } from '../ProfilePage/BankGlyph';

export interface ServicePageProps {
  language: 'ru' | 'en';
  onNotice: (message?: string) => void;
}

export const locale = (language: 'ru' | 'en', ru: string, en: string) =>
  language === 'ru' ? ru : en;

export const downloadTextFile = (name: string, contents: string) => {
  const url = URL.createObjectURL(
    new Blob([contents], { type: 'text/csv;charset=utf-8' })
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};

export const ServiceModal: React.FC<{
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
}> = ({ title, closeLabel, onClose, children }) => {
  const modalRef = useAccessibleDialog<HTMLElement>(onClose);
  return (
    <div className="service-modal-overlay" onMouseDown={onClose}>
      <section
        ref={modalRef}
        className="service-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span>Pulse Europe</span>
            <h2>{title}</h2>
          </div>
          <button type="button" aria-label={closeLabel} onClick={onClose}>
            ×
          </button>
        </header>
        {children}
      </section>
    </div>
  );
};

export const ServiceHeader: React.FC<{
  eyebrow: string;
  title: string;
  description: string;
  metrics: Array<[string, string, string?]>;
}> = ({ eyebrow, title, description, metrics }) => (
  <>
    <header className="service-page-header" id="service-overview">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
    <section className="service-kpis">
      {metrics.map(([label, value, hint]) => (
        <article key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
          {hint && <small>{hint}</small>}
        </article>
      ))}
    </section>
  </>
);

export const ActionButton: React.FC<{
  icon: BankGlyphName;
  title: string;
  caption: string;
  onClick: () => void;
}> = ({ icon, title, caption, onClick }) => (
  <button className="service-action" type="button" onClick={onClick}>
    <span>
      <BankGlyph name={icon} />
    </span>
    <div>
      <strong>{title}</strong>
      <small>{caption}</small>
    </div>
    <b aria-hidden="true">→</b>
  </button>
);

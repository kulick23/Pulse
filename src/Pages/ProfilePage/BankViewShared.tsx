import React from 'react';
import { useAccessibleDialog } from '../../Hooks/useAccessibleDialog';
import { useBankLedger } from './bankLedger';

export interface BankViewProps {
  language: 'ru' | 'en';
  onNotice: () => void;
}

export const locale = (language: 'ru' | 'en', ru: string, en: string) =>
  language === 'ru' ? ru : en;

export const formatCurrency = (amount: number, language: 'ru' | 'en') =>
  new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(Math.abs(amount));

export const formatLedgerAmount = (amount: number, language: 'ru' | 'en') =>
  `${amount > 0 ? '+' : amount < 0 ? '−' : ''}${formatCurrency(amount, language)}`;

export const processLocalBankAction = () =>
  new Promise<void>((resolve) => window.setTimeout(resolve, 550));

export const DemoModal: React.FC<{
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ title, closeLabel, onClose, children }) => {
  const modalRef = useAccessibleDialog<HTMLDivElement>(onClose);
  return (
    <div className="bank-modal-overlay" onMouseDown={onClose}>
      <div
        ref={modalRef}
        className="bank-limit-modal bank-flow-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="bank-modal-close"
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
        >
          ×
        </button>
        <span className="bank-eyebrow">Pulse Bank Europe</span>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export const MiniActivity: React.FC<{
  language: 'ru' | 'en';
  limit?: number;
}> = ({ language, limit = 3 }) => {
  const { transactions } = useBankLedger();
  return (
    <div className="bank-mini-activity">
      {transactions.slice(0, limit).map((item) => (
        <div key={item.id}>
          <span
            className={`bank-transaction__icon bank-transaction__icon--${item.type}`}
          >
            {item.initials}
          </span>
          <p>
            <strong>{item.merchant}</strong>
            <small>
              {language === 'ru' ? item.categoryRu : item.categoryEn}
            </small>
          </p>
          <b className={item.type === 'income' ? 'positive' : ''}>
            {formatLedgerAmount(item.amount, language)}
          </b>
        </div>
      ))}
    </div>
  );
};

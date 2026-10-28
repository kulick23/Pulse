import React from 'react';
import { useNavigate } from 'react-router-dom';
import jobStore from '../../../Store/JobStore/JobStore';
import { useTranslation } from 'react-i18next';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqJobListProps {
  faqs: FaqItem[];
  activeIndex: number | null;
  onToggle: (index: number) => void;
}

export const FaqJobList: React.FC<FaqJobListProps> = ({
  faqs,
  activeIndex,
  onToggle,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="accordion">
      {faqs.map((faq, index) => (
        <div className="accordion__job" key={index}>
          <div className="accordion__item">
            <button
              onClick={() => onToggle(index)}
              aria-expanded={activeIndex === index}
              className="accordion__button"
            >
              <span className="accordion__title">{faq.question}</span>
            </button>
            <div
              className={`accordion__content ${activeIndex === index ? 'open' : ''}`}
            >
              <small>{faq.answer}</small>
            </div>
          </div>
          <button
            className="accordion__respond"
            onClick={() =>
              navigate(`/vacancies/${jobStore.vacanciec[index].id}`)
            }
          >
            {t('faq.respond')}
          </button>
        </div>
      ))}
    </div>
  );
};

export default FaqJobList;

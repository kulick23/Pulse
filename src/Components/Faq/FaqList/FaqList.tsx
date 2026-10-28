import React from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqListProps {
  faqs: FaqItem[];
  activeIndex: number | null;
  onToggle: (index: number) => void;
}

export const FaqList: React.FC<FaqListProps> = ({
  faqs,
  activeIndex,
  onToggle,
}) => {
  return (
    <div className="accordion">
      {faqs.map((faq, index) => (
        <div key={index} className="accordion__item">
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
      ))}
    </div>
  );
};

export default FaqList;

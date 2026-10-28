import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Faq.scss';
import jobStore from '../../Store/JobStore/JobStore';
import { useNavigate } from 'react-router-dom';
import Form from '../Form/Form';
import FaqList from './FaqList/FaqList';
import FaqJobList from './FaqList/FaqJobList';

interface FaqProps {
  variant?: 'default' | 'job';
}

export const FAQAccordion: React.FC<FaqProps> = ({ variant = 'default' }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = t('faq.questions', { returnObjects: true }) as {
    question: string;
    answer: string;
  }[];

  const faqsJob = jobStore.vacanciec.map((job) => ({
    question: job.title[i18n.language as 'en' | 'ru'],
    answer: job.desc[i18n.language as 'en' | 'ru'],
  }));

  useEffect(() => {
    const handleLinkClick = (event: Event) => {
      event.preventDefault();
      setShowForm(true);
    };

    const descriptionElement = document.querySelector('.Faq__description a');
    if (descriptionElement) {
      descriptionElement.addEventListener('click', handleLinkClick);
    }

    return () => {
      if (descriptionElement) {
        descriptionElement.removeEventListener('click', handleLinkClick);
      }
    };
  }, [showForm]);

  return (
    <section className="Faq">
      {variant === 'default' && (
        <>
          <h2>{t('faq.title')}</h2>
          <p
            className="Faq__description"
            dangerouslySetInnerHTML={{ __html: t('faq.subtitle') }}
          />
          <FaqList
            faqs={faqs}
            activeIndex={activeIndex}
            onToggle={toggleAccordion}
          />
        </>
      )}
      {variant === 'job' && (
        <FaqJobList
          faqs={faqsJob}
          activeIndex={activeIndex}
          onToggle={toggleAccordion}
        />
      )}
      {showForm && (
        <Form
          onClose={() => setShowForm(false)}
          formTitle={t('contact.title')}
        />
      )}
    </section>
  );
};

export default FAQAccordion;

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Timeline.scss';
import timelineImg from '../../Assets/Img/timeline.png';
import timelineTabletImg from '../../Assets/Img/timelineTablet.png';
import timelinePhoneImg from '../../Assets/Img/timelineMobile.png';
import timelineElementImg from '../../Assets/Icons/timelineElement.svg';
import timelineElementImgMobile from '../../Assets/Icons/timelineElementMobile.svg';
import Form from '../Form/Form';

export const Timeline: React.FC = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    stepRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      stepRefs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, [stepRefs]);

  const steps = [
    {
      title: t('timeline.pointTitle1'),
      subtitle: t('timeline.pointSubtitle1'),
      ref: stepRefs[0],
    },
    {
      title: t('timeline.pointTitle2'),
      subtitle: t('timeline.pointSubtitle2'),
      ref: stepRefs[1],
    },
    {
      title: t('timeline.pointTitle3'),
      subtitle: t('timeline.pointSubtitle3'),
      ref: stepRefs[2],
    },
  ];

  const renderSteps = () =>
    steps.map((step, index) => (
      <div key={index} className={`timeline__step${index + 1}`} ref={step.ref}>
        <h4 className="timeline__step-title">{step.title}</h4>
        <p className="timeline__step-text">{step.subtitle}</p>
      </div>
    ));

  return (
    <section className="timeline">
      <div className="timeline__container">
        <div className="timeline__top">
          <h2>{t('timeline.title')}</h2>
          <p className="timeline__text">{t('timeline.subtitle')}</p>
          <button onClick={() => setShowForm(true)}>
            {t('timeline.button')}
          </button>
        </div>
        <div className="timeline__bottom">
          <div className="timeline__images">
            <img
              className="timeline__img-line timeline__img-line--desktop"
              src={timelineImg}
              alt="line"
            />
            <img
              className="timeline__img-line timeline__img-line--tablet"
              src={timelineTabletImg}
              alt="line"
            />
            <img
              className="timeline__img-line timeline__img-line--mobile"
              src={timelinePhoneImg}
              alt="line"
            />
            {[1, 2, 3].map((i) => (
              <div key={i} className={`timeline__decor${i}-wrapper`}>
                <img
                  className={`timeline__decor${i} timeline__decor--desktop`}
                  src={timelineElementImg}
                  alt="decor"
                />
                <img
                  className={`timeline__decor${i} timeline__decor--mobile`}
                  src={timelineElementImgMobile}
                  alt="decor"
                />
              </div>
            ))}
          </div>
          <div className="timeline__steps">{renderSteps()}</div>
        </div>
      </div>
      {showForm && (
        <Form
          onClose={() => setShowForm(false)}
          formTitle={t('ServiceItem.form')}
        />
      )}
    </section>
  );
};

export default Timeline;

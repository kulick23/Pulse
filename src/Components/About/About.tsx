import React from 'react';
import { t, goTo } from '../../Hooks';
import { ABOUT_IMAGE, ARROW_ICON, ABOUT_ROUTE } from '../../Constants';
import './About.scss';

export const About = () => {
  return (
    <section className="About">
      <div className="About__container">
        <h2>{t('about.title')}</h2>
        <p dangerouslySetInnerHTML={{ __html: t('about.text1') }} />
        <button onClick={() => goTo(ABOUT_ROUTE)}>
          {t('about.button')}
          <img src={ARROW_ICON} alt="arrow" className="button-arrow" />
        </button>
      </div>
      <img src={ABOUT_IMAGE} alt="about section" />
    </section>
  );
};

export default About;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Team.scss';
import teamImg from '../../Assets/Img/teamImg.png';
import arrow from '../../Assets/Icons/Arrow.svg';

export const Team = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/job');
  };

  return (
    <section className="Team">
      <div className="Team__block">
        <img src={teamImg} alt="teamImg" />
        <div className="Team__container">
          <h2>{t('team.title')}</h2>
          <p dangerouslySetInnerHTML={{ __html: t('team.text1') }} />
          <button onClick={handleButtonClick}>
            {t('team.button')}
            <img src={arrow} alt="arrow" className="button-arrow" />
          </button>
        </div>
      </div>
      <div className="Team__quote">
        <h4>{t('team.text2')}</h4>
        <p>{t('team.author')}</p>
      </div>
    </section>
  );
};

export default Team;

import React from 'react';
import './Directions.scss';
import { goTo, useDirections } from '../../Hooks';
import {
  SERVICE_TYPES,
  DIRECTION_TEXT_KEYS,
  DirectionsVariant,
  ARROW_ICON,
  ABOUT_ROUTE,
} from '../../Constants';

export interface DirectionsProps {
  variant?: DirectionsVariant;
}

export const MainDirections: React.FC<DirectionsProps> = (props) => {
  const variant: DirectionsVariant = props.variant ?? 'default';
  const { t, lang, selectedType, setSelectedType, directions } =
    useDirections(variant);

  if (variant === 'default') {
    return (
      <section className="directions">
        <h2>{t(DIRECTION_TEXT_KEYS.title)}</h2>
        <div className="directions__list">
          {directions.slice(0, 3).map((direction, i) => (
            <div key={i} className="direction__item">
              <div className="direction__content">
                <h4>{direction.title}</h4>
                <p>{direction.description}</p>
              </div>
              <button onClick={() => goTo(`/services/${direction.id}`)}>
                <img src={ARROW_ICON} alt="arrow" className="button-arrow" />
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  } else if (variant === 'services') {
    return (
      <section className="directions">
        <h2>{t(DIRECTION_TEXT_KEYS.pageTitle)}</h2>
        <div className="directions__filters">
          <button
            onClick={() => setSelectedType(null)}
            className={selectedType === null ? 'active' : ''}
          >
            {t(DIRECTION_TEXT_KEYS.all)}
          </button>
          {SERVICE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={selectedType === type.id ? 'active' : ''}
            >
              {type[lang]}
            </button>
          ))}
        </div>
        <div className="directions__list">
          {directions.map((direction, i) => (
            <div key={i} className="direction__item">
              <div className="direction__content">
                <h4>{direction.title}</h4>
                <p>{direction.description}</p>
              </div>
              <button onClick={() => goTo(`/services/${direction.id}`)}>
                <img src={ARROW_ICON} alt="arrow" className="button-arrow" />
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  } else if (variant === 'popup') {
    return (
      <section className="directions">
        <h2>{t(DIRECTION_TEXT_KEYS.popup)}</h2>
        <div className="directions__filters">
          {SERVICE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={selectedType === type.id ? 'active' : ''}
            >
              {type[lang]}
            </button>
          ))}
        </div>
        <div className="directions__list">
          {directions.map((direction, i) => (
            <div key={i} className="direction__item">
              <div className="direction__content">
                <h4>{direction.title}</h4>
                <p>{direction.description}</p>
              </div>
              <button onClick={() => goTo(`/services/${direction.id}`)}>
                <img src={ARROW_ICON} alt="arrow" className="button-arrow" />
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  } else {
    return null;
  }
};

export default MainDirections;

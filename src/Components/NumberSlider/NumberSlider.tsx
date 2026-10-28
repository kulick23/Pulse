import React, { useState, useEffect, useRef } from 'react';
import Marquee from 'react-fast-marquee';
import { useTranslation } from 'react-i18next';
import './NumberSlider.scss';

interface NumberSliderProps {
  variant?: 'default' | 'services';
}

export const NumberSlider: React.FC<NumberSliderProps> = ({
  variant = 'default',
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState<number[]>([0, 0, 0]);
  const targetValues = [240, 12, 36];
  const targetText = [
    t('Numberslider.title1'),
    t('Numberslider.title2'),
    t('Numberslider.title3'),
  ];

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setValues([0, 0, 0]);
          targetValues.forEach((target, index) => {
            let start = 0;
            const interval = setInterval(() => {
              start++;
              setValues((prev) => {
                const newArr = [...prev];
                newArr[index] = start;
                return newArr;
              });
              if (start === target) clearInterval(interval);
            }, 25);
          });
        }
      },
      { threshold: 0.5 }
    );

    if (sliderRef.current) observer.observe(sliderRef.current);
    return () => observer.disconnect();
  }, []);

  const words = [
    'Pulse Card',
    'Pulse Travel',
    'Pulse Hotels',
    'Pulse Market',
    'Pulse Business',
    'Pulse Invest',
    'Pulse Pay',
  ];

  const renderNumberColumns = () =>
    values.map((value, idx) => (
      <div key={idx} className="numberSlider__column">
        <h1 className="numberSlider__count">
          {idx === 0 ? `${value}M+` : value}
        </h1>
        <p className="numberSlider__text">{targetText[idx]}</p>
      </div>
    ));

  const renderMarquee = () => (
    <Marquee speed={100} gradient={false} direction="right">
      {[...words, ...words].map((word, index) => (
        <span
          key={index}
          className="numberSlider__marqueeItem"
          style={{ marginRight: 70 }}
        >
          {word}
        </span>
      ))}
    </Marquee>
  );

  const containerClass =
    variant === 'default' ? 'numberSlider' : 'numberService';

  return (
    <>
      <div className={containerClass} ref={sliderRef}>
        {renderNumberColumns()}
      </div>
      {variant === 'default' && (
        <div className="numberSlider__marquee">{renderMarquee()}</div>
      )}
    </>
  );
};

export default NumberSlider;

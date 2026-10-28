import React from 'react';
import { useTranslation } from 'react-i18next';
import './SliderBar.scss';
import bagIcon from '../../Assets/Icons/bag.svg';
import listIcon from '../../Assets/Icons/list.svg';
import supportIcon from '../../Assets/Icons/support.svg';

interface SliderBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCreateOrder?: () => void;
}

export const SliderBar: React.FC<SliderBarProps> = ({
  activeTab,
  onTabChange,
  onCreateOrder,
}) => {
  const { t } = useTranslation();

  return (
    <div className="slider-bar">
      <div className="slider-bar__content">
        <nav className="slider-bar__nav">
          <div
            className={`slider-bar__item ${activeTab === 'company' ? 'active' : ''}`}
          >
            <button onClick={() => onTabChange('company')}>
              <img src={bagIcon} alt="Company" />
              <span>{t('profile.company', 'Ваша компания')}</span>
            </button>
          </div>

          <div
            className={`slider-bar__item ${activeTab === 'orders' ? 'active' : ''}`}
          >
            <button onClick={() => onTabChange('orders')}>
              <img src={listIcon} alt="Orders" />
              <span>{t('profile.ordersButton', 'Ваши заказы')}</span>
            </button>
          </div>

          <div
            className={`slider-bar__item ${activeTab === 'support' ? 'active' : ''}`}
          >
            <button onClick={() => onTabChange('support')}>
              <img src={supportIcon} alt="Support" />
              <span>{t('profile.supportButton', 'Поддержка')}</span>
            </button>
          </div>
        </nav>
      </div>
      <button className="slider-bar__create-button" onClick={onCreateOrder}>
        {t('profile.createOrder', 'Создать заказ')}
      </button>
      <div className="slider-bar__footer">
        <div className="slider-bar__contact">
          <span className="slider-bar__question">
            {t('profile.haveQuestions', 'Есть вопросы? Свяжитесь с нами')}
          </span>
          <a href="mailto:hello@pulsebank.dev" className="slider-bar__email">
            hello@pulsebank.dev
          </a>
        </div>
      </div>
    </div>
  );
};

export default SliderBar;

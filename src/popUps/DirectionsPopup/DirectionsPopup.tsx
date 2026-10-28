import React from 'react';
import './DirectionsPopup.scss';
import { MainDirections } from '../../Components/Directions/Directions';
import { useTranslation } from 'react-i18next';

interface DirectionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DirectionsPopup: React.FC<DirectionsPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="directions-popup-overlay">
      <div className="directions-popup">
        <MainDirections variant="popup" />
        <button className="popup-close-btn" onClick={onClose}>
          {t('popup.close')}
        </button>
      </div>
    </div>
  );
};

export default DirectionsPopup;

import React from 'react';
import Contact from '../Contact/Contact';
import './Form.scss';

interface FormProps {
  onClose: () => void;
  formTitle: string;
}

export const Form: React.FC<FormProps> = ({ onClose, formTitle }) => {
  const handleOverlayClick = () => {
    onClose();
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="form-overlay" onClick={handleOverlayClick}>
      <div className="form-container" onClick={handleContainerClick}>
        <Contact variant="form" formTitle={formTitle} />
      </div>
    </div>
  );
};

export default Form;

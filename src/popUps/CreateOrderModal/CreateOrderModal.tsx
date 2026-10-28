import React, { useState } from 'react';
import './CreateOrderModal.scss';
import iImg from '../../Assets/Icons/i.svg';
import uploadIcon from '../../Assets/Icons/file.svg';
import { useSendRequestMutation } from '../../redux/order/api';
import { useTranslation } from 'react-i18next';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDirections: () => void;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onOpenDirections,
}) => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sendRequest, { isLoading }] = useSendRequestMutation();
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('description', description);
    if (file) formData.append('file', file);

    try {
      await sendRequest(formData).unwrap();
      onClose();
    } catch (err) {
      console.error('Ошибка при создании заказа:', err);
      alert('Не удалось отправить запрос. Попробуйте позже.');
    }
  };

  return (
    <div className="orderModal-overlay">
      <div className="orderModal">
        <span className="orderModal__title">{t('popup.createOrder')}</span>
        <div className="orderModal__more">
          <span className="orderModal__more--title">{t('popup.awards')}</span>
          <p className="orderModal__more--text">{t('popup.hire')}</p>
          <a
            onClick={() => {
              onClose();
              onOpenDirections();
            }}
            className="orderModal__more--link"
          >
            {t('popup.more')}
          </a>
        </div>
        <div className="orderModal__description">
          <div className="orderModal__description--header">
            <span className="orderModal__description--header-sub">
              {t('popup.describe')}
            </span>
            <span className="orderModal__description--header-i">
              <img src={iImg} alt="icon" /> {t('popup.fill')}
            </span>
          </div>
          <input
            placeholder={t('popup.desc')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="orderModal__description">
          <div className="orderModal__description--header">
            <span className="orderModal__description--header-sub">
              {t('popup.add')}
            </span>
          </div>
          <input
            id="create-order-file"
            type="file"
            onChange={handleFileChange}
            hidden
          />
          <label htmlFor="create-order-file" className="file-upload-label">
            <img src={uploadIcon} alt="upload" />
            {file ? (
              <span className="file-name">{file.name}</span>
            ) : (
              <span className="file-placeholder">{t('popup.insert')}</span>
            )}
          </label>
        </div>
        <p className="orderModal__text">{t('popup.contact')}</p>
        <div className="orderModal__buttons">
          <button onClick={onClose}>{t('popup.close')}</button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !description.trim()}
          >
            {isLoading ? t('popup.sending') : t('popup.send')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;

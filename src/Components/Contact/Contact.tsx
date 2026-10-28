import React from 'react';
import { t, useContactForm } from '../../Hooks';

import './Contact.scss';
import uploadImg from '../../Assets/Icons/upload.svg';
import {
  CONTACT_PLACEHOLDERS,
  CONTACT_TEXT_KEYS,
} from '../../Constants/contact';

interface ContactProps {
  variant?: 'default' | 'vacancies' | 'form';
  formTitle?: string;
}

export const Contact: React.FC<ContactProps> = ({
  variant = 'default',
  formTitle,
}) => {
  const {
    CONTACT_METHODS,
    contactMethod,
    selectContactMethod,
    fileName,
    handleFileChange,
  } = useContactForm();

  const renderContactMethodSelector = () => (
    <div className="contact__method-selector">
      {CONTACT_METHODS.map((m) => (
        <span
          key={m}
          className={`contact__method ${contactMethod === m ? 'selected' : ''}`}
          onClick={() => selectContactMethod(m)}
        >
          <span className="contact__method-dot" />
          {t(`${m}`)}
        </span>
      ))}
    </div>
  );

  const renderInputs = () => (
    <div className="contact__inputs">
      <label className="contact__label">
        <input
          type={contactMethod === 'email' ? 'email' : 'text'}
          placeholder={CONTACT_PLACEHOLDERS[contactMethod]}
          className="contact__input"
          required
        />
        {renderContactMethodSelector()}
      </label>
      <label className="contact__label">
        <input
          type="text"
          placeholder={CONTACT_PLACEHOLDERS.name}
          className="contact__input"
        />
        {t(CONTACT_TEXT_KEYS.name)}
      </label>
      {variant === 'default' && (
        <label className="contact__label">
          <input
            type="text"
            placeholder={CONTACT_PLACEHOLDERS.site}
            className="contact__input"
          />
          {t(CONTACT_TEXT_KEYS.site)}
        </label>
      )}
      {variant === 'vacancies' && (
        <label className="contact__label">
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" className="custom-file-upload">
            <img src={uploadImg} alt="Upload" />
            <span>{fileName}</span>
          </label>
          {t(CONTACT_TEXT_KEYS.resume)}
        </label>
      )}
    </div>
  );

  const renderTextareaContainer = () => (
    <div className="contact__textarea-container">
      <label className="contact__label">
        <input
          placeholder={t(CONTACT_TEXT_KEYS.example)}
          className="contact__textarea"
          required
        />
        {t(
          variant === 'default'
            ? CONTACT_TEXT_KEYS.describe
            : CONTACT_TEXT_KEYS.about
        )}
      </label>
      <button type="submit" className="contact__button">
        {t(
          variant === 'default'
            ? CONTACT_TEXT_KEYS.button
            : CONTACT_TEXT_KEYS.button2
        )}
      </button>
    </div>
  );

  if (variant === 'form') {
    return (
      <section className="contact contact--form">
        {formTitle && <h2>{formTitle}</h2>}
        <form className="contact__form">
          <label className="contact__label">
            {contactMethod === 'email' ? (
              <input
                type="email"
                placeholder="hello@pulsebank.dev"
                className="contact__input"
                required
              />
            ) : (
              <input
                type="text"
                placeholder="@pulsebank"
                className="contact__input"
                required
              />
            )}
            {renderContactMethodSelector()}
          </label>
          <label className="contact__label">
            <input type="text" placeholder="Danila" className="contact__input" />
            {t('contact.name')}
          </label>
          <label className="contact__label">
            <input
              placeholder={t('contact.example')}
              className="contact__textarea"
              required
            />
            {t('contact.describe')}
          </label>
          <button type="submit" className="contact__button">
            {t('contact.button')}
          </button>
        </form>
      </section>
    );
  }
  return (
    <section className="contact">
      {variant !== 'form' && <h2>{t('contact.title')}</h2>}
      <form className="contact__form">
        {renderInputs()}
        {renderTextareaContainer()}
      </form>
    </section>
  );
};

export default Contact;

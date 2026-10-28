import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './FormInput.scss';

interface FormInputProps {
  type: 'text' | 'email' | 'password' | 'inn';
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  showMargin?: boolean;
  validate?: (value: string) => string | null;
  icon?: string;
  iconPosition?: 'left' | 'right';
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  type,
  label,
  value,
  onChange,
  placeholder,
  error,
  showMargin = false,
  validate,
  icon,
  iconPosition = 'left',
  onKeyPress,
  className = '',
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Проверяем значение при каждом изменении
  useEffect(() => {
    if (validate) {
      const validationError = validate(value);
      setLocalError(validationError);
    } else if (type === 'inn') {
      // Валидация ИНН
      if (value && !/^\d{10}$/.test(value)) {
        setLocalError(t('validation.innInvalid'));
      } else {
        setLocalError(null);
      }
    } else {
      setLocalError(null);
    }
  }, [value, validate, type, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Для ИНН позволяем только цифры и ограничиваем длину до 10 символов
    if (type === 'inn') {
      // Проверяем, что новое значение содержит только цифры
      if (!/^\d*$/.test(newValue)) {
        return; // Не обновляем значение, если оно содержит не-цифры
      }

      // Ограничиваем длину до 10 символов
      if (newValue.length > 10) {
        return; // Не обновляем значение, если оно длиннее 10 символов
      }
    }

    onChange(e);

    // Если есть функция валидации, проверяем сразу при вводе
    if (validate) {
      const validationError = validate(newValue);
      setLocalError(validationError);
    } else if (type === 'inn') {
      // Валидация ИНН при вводе
      if (newValue && newValue.length > 0 && newValue.length !== 10) {
        setLocalError(t('validation.innInvalid'));
      } else {
        setLocalError(null);
      }
    }
  };

  // Определяем, какую ошибку показывать (внешнюю или локальную)
  const displayError = error || localError;

  // Определяем актуальный тип ввода для поля
  const inputType =
    type === 'password' && showPassword
      ? 'text'
      : type === 'inn'
        ? 'text'
        : type;

  return (
    <>
      {label && (
        <label
          className={`Registration__form--title ${showMargin ? 'Registration__form--margin' : ''}`}
        >
          {label}
        </label>
      )}

      {type === 'password' ? (
        <div className="password-input-group">
          {icon && iconPosition === 'left' && (
            <div className="input-icon left-icon">
              <img src={icon} alt="Input icon" />
            </div>
          )}
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder || '********'}
            value={value}
            onChange={handleChange}
            className={`registration__input ${displayError ? 'input-error' : ''} ${icon && iconPosition === 'left' ? 'with-left-icon' : ''} ${className}`}
            onKeyPress={onKeyPress}
          />
          <span
            className="toggle-password-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            <svg
              width="20"
              height="16"
              viewBox="0 0 20 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 0.5C5.45455 0.5 1.57273 3.61091 0 8C1.57273 12.3891 5.45455 15.5 10 15.5C14.5455 15.5 18.4273 12.3891 20 8C18.4273 3.61091 14.5455 0.5 10 0.5ZM10 13C7.24545 13 5 10.7564 5 8C5 5.24364 7.24545 3 10 3C12.7545 3 15 5.24364 15 8C15 10.7564 12.7545 13 10 13ZM10 5.2C8.47273 5.2 7.22727 6.47273 7.22727 8C7.22727 9.52727 8.47273 10.8 10 10.8C11.5273 10.8 12.7727 9.52727 12.7727 8C12.7727 6.47273 11.5273 5.2 10 5.2Z"
                fill={showPassword ? '#FFFFFF' : '#AAAAAA'}
              />
            </svg>
          </span>
          {icon && iconPosition === 'right' && (
            <div className="input-icon right-icon">
              <img src={icon} alt="Input icon" />
            </div>
          )}
        </div>
      ) : (
        <div className="input-group">
          {icon && iconPosition === 'left' && (
            <div className="input-icon left-icon">
              <img src={icon} alt="Input icon" />
            </div>
          )}
          <input
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            className={`registration__input ${displayError ? 'input-error' : ''} ${icon && iconPosition === 'left' ? 'with-left-icon' : ''} ${className}`}
            onKeyPress={onKeyPress}
            maxLength={type === 'inn' ? 10 : undefined}
          />
          {icon && iconPosition === 'right' && (
            <div className="input-icon right-icon">
              <img src={icon} alt="Input icon" />
            </div>
          )}
        </div>
      )}

      {displayError && <div className="error-text">{displayError}</div>}
    </>
  );
};

export default FormInput;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FormInput from '../FormInput/FormInput';
import './PasswordResetForm.scss';

interface PasswordResetFormProps {
  onSubmit: (password: string) => Promise<void>;
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSubmit,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Валидация формы
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!password) {
      errors.password = t('validation.passwordRequired');
    } else if (password.length < 6) {
      errors.password = t('validation.passwordTooShort');
    }

    if (!confirmPassword) {
      errors.confirmPassword = t('validation.confirmPasswordRequired');
    } else if (password !== confirmPassword) {
      errors.confirmPassword = t('validation.passwordsDoNotMatch');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(password);
      navigate('/login');
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="password-reset-container">
      <h2>Сброс пароля</h2>
      <p>Пожалуйста, создайте новый пароль для завершения сброса пароля</p>

      <form className="password-reset-form" onSubmit={handleSubmit}>
        <FormInput
          type="password"
          label={t('recovery.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          error={validationErrors.password}
          showMargin
        />

        <FormInput
          type="password"
          label={t('recovery.confirmPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="********"
          error={validationErrors.confirmPassword}
          showMargin
        />

        <div className="registration__options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            {t('login.remember')}
          </label>
        </div>

        <button
          type="submit"
          className="registration__button"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('common.loading') : 'Изменить пароль'}
        </button>
      </form>
    </div>
  );
};

export default PasswordResetForm;

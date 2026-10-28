import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearError } from '../../redux/auth/slice';
import {
  useGetRecoveryCodeMutation,
  useUpdatePasswordMutation,
} from '../../redux/auth/api';
import FormInput from '../../Components/FormInput/FormInput';
import './RecoveryForm.scss';

// Функция для логирования
const logStep = (step: string, data?: any) => {
  console.log(`RECOVERY STEP: ${step}`, data || '');
};

// Функция для логирования ошибок
const logError = (place: string, error: any) => {
  console.error(`RECOVERY ERROR in ${place}:`, error);
  // Если есть детали ошибки от сервера, выводим их
  if (error.data) {
    console.error('Server error details:', error.data);
  }
  if (error.status) {
    console.error('Error status:', error.status);
  }
};

export const RecoveryForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем состояние из Redux
  const { error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Получаем данные из состояния навигации (если переход со страницы подтверждения)
  const {
    email: locationEmail,
    verificationCode: locationCode,
    codeVerified,
  } = location.state || {};

  // RTK Query хуки для API запросов
  const [getRecoveryCode, { isLoading: codeLoading }] =
    useGetRecoveryCodeMutation();
  const [updatePassword, { isLoading: updateLoading }] =
    useUpdatePasswordMutation();

  const [email, setEmail] = useState(locationEmail || '');
  const [verificationCode, setVerificationCode] = useState(locationCode || '');
  const [codeRequested, setCodeRequested] = useState(!!codeVerified);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Если пользователь аутентифицирован, перенаправляем на страницу профиля
  useEffect(() => {
    if (isAuthenticated) {
      logStep('User authenticated, redirecting to profile');
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  // Логируем ошибки аутентификации
  useEffect(() => {
    if (error) {
      logError('Auth state', error);
    }
  }, [error]);

  // Очищаем ошибки при размонтировании компонента
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Запрос кода восстановления
  const handleGetCode = async () => {
    logStep('Requesting recovery code', { email });

    // Проверка email
    if (!email) {
      logStep('Email validation failed: empty email');
      setValidationErrors({
        ...validationErrors,
        email: t('validation.emailRequired'),
      });
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      logStep('Email validation failed: invalid format');
      setValidationErrors({
        ...validationErrors,
        email: t('validation.emailInvalid'),
      });
      return false;
    }

    try {
      logStep('Sending API request for recovery code');

      // Запрос через RTK Query
      await getRecoveryCode(email).unwrap();
      logStep('Recovery code request successful');

      // Перенаправляем на страницу подтверждения кода
      navigate('/confirmation', {
        state: {
          email,
          mode: 'reset',
        },
      });
      return true;
    } catch (error) {
      logError('getRecoveryCode', error);
      return false;
    }
  };

  // Валидация формы
  const validateForm = () => {
    logStep('Validating recovery form');
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = t('validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = t('validation.emailInvalid');
    }

    if (codeRequested) {
      if (!verificationCode) {
        errors.verificationCode = t('validation.codeRequired');
      }

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
    }

    setValidationErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    logStep('Form validation result', { isValid, errors });
    return isValid;
  };

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logStep('Recovery form submitted', {
      email,
      codeProvided: !!verificationCode,
      passwordsProvided: !!password && !!confirmPassword,
    });

    // Если код не запрошен, запрашиваем его
    if (!codeRequested) {
      const success = await handleGetCode();
      if (success) {
        return;
      }
    }

    if (!validateForm()) {
      logStep('Form validation failed, aborting submission');
      return;
    }

    try {
      logStep('Sending update password request to API');

      // Данные для запроса
      const updateData = {
        email,
        code: verificationCode,
        password,
        confirmPassword,
      };

      logStep('Update password data prepared', updateData);

      await updatePassword(updateData).unwrap();
      logStep('Password update successful');

      // Перенаправляем на страницу входа после успешного обновления пароля
      navigate('/login');
    } catch (error) {
      logError('updatePassword', error);
    }
  };

  return (
    <div className="recovery-form-container">
      <h2>{t('recovery.title')}</h2>
      <p>{t('recovery.subtitle')}</p>

      {/* Отображение общей ошибки от API */}
      {error && <div className="error-message">{error}</div>}

      <form className="recovery-form" onSubmit={handleSubmit}>
        <FormInput
          type="email"
          label={t('recovery.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          error={validationErrors.email}
        />

        {codeRequested && (
          <>
            <FormInput
              type="text"
              label={t('recovery.verificationCode')}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              error={validationErrors.verificationCode}
              showMargin
            />

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
          </>
        )}

        <button
          type="submit"
          className="recovery__button"
          disabled={updateLoading || codeLoading}
        >
          {updateLoading || codeLoading
            ? t('common.loading')
            : codeRequested
              ? t('recovery.button')
              : t('recovery.getCode')}
        </button>

        <div className="recovery__footer">
          <p>
            <Link to="/login">{t('recovery.backToLogin')}</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RecoveryForm;

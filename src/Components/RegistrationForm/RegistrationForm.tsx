import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearError } from '../../redux/auth/slice';
import {
  useRegisterMutation,
  useGetRegistrationCodeMutation,
} from '../../redux/auth/api';
import FormInput from '../../Components/FormInput/FormInput';
import './RegistrationForm.scss';

// Создаем функцию для логирования
const logStep = (step: string, data?: any) => {
  console.log(`REGISTRATION STEP: ${step}`, data || '');
};

// Создаем функцию для логирования ошибок
const logError = (place: string, error: any) => {
  console.error(`REGISTRATION ERROR in ${place}:`, error);
  // Если есть детали ошибки от сервера, выводим их
  if (error.data) {
    console.error('Server error details:', error.data);
  }
  if (error.status) {
    console.error('Error status:', error.status);
  }
};

export const RegistrationForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Получаем состояние из Redux
  const { error, isAuthenticated } = useAppSelector((state) => state.auth);

  // RTK Query хук для API запросов
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const [getRegistrationCode, { isLoading: codeLoading }] =
    useGetRegistrationCodeMutation();

  const [email, setEmail] = useState('');
  const [inn, setInn] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [director, setDirector] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Функции валидации с использованием переводов
  // Функция валидации email
  const validateEmail = (email: string): string | null => {
    if (!email) return null; // Не показываем ошибку для пустого поля до отправки формы

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) ? null : t('validation.emailInvalid');
  };

  // Функция валидации названия компании
  const validateCompanyName = (name: string): string | null => {
    if (!name) return null; // Не показываем ошибку для пустого поля до отправки формы

    return name.trim().length > 0 ? null : t('validation.companyNameRequired');
  };

  // Функция валидации ФИО директора
  const validateDirector = (director: string): string | null => {
    if (!director) return null; // Не показываем ошибку для пустого поля до отправки формы

    return director.trim().length > 0 ? null : t('validation.directorRequired');
  };

  // Функция валидации пароля
  const validatePassword = (password: string): string | null => {
    if (!password) return null; // Не показываем ошибку для пустого поля до отправки формы

    return password.length >= 6 ? null : t('validation.passwordTooShort');
  };

  // Функция валидации подтверждения пароля с учетом текущего значения пароля
  const validateConfirmPassword = (confirmPassword: string): string | null => {
    if (!confirmPassword) return null; // Не показываем ошибку для пустого поля до отправки формы

    return confirmPassword === password
      ? null
      : t('validation.passwordsDoNotMatch');
  };

  // Логируем начало компонента
  useEffect(() => {
    logStep('Component mounted');
    return () => {
      logStep('Component unmounted');
    };
  }, []);

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

  // Валидация формы
  const validateForm = () => {
    logStep('Validating registration form');
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = t('validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = t('validation.emailInvalid');
    }

    if (!inn) {
      errors.inn = t('validation.innRequired');
    } else if (!/^\d{10}$/.test(inn)) {
      errors.inn = t('validation.innInvalid');
    }

    if (!companyName) {
      errors.companyName = t('validation.companyNameRequired');
    }

    if (!director) {
      errors.director = t('validation.directorRequired');
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

    setValidationErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    logStep('Form validation result', { isValid, errors });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logStep('Registration form submitted', {
      email,
      formFilled:
        !!inn && !!companyName && !!director && !!password && !!confirmPassword,
    });

    if (!validateForm()) {
      logStep('Form validation failed, aborting submission');
      return;
    }

    try {
      // Отправляем запрос на получение регистрационного кода
      logStep('Sending registration code request');
      await getRegistrationCode({ email }).unwrap();
      logStep('Registration code sent successfully');

      // Подготавливаем данные пользователя для регистрации
      const userData = {
        email,
        password,
        confirmPassword,
        firstName: director.split(' ')[0] || director, // Используем первое слово из ФИО директора
        lastName: director.split(' ').slice(1).join(' ') || '', // Остальная часть ФИО
        inn, // Добавляем ИНН
        name_company: companyName, // Название компании
        leader_name: director, // ФИО руководителя
      };

      logStep('Registration data prepared', userData);

      // Перенаправляем на страницу подтверждения кода
      navigate('/confirmation', {
        state: {
          email,
          mode: 'register',
          userData,
        },
      });
    } catch (error) {
      logError('registration code request', error);
    }
  };

  return (
    <div className="registration-form-container">
      <h2>{t('registration.title')}</h2>
      <p>{t('registration.subtitle')}</p>

      <form className="registration-form" onSubmit={handleSubmit}>
        {/* Отображение общей ошибки от API */}
        {error && <div className="error-message">{error}</div>}

        <FormInput
          type="email"
          label={t('registration.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@compagny.com"
          error={validationErrors.email}
          validate={validateEmail}
        />

        <FormInput
          type="inn"
          label={t('registration.inn')}
          value={inn}
          onChange={(e) => setInn(e.target.value)}
          placeholder="1234567890"
          error={validationErrors.inn}
          showMargin
        />

        <FormInput
          type="text"
          label={t('registration.companyName')}
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder={t('registration.companyNamePlaceholder')}
          error={validationErrors.companyName}
          validate={validateCompanyName}
          showMargin
        />

        <FormInput
          type="text"
          label={t('registration.director')}
          value={director}
          onChange={(e) => setDirector(e.target.value)}
          placeholder={t('registration.directorPlaceholder')}
          error={validationErrors.director}
          validate={validateDirector}
          showMargin
        />

        <FormInput
          type="password"
          label={t('registration.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          error={validationErrors.password}
          validate={validatePassword}
          showMargin
        />

        <FormInput
          type="password"
          label={t('registration.confirmPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="********"
          error={validationErrors.confirmPassword}
          validate={validateConfirmPassword}
          showMargin
        />

        <div className="registration__options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            {t('registration.remember')}
          </label>
        </div>

        <button
          type="submit"
          className="registration__button"
          disabled={registerLoading}
        >
          {registerLoading ? t('common.loading') : t('registration.submit')}
        </button>

        <div className="registration__footer">
          <p>
            {t('registration.haveAccount')}{' '}
            <Link to="/login">{t('registration.login')}</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;

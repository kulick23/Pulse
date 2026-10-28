import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearError } from '../../redux/auth';
import { useLoginMutation } from '../../redux/auth/api';
import FormInput from '../../Components/FormInput/FormInput';
import './LoginForm.scss';
import loginImage from '../../Assets/Public/pulse-lisbon-payment.webp';

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем состояние из Redux
  const { error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Получаем страницу, с которой пользователь был перенаправлен, если она есть
  const { from } = location.state || { from: '/profile' };

  // RTK Query хук для API запроса
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Если пользователь аутентифицирован, перенаправляем на предыдущую страницу или профиль
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

  // Очищаем ошибки при размонтировании компонента
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Валидация формы
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = t('validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = t('validation.emailInvalid');
    }

    if (!password) {
      errors.password = t('validation.passwordRequired');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login({ email, password }).unwrap();
      // Успешный вход - редирект происходит автоматически через useEffect
    } catch (error) {
      console.error('Ошибка при входе:', error);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-content">
        <h2>{t('login.title')}</h2>
        <p>{t('login.subtitle')}</p>

        {/* Отображение общей ошибки от API */}
        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <FormInput
            type="email"
            label={t('login.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@compagny.com"
            error={validationErrors.email}
          />

          <FormInput
            type="password"
            label={t('login.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            error={validationErrors.password}
            showMargin
          />

          <div className="login__options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              {t('login.remember')}
            </label>
            <Link to="/recovery" className="forgot-password">
              {t('login.forgot')}
            </Link>
          </div>

          <button type="submit" className="login__button" disabled={isLoading}>
            {isLoading ? t('common.loading') : t('login.button')}
          </button>

          <div className="login__register-link">
            <span>{t('login.noAccount')}</span>
            <Link to="/registration">{t('registration.title')}</Link>
          </div>
        </form>
      </div>

      <div className="login-visual">
        <img
          src={loginImage}
          alt=""
          width="1920"
          height="1080"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default LoginForm;

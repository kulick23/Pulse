import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../../Components/AuthShell/AuthShell';
import { demoAuthStore } from '../../Store/demoAuthStore';

export const RegistrationPage: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isRu = i18n.language.startsWith('ru');
  const [error, setError] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    const confirmation = String(data.get('confirmation') ?? '');
    if (password.length < 8) {
      setError(
        isRu
          ? 'Пароль должен содержать не менее 8 символов.'
          : 'Use at least 8 characters for your password.'
      );
      return;
    }
    if (password !== confirmation) {
      setError(isRu ? 'Пароли не совпадают.' : 'The passwords do not match.');
      return;
    }
    const profile = {
      name: String(data.get('name') ?? '').trim(),
      email,
      country: String(data.get('country') ?? 'DE'),
    };
    demoAuthStore.saveAccount(profile);
    navigate('/confirmation', { state: { email, mode: 'register' } });
  };

  return (
    <AuthShell
      eyebrow={isRu ? 'Личный аккаунт' : 'Personal account'}
      title={isRu ? 'Создайте Pulse ID' : 'Create your Pulse ID'}
      description={
        isRu
          ? 'Один вход для банка, путешествий, связи и остальных сервисов Pulse. Это локальный демо-сценарий.'
          : 'One sign-in for banking, travel, mobile and every Pulse service. This is a local demo flow.'
      }
      footer={
        <>
          {isRu ? 'Уже есть аккаунт?' : 'Already have an account?'}{' '}
          <Link to="/login">{isRu ? 'Войти' : 'Sign in'}</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={submit}>
        <div className="auth-form__grid">
          <label>
            {isRu ? 'Имя и фамилия' : 'Full name'}
            <input required name="name" autoComplete="name" />
          </label>
          <label>
            {isRu ? 'Страна проживания' : 'Country of residence'}
            <select name="country" defaultValue="DE">
              <option value="DE">{isRu ? 'Германия' : 'Germany'}</option>
              <option value="AT">{isRu ? 'Австрия' : 'Austria'}</option>
              <option value="NL">{isRu ? 'Нидерланды' : 'Netherlands'}</option>
              <option value="PT">{isRu ? 'Португалия' : 'Portugal'}</option>
              <option value="ES">{isRu ? 'Испания' : 'Spain'}</option>
            </select>
          </label>
        </div>
        <label>
          Email
          <input required name="email" type="email" autoComplete="email" />
        </label>
        <div className="auth-form__grid">
          <label>
            {isRu ? 'Пароль' : 'Password'}
            <input
              required
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
            />
          </label>
          <label>
            {isRu ? 'Повторите пароль' : 'Confirm password'}
            <input
              required
              name="confirmation"
              type="password"
              minLength={8}
              autoComplete="new-password"
            />
          </label>
        </div>
        <label className="auth-form__check">
          <input required name="terms" type="checkbox" />
          <span>
            {isRu
              ? 'Я принимаю условия демо и '
              : 'I accept the demo terms and '}
            <Link to="/privacy">
              {isRu ? 'политику конфиденциальности' : 'privacy policy'}
            </Link>
            .
          </span>
        </label>
        {error && (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        )}
        <button type="submit">{isRu ? 'Продолжить' : 'Continue'}</button>
      </form>
    </AuthShell>
  );
};

export default RegistrationPage;

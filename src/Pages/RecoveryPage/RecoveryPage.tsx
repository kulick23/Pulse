import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../../Components/AuthShell/AuthShell';
import { demoAuthStore } from '../../Store/demoAuthStore';

interface RecoveryState {
  email?: string;
  codeVerified?: boolean;
}

export const RecoveryPage: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state ?? {}) as RecoveryState;
  const isRu = i18n.language.startsWith('ru');
  const [error, setError] = useState('');

  const submitEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    navigate('/confirmation', { state: { email, mode: 'reset' } });
  };

  const submitPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
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
    demoAuthStore.markPasswordUpdated();
    navigate('/profile', { replace: true });
  };

  const verified = Boolean(state.codeVerified);
  return (
    <AuthShell
      eyebrow={isRu ? 'Безопасность аккаунта' : 'Account security'}
      title={
        verified
          ? isRu
            ? 'Новый пароль'
            : 'Choose a new password'
          : isRu
            ? 'Восстановление доступа'
            : 'Recover access'
      }
      description={
        verified
          ? isRu
            ? `Код для ${state.email ?? 'вашего аккаунта'} подтверждён. Задайте новый пароль для демо.`
            : `The code for ${state.email ?? 'your account'} is confirmed. Set a new demo password.`
          : isRu
            ? 'Укажите email Pulse ID. В демо мы покажем код сразу и ничего не отправим на сервер.'
            : 'Enter your Pulse ID email. The demo shows the code immediately and sends nothing to a server.'
      }
      footer={
        <Link to="/login">
          {isRu ? 'Вернуться в банк' : 'Back to the bank'}
        </Link>
      }
    >
      {verified ? (
        <form className="auth-form" onSubmit={submitPassword}>
          <label>
            {isRu ? 'Новый пароль' : 'New password'}
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
          {error && (
            <p className="auth-form__error" role="alert">
              {error}
            </p>
          )}
          <button type="submit">
            {isRu ? 'Обновить пароль' : 'Update password'}
          </button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={submitEmail}>
          <label>
            Email
            <input required name="email" type="email" autoComplete="email" />
          </label>
          <p className="auth-form__hint">
            {isRu
              ? 'Демо-код появится на следующем экране. Реальное письмо не отправляется.'
              : 'A demo code appears on the next screen. No real email is sent.'}
          </p>
          <button type="submit">{isRu ? 'Получить код' : 'Get a code'}</button>
        </form>
      )}
    </AuthShell>
  );
};

export default RecoveryPage;

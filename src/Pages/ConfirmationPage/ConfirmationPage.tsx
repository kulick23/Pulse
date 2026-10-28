import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../../Components/AuthShell/AuthShell';
import { demoAuthStore } from '../../Store/demoAuthStore';

interface ConfirmationState {
  email?: string;
  mode?: 'register' | 'reset';
}

const demoCode = '246810';

export const ConfirmationPage: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state ?? {}) as ConfirmationState;
  const isRu = i18n.language.startsWith('ru');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const isReset = state.mode === 'reset';

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = String(new FormData(event.currentTarget).get('code') ?? '');
    if (code !== demoCode) {
      setError(
        isRu ? 'Введите демо-код 246810.' : 'Enter the demo code 246810.'
      );
      return;
    }
    if (isReset) {
      navigate('/recovery', {
        replace: true,
        state: { email: state.email, codeVerified: true },
      });
      return;
    }
    demoAuthStore.confirmAccount();
    navigate('/profile', { replace: true });
  };

  return (
    <AuthShell
      eyebrow={isRu ? 'Проверка Pulse ID' : 'Pulse ID verification'}
      title={isRu ? 'Подтвердите email' : 'Confirm your email'}
      description={
        isRu
          ? `Для ${state.email || 'вашего аккаунта'} используется локальный демо-код. Никаких писем и запросов к серверу.`
          : `A local demo code is used for ${state.email || 'your account'}. No email or server request is made.`
      }
      footer={
        <Link to={isReset ? '/recovery' : '/registration'}>
          {isRu ? 'Изменить email' : 'Change email'}
        </Link>
      }
    >
      <form className="auth-form" onSubmit={submit}>
        <p className="auth-form__success" aria-live="polite">
          {isRu ? 'Ваш демо-код: ' : 'Your demo code: '}
          <strong>{demoCode}</strong>
        </p>
        <label>
          {isRu ? 'Код из 6 цифр' : '6-digit code'}
          <input
            required
            name="code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="000000"
          />
        </label>
        {error && (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="auth-form__hint" aria-live="polite">
            {notice}
          </p>
        )}
        <button type="submit">
          {isReset
            ? isRu
              ? 'Продолжить восстановление'
              : 'Continue recovery'
            : isRu
              ? 'Открыть Pulse'
              : 'Open Pulse'}
        </button>
        <button
          className="auth-form__secondary"
          type="button"
          onClick={() =>
            setNotice(
              isRu
                ? 'Код обновлён. Для демо используйте 246810.'
                : 'Code refreshed. Use 246810 for this demo.'
            )
          }
        >
          {isRu ? 'Получить код ещё раз' : 'Get another code'}
        </button>
      </form>
    </AuthShell>
  );
};

export default ConfirmationPage;

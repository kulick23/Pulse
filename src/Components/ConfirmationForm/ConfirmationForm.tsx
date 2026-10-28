import React from 'react';
import { CodeInput } from '../CodeInput';
import { ResendCode } from '../ResendCode';
import './ConfirmationForm.scss';
import { t, useConfirmationForm } from '../../Hooks';

interface ConfirmationFormProps {
  email: string;
  isRegisterMode: boolean;
  error: string | null;
  isSubmitting: boolean;
  onSubmit: (verificationCode: string) => void;
  onResendCode: () => Promise<void>;
}

export const ConfirmationForm: React.FC<ConfirmationFormProps> = (props) => {
  const {
    code,
    canResend,
    resendTimer,
    handleCodeChange,
    handleKeyDown,
    handlePaste,
    handleResend,
    handleSubmit,
    subtitle,
  } = useConfirmationForm(props);

  return (
    <div className="ConfirmationForm">
      <h2>{t('confirmation.title')}</h2>
      <p>{subtitle}</p>

      {props.error && <div className="error-message">{props.error}</div>}

      <form onSubmit={handleSubmit}>
        <CodeInput
          code={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />

        <ResendCode
          canResend={canResend}
          resendTimer={resendTimer}
          onResend={handleResend}
        />

        <button
          type="submit"
          className="confirmation-button"
          disabled={props.isSubmitting || code.some((d) => !d)}
        >
          {props.isSubmitting
            ? t('common.loading')
            : props.isRegisterMode
              ? t('confirmation.registerButton')
              : t('confirmation.resetButton')}
        </button>
      </form>
    </div>
  );
};

export default ConfirmationForm;

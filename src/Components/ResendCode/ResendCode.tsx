import React from 'react';
import { useTranslation } from 'react-i18next';
import './ResendCode.scss';

interface ResendCodeProps {
  canResend: boolean;
  resendTimer: number;
  onResend: () => void;
}

export const ResendCode: React.FC<ResendCodeProps> = ({
  canResend,
  resendTimer,
  onResend,
}) => {
  const { t } = useTranslation();

  return (
    <a
      href="#"
      className={`resend-code ${!canResend ? 'disabled' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        if (canResend) onResend();
      }}
    >
      {canResend
        ? t('confirmation.resendCode')
        : `${t('confirmation.resendDisabled')} (0:${resendTimer < 10 ? `0${resendTimer}` : resendTimer})`}
    </a>
  );
};

export default ResendCode;

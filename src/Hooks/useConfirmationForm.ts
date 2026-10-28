import { React, useState, useEffect } from 'react';
import { useAppTranslation } from './useAppTranslation';
import { CODE_LENGTH, RESEND_TIMEOUT } from '../Constants/confirmation';

interface UseConfirmationFormProps {
  email: string;
  isRegisterMode: boolean;
  onSubmit: (verificationCode: string) => void;
  onResendCode: () => Promise<void>;
}

export const useConfirmationForm = ({
  email,
  isRegisterMode,
  onSubmit,
  onResendCode,
}: UseConfirmationFormProps) => {
  const { t } = useAppTranslation();

  const logStep = (step: string, data?: any) =>
    console.log(`CONFIRMATION STEP: ${step}`, data || '');

  const logError = (place: string, error: any) => {
    console.error(`CONFIRMATION ERROR in ${place}:`, error);
    if (error.data) console.error('Server error details:', error.data);
    if (error.status) console.error('Error status:', error.status);
  };

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    setResendTimer(RESEND_TIMEOUT);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) return;
    setCode((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleKeyDown = (_idx: number, _e: React.KeyboardEvent) => {
    // no-op
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, CODE_LENGTH)
      .split('');
    setCode((prev) => {
      const next = [...prev];
      digits.forEach((d, i) => {
        if (i < CODE_LENGTH) next[i] = d;
      });
      return next;
    });
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(RESEND_TIMEOUT);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      await onResendCode();
      logStep('Code resent successfully');
    } catch (error) {
      logError('resendCode', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    if (verificationCode.length !== CODE_LENGTH) {
      logStep('Incomplete code');
      return;
    }
    onSubmit(verificationCode);
  };

  const subtitle = t(
    isRegisterMode
      ? 'confirmation.registerSubtitle'
      : 'confirmation.resetSubtitle'
  ).replace(/youremail@gmail\.com/g, email);

  return {
    code,
    canResend,
    resendTimer,
    handleCodeChange,
    handleKeyDown,
    handlePaste,
    handleResend,
    handleSubmit,
    subtitle,
  };
};

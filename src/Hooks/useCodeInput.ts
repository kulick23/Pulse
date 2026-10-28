import { React, useState, useRef, useEffect } from 'react';
import { CODE_LENGTH } from '../Constants/codeInput';

interface UseCodeInputParams {
  code: string[];
  onChange: (index: number, value: string) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}

export const useCodeInput = ({
  code,
  onChange,
  onPaste,
}: UseCodeInputParams) => {
  const [fullCode, setFullCode] = useState('');
  const [activePosition, setActivePosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullCode(code.join(''));
    const emptyIndex = code.findIndex((digit) => digit === '');
    setActivePosition(emptyIndex !== -1 ? emptyIndex : code.length);
  }, [code]);

  const handleFullCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
      .replace(/[^0-9]/g, '')
      .substring(0, CODE_LENGTH);
    setFullCode(newValue);
    setActivePosition(newValue.length);

    const newCode = [...code];
    for (let i = 0; i < CODE_LENGTH; i++) {
      const val = i < newValue.length ? newValue[i] : '';
      if (newCode[i] !== val) {
        onChange(i, val);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowLeft') {
      setActivePosition((p) => Math.max(0, p - 1));
    } else if (e.key === 'ArrowRight') {
      setActivePosition((p) => Math.min(fullCode.length, p + 1));
    } else if (e.key === 'Backspace' && fullCode.length === 0) {
      setActivePosition(0);
    }
  };

  const handleFocus = () => {
    setActivePosition(fullCode.length === 0 ? 0 : fullCode.length);
  };

  const handleDigitClick = (index: number) => {
    setActivePosition(Math.min(index, fullCode.length));
    inputRef.current?.focus();
  };

  return {
    fullCode,
    activePosition,
    inputRef,
    handleFullCodeChange,
    handleKeyDown,
    handleFocus,
    handleDigitClick,
    onPaste,
  };
};

import React from 'react';
import './CodeInput.scss';
import { CODE_LENGTH, DIGIT_INDICES } from '../../Constants';
import { useCodeInput } from '../../Hooks';

interface CodeInputProps {
  code: string[];
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}

export const CodeInput: React.FC<CodeInputProps> = (props) => {
  const { code, onPaste } = props;
  const {
    fullCode,
    activePosition,
    inputRef,
    handleFullCodeChange,
    handleKeyDown,
    handleFocus,
    handleDigitClick,
  } = useCodeInput({ code, onChange: props.onChange, onPaste });

  return (
    <div className="code-input-group">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        maxLength={CODE_LENGTH}
        className="code-input-hidden"
        value={fullCode}
        onChange={handleFullCodeChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onPaste={onPaste}
        autoFocus
      />

      <div className="code-input-display">
        {DIGIT_INDICES.map((index) => (
          <div
            key={index}
            className={`code-digit ${
              activePosition === index && !code[index] ? 'active' : ''
            }`}
            onClick={() => handleDigitClick(index)}
          >
            {code[index]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeInput;

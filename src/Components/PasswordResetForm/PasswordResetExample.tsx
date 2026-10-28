import React from 'react';
import { PasswordResetForm } from './PasswordResetForm';

const PasswordResetExample: React.FC = () => {
  const handleResetPassword = async (password: string) => {
    // В реальном приложении здесь будет запрос к API
    console.log('Password reset request with password:', password);

    // Имитация задержки запроса
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#222',
      }}
    >
      <PasswordResetForm onSubmit={handleResetPassword} />
    </div>
  );
};

export default PasswordResetExample;

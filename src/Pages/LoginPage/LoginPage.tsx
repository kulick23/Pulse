import React from 'react';
import './LoginPage.scss';
import LoginForm from '../../Components/LoginForm/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="LoginPage">
      <LoginForm />
    </div>
  );
};

export default LoginPage;

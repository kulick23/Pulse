import React from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../Nav/Nav';

// На странице профиля Nav не будет отображаться, так как ProfileNav отображается в самом компоненте ProfilePage
export const Navigation: React.FC = () => {
  const location = useLocation();
  const isProfilePage = /^\/(?:profile|bank|business|investing|mobile|insurance|travel|shop|login|registration|recovery|confirmation)\/?(?:\/.*)?$/.test(
    location.pathname
  );

  // На странице профиля навигация будет включена в сам компонент страницы
  if (isProfilePage) {
    return null;
  }

  return <Nav />;
};

export default Navigation;

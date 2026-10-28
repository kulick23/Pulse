import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import '../Styles/loading.scss';

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Для отладки
  useEffect(() => {
    console.log(
      'ProtectedRoute: isAuthenticated =',
      isAuthenticated,
      'isLoading =',
      isLoading
    );
  }, [isAuthenticated, isLoading]);

  // Пока проверяем состояние авторизации, показываем загрузку
  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа,
  // сохраняя адрес, откуда пришли, чтобы можно было вернуться после входа
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Если авторизован, отображаем защищенный контент
  return <>{element}</>;
};

export default ProtectedRoute;

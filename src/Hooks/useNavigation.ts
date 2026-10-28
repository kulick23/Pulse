import { useNavigate } from 'react-router-dom';

type NavigateFn = (path: string) => void;
const navigateRef: { current?: NavigateFn } = {};

export const useNavigation = () => {
  const navigate = useNavigate();
  navigateRef.current = navigate;

  const goTo = (path: string) => () => navigate(path);
  return { goTo };
};

export const goTo = (path: string) => {
  if (!navigateRef.current) {
    throw new Error(
      'Navigation is not initialized. Сначала вызовите useNavigation в каком-нибудь компоненте.'
    );
  }
  navigateRef.current(path);
};

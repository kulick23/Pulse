import i18n, { t as i18nextT } from 'i18next';
import { useTranslation } from 'react-i18next';

export const t = i18nextT.bind(i18n);
export const i18nInstance = i18n;
export const ready = i18n.isInitialized;

export const useAppTranslation = () => {
  const { t, i18n, ready } = useTranslation();
  return { t, i18n, ready };
};

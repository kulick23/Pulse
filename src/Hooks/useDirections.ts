import { useState } from 'react';
import { useAppTranslation } from './useAppTranslation';
import servicesStore from '../Store/ServicesStore/ServicesStore';
import {
  SERVICE_TYPES,
  DirectionsVariant,
  ServiceType,
} from '../Constants/directions';

export interface DirectionItem {
  id: number;
  title: string;
  description: string;
}

export const useDirections = (variant: DirectionsVariant) => {
  const { t, i18n } = useAppTranslation();
  const lang = i18n.language as 'ru' | 'en';

  const defaultSelected = variant === 'popup' ? SERVICE_TYPES[0].id : null;
  const [selectedType, setSelectedType] = useState<number | null>(
    defaultSelected
  );

  const allRaw = servicesStore.getServicesByLanguage(lang);
  const filtered = allRaw.filter(
    (s) => selectedType === null || s.typeId === selectedType
  );
  const directions: DirectionItem[] = filtered.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.desc,
  }));

  return {
    t,
    lang,
    selectedType,
    setSelectedType,
    directions,
  };
};

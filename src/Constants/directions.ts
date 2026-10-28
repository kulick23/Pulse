export type DirectionsVariant = 'default' | 'services' | 'popup';

export interface ServiceType {
  id: number;
  ru: string;
  en: string;
}

export const SERVICE_TYPES: ServiceType[] = [
  { id: 1, ru: 'Банк', en: 'Banking' },
  { id: 2, ru: 'Лайфстайл', en: 'Lifestyle' },
  { id: 3, ru: 'Бизнес', en: 'Business' },
  { id: 4, ru: 'Инвестиции', en: 'Investing' },
];

export const DIRECTION_TEXT_KEYS = {
  title: 'directions.title',
  pageTitle: 'directions.PageTitle',
  all: 'directions.All',
  popup: 'directions.titlePop',
};

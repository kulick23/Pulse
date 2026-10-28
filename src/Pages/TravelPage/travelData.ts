import indonesiaHero from '../../Assets/Travel/indonesia-hero.webp';
import indonesiaKomodo from '../../Assets/Travel/indonesia-komodo.webp';
import indonesiaBromo from '../../Assets/Travel/indonesia-bromo.webp';
import indonesiaCulture from '../../Assets/Travel/indonesia-culture.webp';

export interface TravelStory {
  id: string;
  titleRu: string;
  titleEn: string;
  eyebrowRu: string;
  eyebrowEn: string;
  bodyRu: string;
  bodyEn: string;
  image: string;
  orientation: 'portrait' | 'landscape';
}

export interface TravelDestination {
  slug: string;
  countryRu: string;
  countryEn: string;
  titleRu: string;
  titleEn: string;
  summaryRu: string;
  summaryEn: string;
  hero: string;
  stories: TravelStory[];
}

export const travelDestinations: TravelDestination[] = [
  {
    slug: 'indonesia',
    countryRu: 'Индонезия',
    countryEn: 'Indonesia',
    titleRu: 'Острова, вулканы и море',
    titleEn: 'Islands, volcanoes and sea',
    summaryRu: 'Первая полноценная коллекция Pulse Travel, собранная на основе проекта Indonesia.',
    summaryEn: 'The first complete Pulse Travel collection, evolved from the Indonesia project.',
    hero: indonesiaHero,
    stories: [
      {
        id: 'komodo',
        titleRu: 'Путешествие к островам Комодо',
        titleEn: 'Sailing towards the Komodo islands',
        eyebrowRu: 'Восточная Нуса-Тенгара',
        eyebrowEn: 'East Nusa Tenggara',
        bodyRu: 'Маршрут объединяет морскую часть путешествия и островные остановки. В Pulse его можно сохранить как основу поездки, а бюджет держать рядом с валютным счётом.',
        bodyEn: 'The route combines time at sea with island stops. In Pulse, it can become the base for a trip plan with the budget kept next to the travel account.',
        image: indonesiaKomodo,
        orientation: 'portrait',
      },
      {
        id: 'bromo',
        titleRu: 'Рассвет над Бромо',
        titleEn: 'Sunrise above Bromo',
        eyebrowRu: 'Восточная Ява',
        eyebrowEn: 'East Java',
        bodyRu: 'Вулканический ландшафт, море песка и вид на Семеру стали центральной сценой старого проекта. Теперь это самостоятельный маршрут внутри travel-экосистемы.',
        bodyEn: 'The volcanic landscape, sea of sand and view towards Semeru were the centrepiece of the legacy project. They now form a reusable route inside the travel ecosystem.',
        image: indonesiaBromo,
        orientation: 'landscape',
      },
      {
        id: 'culture',
        titleRu: 'Культура как часть маршрута',
        titleEn: 'Culture as part of the route',
        eyebrowRu: 'Люди и традиции',
        eyebrowEn: 'People and traditions',
        bodyRu: 'Страница не сводит страну к набору бронирований. Истории, локальный контекст и визуальные материалы остаются частью планирования поездки.',
        bodyEn: 'The country page is more than a booking surface. Stories, local context and visual material remain part of planning the journey.',
        image: indonesiaCulture,
        orientation: 'portrait',
      },
    ],
  },
];

export const getTravelDestination = (slug: string) =>
  travelDestinations.find((destination) => destination.slug === slug);

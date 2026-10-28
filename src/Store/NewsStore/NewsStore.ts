import { makeAutoObservable } from 'mobx';
import { newsContentsRus } from './newsContentsRus';
import { newsContentsEn } from './newsContentsEn';

interface News {
  id: number;
  title: { ru: string; en: string };
  date: [number, number, number];
  type: { ru: string; en: string };
  author: string;
  content: { ru: string; en: string };
  desc1: { ru: string; en: string };
  desc2: { ru: string; en: string };
}

const RU_MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];
const EN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatDate(
  [year, month, day]: [number, number, number],
  lang: 'ru' | 'en'
): string {
  if (lang === 'ru') {
    return `${day} ${RU_MONTHS[month - 1]} ${year}`;
  }
  return `${EN_MONTHS[month - 1]} ${day}, ${year}`;
}

class NewsStore {
  news: News[] = [];

  constructor() {
    makeAutoObservable(this);
    this.initializeNews();
  }

  private initializeNews() {
    const authors = ['Pulse', 'Pulse', 'Pulse', 'Pulse', 'Pulse', 'Pulse', 'Pulse'];
    const numericDates: [number, number, number][] = [
      [2026, 2, 12],
      [2026, 3, 4],
      [2026, 3, 28],
      [2026, 4, 15],
      [2026, 5, 7],
      [2026, 6, 2],
      [2026, 7, 18],
    ];

    const ruTitles = [
      'Почему финтех-экосистемы заменяют классический интернет-банк',
      'Как умный кешбэк помогает пользователю тратить осознаннее',
      'Travel-сервисы внутри банка: новый стандарт для поездок',
      'Маркетплейс в банковском приложении: польза без перегруза',
      'Что должно быть в современном кабинете для бизнеса',
      'Безопасность цифрового банка: от входа до операций',
      'Как персональные финансы становятся частью ежедневного интерфейса',
    ];
    const enTitles = [
      'Why fintech ecosystems replace classic internet banking',
      'How smart cashback helps users spend more consciously',
      'Travel services inside a bank: a new trip standard',
      'Marketplace inside a banking app: useful without overload',
      'What a modern business finance workspace needs',
      'Digital bank security: from login to transactions',
      'How personal finance becomes part of the daily interface',
    ];

    const ruTypes = ['ФИНТЕХ', 'БАНК', 'TRAVEL', 'МАРКЕТПЛЕЙС', 'БИЗНЕС', 'SECURITY', 'UX'];
    const enTypes = ['FINTECH', 'BANKING', 'TRAVEL', 'MARKETPLACE', 'BUSINESS', 'SECURITY', 'UX'];

    const ruDesc1 = [
      'Пользователь больше не хочет открывать пять приложений для денег, поездок, покупок и бонусов. Банк становится точкой входа в повседневные решения.',
      'Кешбэк перестает быть случайной акцией и превращается в персональный инструмент, который помогает видеть выгоду до оплаты.',
      'Путешествие начинается не с аэропорта, а с планирования бюджета, валюты, страховки, билетов и отеля. Все это логично держать рядом с банковским счетом.',
      'Банковский маркетплейс должен быть не витриной всего подряд, а подборкой предложений, которые действительно связаны с профилем пользователя.',
      'Малому бизнесу нужен не тяжелый ERP, а понятный кабинет: карты команды, лимиты, роли, категории расходов и быстрые отчеты.',
      'Доверие к финтеху строится на понятной безопасности: вход, подтверждения, лимиты, уведомления и контроль устройств должны быть прозрачны.',
      'Персональные финансы работают лучше, когда они встроены в ежедневный интерфейс, а не спрятаны в отдельный аналитический раздел.',
    ];
    const enDesc1 = [
      'Users no longer want five separate apps for money, trips, shopping and rewards. The bank becomes the entry point for everyday decisions.',
      'Cashback stops being a random campaign and becomes a personal tool that shows value before payment.',
      'A trip starts with budget, currency, insurance, tickets and hotel planning. It makes sense to keep all of it close to the bank account.',
      'A banking marketplace should not be a shelf of everything. It should be a set of offers connected with the user profile.',
      'Small businesses do not need a heavy ERP first. They need a clear workspace: team cards, limits, roles, categories and fast reports.',
      'Fintech trust is built on understandable security: login, confirmations, limits, alerts and device control must be transparent.',
      'Personal finance works best when it is built into the daily interface instead of hidden in a separate analytics section.',
    ];

    const ruDesc2 = [
      'Pulse проектируется вокруг сценариев, а не вокруг банковских терминов.',
      'В будущем это станет основой для персональных предложений и финансовых подсказок.',
      'Так банк превращается в помощника до, во время и после поездки.',
      'Главная задача — сохранить фокус и не превратить приложение в шумный каталог.',
      'Pulse Business можно развивать как отдельный продукт внутри общей экосистемы.',
      'Безопасность должна ощущаться как контроль, а не как препятствие.',
      'Такой подход делает деньги понятнее без перегруза графиками.',
    ];
    const enDesc2 = [
      'Pulse is designed around scenarios, not banking terminology.',
      'Later this can become the base for personal offers and financial hints.',
      'This turns the bank into an assistant before, during and after a trip.',
      'The main task is to keep focus and avoid a noisy catalog.',
      'Pulse Business can grow as a separate product inside the ecosystem.',
      'Security should feel like control, not an obstacle.',
      'This approach makes money clearer without chart overload.',
    ];

    this.news = numericDates.map((date, index) => ({
      id: index + 1,
      title: { ru: ruTitles[index], en: enTitles[index] },
      date,
      type: { ru: ruTypes[index], en: enTypes[index] },
      author: authors[index],
      content: { ru: newsContentsRus[index + 1], en: newsContentsEn[index + 1] },
      desc1: { ru: ruDesc1[index], en: enDesc1[index] },
      desc2: { ru: ruDesc2[index], en: enDesc2[index] },
    }));
  }

  getNewsByLanguage(lang: 'ru' | 'en') {
    return this.news.map((newsItem) => ({
      id: newsItem.id,
      title: newsItem.title[lang],
      date: formatDate(newsItem.date, lang),
      type: newsItem.type[lang],
      author: newsItem.author,
      content: newsItem.content[lang],
      desc1: newsItem.desc1[lang],
      desc2: newsItem.desc2[lang],
    }));
  }

  getNewsById(id: number, lang: 'ru' | 'en') {
    const newsItem = this.news.find((n) => n.id === id);
    return newsItem
      ? {
          id: newsItem.id,
          title: newsItem.title[lang],
          date: formatDate(newsItem.date, lang),
          type: newsItem.type[lang],
          author: newsItem.author,
          content: newsItem.content[lang],
          desc1: newsItem.desc1[lang],
          desc2: newsItem.desc2[lang],
        }
      : undefined;
  }
}

const newsStore = new NewsStore();
export default newsStore;

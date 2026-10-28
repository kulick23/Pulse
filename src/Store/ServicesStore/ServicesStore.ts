import { makeAutoObservable } from 'mobx';
import { serviceContentsRus } from './serviceContentsRus';
import { serviceContentsEn } from './serviceContentsEn';
import service1 from '../../Assets/Services/service1.jpeg';
import service2 from '../../Assets/Services/service2.jpeg';
import service3 from '../../Assets/Services/service3.webp';
import service4 from '../../Assets/Services/service4.webp';
import service5 from '../../Assets/Services/service5.jpg';
import service6 from '../../Assets/Services/service6.webp';
import service7 from '../../Assets/Services/service7.webp';

interface Service {
  id: number;
  title: { ru: string; en: string };
  desc: { ru: string; en: string };
  image: string;
  content: { ru: string; en: string };
  typeId: number;
  titlePunkt1: { ru: string; en: string };
  titlePunkt2: { ru: string; en: string };
  titlePunkt3: { ru: string; en: string };
  subtitlePunkt1: { ru: string; en: string };
  subtitlePunkt2: { ru: string; en: string };
  subtitlePunkt3: { ru: string; en: string };
}

const serviceTypes = [
  { id: 1, ru: 'Банк', en: 'Banking' },
  { id: 2, ru: 'Лайфстайл', en: 'Lifestyle' },
  { id: 3, ru: 'Бизнес', en: 'Business' },
  { id: 4, ru: 'Инвестиции', en: 'Investing' },
];

class ServicesStore {
  services: Service[] = [];

  constructor() {
    makeAutoObservable(this);
    this.initializeServices();
  }

  private initializeServices() {
    const images = [
      service1,
      service2,
      service3,
      service4,
      service5,
      service6,
      service7,
    ];
    const typeIds = [1, 1, 2, 2, 2, 3, 4];

    const ruTitles = [
      'Карты и счета',
      'Переводы и платежи',
      'Путешествия',
      'Отели',
      'Маркетплейс',
      'Pulse Business',
      'Инвестиции и накопления',
    ];

    const enTitles = [
      'Cards and accounts',
      'Transfers and payments',
      'Travel',
      'Hotels',
      'Marketplace',
      'Pulse Business',
      'Investing and savings',
    ];

    const ruDesc = [
      'Мультивалютные счета, виртуальные карты, лимиты, кешбэк и быстрый контроль расходов.',
      'Мгновенные переводы, регулярные платежи, подписки и прозрачные комиссии в одном месте.',
      'Билеты, страховки, lounge-доступ и выгодный курс для поездок без лишних приложений.',
      'Подбор отелей, бонусы партнеров, рассрочка и оплата прямо из банковского профиля.',
      'Витрина партнерских товаров и услуг с кешбэком, рассрочкой и персональными скидками.',
      'Счета для команд, корпоративные карты, роли, лимиты и аналитика расходов бизнеса.',
      'Цели, накопительные счета, базовые инвестиционные продукты и спокойная аналитика портфеля.',
    ];

    const enDesc = [
      'Multi-currency accounts, virtual cards, limits, cashback and fast spending control.',
      'Instant transfers, recurring payments, subscriptions and transparent fees in one place.',
      'Tickets, insurance, lounge access and fair exchange rates for trips without extra apps.',
      'Hotel search, partner rewards, installments and payment from the banking profile.',
      'Partner goods and services with cashback, installments and personal discounts.',
      'Team accounts, corporate cards, roles, limits and business spending analytics.',
      'Goals, savings accounts, basic investing products and calm portfolio analytics.',
    ];

    const ruPointTitles = [
      ['Один счет для всего', 'Контроль в реальном времени', 'Персональный кешбэк'],
      ['Платежи без трения', 'Подписки под контролем', 'Прозрачные комиссии'],
      ['Поездка в одном сценарии', 'Выгодный курс', 'Бонусы для путешествий'],
      ['Отель плюс финансы', 'Гибкая оплата', 'Партнерские предложения'],
      ['Покупки с выгодой', 'Рассрочка в пару кликов', 'Рекомендации под профиль'],
      ['Финансы команды', 'Роли и лимиты', 'Отчетность без таблиц'],
      ['Цели и накопления', 'Портфель на виду', 'Риски понятным языком'],
    ];

    const enPointTitles = [
      ['One account for everything', 'Real-time control', 'Personal cashback'],
      ['Frictionless payments', 'Subscriptions under control', 'Transparent fees'],
      ['One trip flow', 'Fair exchange rate', 'Travel rewards'],
      ['Hotel plus finance', 'Flexible payment', 'Partner offers'],
      ['Shopping with benefits', 'Installments in a few clicks', 'Profile-based recommendations'],
      ['Team finance', 'Roles and limits', 'Reporting without spreadsheets'],
      ['Goals and savings', 'Portfolio overview', 'Plain-language risk'],
    ];

    const ruPointSubtitles = [
      [
        'Карты, счета и валюты собраны в одном профиле.',
        'Лимиты, заморозка карты и расходы доступны сразу.',
        'Бонусы зависят от привычек пользователя, а не от случайных акций.',
      ],
      [
        'Переводы и счета не требуют лишних подтверждений.',
        'Подписки видны заранее, вместе с датой следующего списания.',
        'Пользователь понимает стоимость операции до оплаты.',
      ],
      [
        'Билеты, страховка и деньги для поездки живут рядом.',
        'Курс и комиссии показаны до обмена.',
        'Путешествия усиливают программу лояльности.',
      ],
      [
        'Бронирование связано с картой, кешбэком и историей поездки.',
        'Оплата может быть полной, частичной или в рассрочку.',
        'Система предлагает варианты с учетом бюджета.',
      ],
      [
        'Покупки становятся частью банковской выгоды.',
        'Рассрочка понятна до оформления.',
        'Предложения подстраиваются под интересы и траты.',
      ],
      [
        'Счета, карты и операции команды видны в одном кабинете.',
        'Владелец настраивает доступы без обращения в поддержку.',
        'Отчеты собираются автоматически по категориям.',
      ],
      [
        'Накопления привязаны к конкретным целям.',
        'Пользователь видит динамику без сложных графиков.',
        'Подсказки объясняют риск простыми словами.',
      ],
    ];

    const enPointSubtitles = [
      [
        'Cards, accounts and currencies live in one profile.',
        'Limits, card freeze and spending are available instantly.',
        'Rewards follow habits instead of random campaigns.',
      ],
      [
        'Transfers and bills do not require extra steps.',
        'Subscriptions show the next charge date in advance.',
        'The user sees the operation cost before paying.',
      ],
      [
        'Tickets, insurance and trip money stay together.',
        'Rates and fees are shown before exchange.',
        'Travel activity strengthens loyalty rewards.',
      ],
      [
        'Booking is connected with card, cashback and trip history.',
        'Payment can be full, partial or split into installments.',
        'The system suggests options based on budget.',
      ],
      [
        'Shopping becomes part of banking value.',
        'Installments are clear before checkout.',
        'Offers adapt to interests and spending.',
      ],
      [
        'Team accounts, cards and operations live in one dashboard.',
        'The owner configures access without contacting support.',
        'Reports are grouped automatically by category.',
      ],
      [
        'Savings are tied to specific goals.',
        'The user sees progress without complex charts.',
        'Hints explain risk in plain language.',
      ],
    ];

    this.services = ruTitles.map((_, index) => ({
      id: index + 1,
      title: { ru: ruTitles[index], en: enTitles[index] },
      desc: { ru: ruDesc[index], en: enDesc[index] },
      image: images[index],
      content: {
        ru: serviceContentsRus[index + 1],
        en: serviceContentsEn[index + 1],
      },
      typeId: typeIds[index],
      titlePunkt1: {
        ru: ruPointTitles[index][0],
        en: enPointTitles[index][0],
      },
      titlePunkt2: {
        ru: ruPointTitles[index][1],
        en: enPointTitles[index][1],
      },
      titlePunkt3: {
        ru: ruPointTitles[index][2],
        en: enPointTitles[index][2],
      },
      subtitlePunkt1: {
        ru: ruPointSubtitles[index][0],
        en: enPointSubtitles[index][0],
      },
      subtitlePunkt2: {
        ru: ruPointSubtitles[index][1],
        en: enPointSubtitles[index][1],
      },
      subtitlePunkt3: {
        ru: ruPointSubtitles[index][2],
        en: enPointSubtitles[index][2],
      },
    }));
  }

  getServicesByLanguage(lang: 'ru' | 'en') {
    return this.services.map((service) => ({
      id: service.id,
      title: service.title[lang],
      desc: service.desc[lang],
      image: service.image,
      content: service.content[lang],
      typeId: service.typeId,
      type: serviceTypes.find((type) => type.id === service.typeId)?.[lang],
      titlePunkt1: service.titlePunkt1[lang],
      titlePunkt2: service.titlePunkt2[lang],
      titlePunkt3: service.titlePunkt3[lang],
      subtitlePunkt1: service.subtitlePunkt1[lang],
      subtitlePunkt2: service.subtitlePunkt2[lang],
      subtitlePunkt3: service.subtitlePunkt3[lang],
    }));
  }

  getServiceById(id: number, lang: 'ru' | 'en') {
    const service = this.services.find((s) => s.id === id);
    return service
      ? {
          id: service.id,
          title: service.title[lang],
          desc: service.desc[lang],
          image: service.image,
          content: service.content[lang],
          type: serviceTypes.find((type) => type.id === service.typeId)?.[lang],
          titlePunkt1: service.titlePunkt1[lang],
          titlePunkt2: service.titlePunkt2[lang],
          titlePunkt3: service.titlePunkt3[lang],
          subtitlePunkt1: service.subtitlePunkt1[lang],
          subtitlePunkt2: service.subtitlePunkt2[lang],
          subtitlePunkt3: service.subtitlePunkt3[lang],
        }
      : undefined;
  }
}

const servicesStore = new ServicesStore();
export default servicesStore;

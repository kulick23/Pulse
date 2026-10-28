import { makeAutoObservable } from 'mobx';

interface LocalizedText {
  en: string;
  ru: string;
}

interface LocalizedList {
  en: string[];
  ru: string[];
}

interface Job {
  id: number;
  city: LocalizedText;
  type: LocalizedText;
  experience: LocalizedText;
  shedule: LocalizedText;
  location: LocalizedText;
  salary: LocalizedText;
  title: LocalizedText;
  responsibilities: LocalizedList;
  requirements: LocalizedList;
  desc: LocalizedText;
  fulldesc: LocalizedText;
}

const roleMeta = {
  city: { en: 'BERLIN', ru: 'БЕРЛИН' },
  type: { en: 'HYBRID OR REMOTE', ru: 'ГИБРИД ИЛИ УДАЛЁННО' },
  experience: { en: '3+ years of experience', ru: 'Опыт от 3 лет' },
  shedule: { en: 'Full-time, flexible hours', ru: 'Полная занятость, гибкий график' },
  location: { en: 'EU time zones', ru: 'Часовые пояса Европы' },
  salary: { en: 'Based on role and experience', ru: 'По роли и уровню опыта' },
};

class JobStore {
  vacanciec: Job[] = [
    {
      id: 1,
      ...roleMeta,
      title: { en: 'ML Engineer', ru: 'ML-инженер' },
      responsibilities: {
        en: [
          'Build models for transaction categorisation and personal finance insights',
          'Develop anomaly detection signals for fraud and operational risk teams',
          'Design reliable training, validation and monitoring pipelines',
          'Turn model outputs into clear product signals and explanations',
          'Work with product and data teams on measurable experiments',
          'Improve data quality, feature stores and model observability',
          'Document model behaviour, limitations and operational decisions',
        ],
        ru: [
          'Разрабатывать модели категоризации операций и аналитики личных финансов',
          'Создавать сигналы аномалий для команд antifraud и операционных рисков',
          'Строить надёжные пайплайны обучения, валидации и мониторинга',
          'Превращать результаты моделей в понятные продуктовые сигналы',
          'Проводить измеримые эксперименты вместе с product- и data-командами',
          'Улучшать качество данных, feature store и наблюдаемость моделей',
          'Документировать поведение моделей, ограничения и решения',
        ],
      },
      requirements: {
        en: [
          'Production experience with Python and modern ML tooling',
          'Strong understanding of model evaluation and data leakage',
          'Experience with batch and near-real-time data pipelines',
          'Ability to explain technical trade-offs to product partners',
          'Attention to privacy, fairness and responsible automation',
          'Working English for an international team',
        ],
        ru: [
          'Продакшен-опыт с Python и современными ML-инструментами',
          'Понимание оценки моделей и рисков утечки данных',
          'Опыт с пакетными и near-real-time пайплайнами',
          'Умение объяснять технические компромиссы продуктовой команде',
          'Внимание к приватности, справедливости и ответственной автоматизации',
          'Рабочий английский для международной команды',
        ],
      },
      desc: {
        en: 'Develop useful and explainable machine learning for everyday financial decisions.',
        ru: 'Развивайте полезное и объяснимое машинное обучение для ежедневных финансовых решений.',
      },
      fulldesc: {
        en: 'You will own ML systems from problem framing and data quality to deployment, monitoring and product impact.',
        ru: 'Вы будете отвечать за ML-системы от постановки задачи и качества данных до запуска, мониторинга и продуктового эффекта.',
      },
    },
    {
      id: 2,
      ...roleMeta,
      title: { en: 'Engineering Lead', ru: 'Технический лидер' },
      responsibilities: {
        en: [
          'Set the technical direction for core banking journeys',
          'Lead engineers across web, backend and platform disciplines',
          'Design resilient services for accounts, cards and payments',
          'Balance delivery speed with security and regulatory constraints',
          'Improve engineering standards, reviews and incident learning',
          'Partner with product, risk and design on roadmap decisions',
          'Coach engineers and help the team hire thoughtfully',
        ],
        ru: [
          'Задавать техническое направление ключевых банковских сценариев',
          'Руководить инженерами web-, backend- и platform-направлений',
          'Проектировать устойчивые сервисы счетов, карт и платежей',
          'Балансировать скорость разработки, безопасность и требования регуляторов',
          'Улучшать инженерные стандарты, ревью и разбор инцидентов',
          'Принимать roadmap-решения вместе с product-, risk- и design-командами',
          'Развивать инженеров и участвовать в осознанном найме',
        ],
      },
      requirements: {
        en: [
          'Experience leading a product engineering team',
          'Strong distributed systems and API design fundamentals',
          'Knowledge of secure software delivery and operational resilience',
          'Confidence making architecture decisions with incomplete information',
          'Clear written and verbal communication',
          'Working English for an international team',
        ],
        ru: [
          'Опыт руководства продуктовой инженерной командой',
          'Сильная база в распределённых системах и проектировании API',
          'Знание безопасной поставки ПО и операционной устойчивости',
          'Умение принимать архитектурные решения при неполных данных',
          'Чёткая письменная и устная коммуникация',
          'Рабочий английский для международной команды',
        ],
      },
      desc: {
        en: 'Lead the engineering system behind a calm and dependable European banking experience.',
        ru: 'Возглавьте инженерную систему, на которой строится спокойный и надёжный европейский банк.',
      },
      fulldesc: {
        en: 'You will connect architecture, team development and delivery quality across the most important Pulse banking journeys.',
        ru: 'Вы свяжете архитектуру, развитие команды и качество поставки в ключевых банковских сценариях Pulse.',
      },
    },
    {
      id: 6,
      ...roleMeta,
      title: { en: 'Platform Engineer', ru: 'Platform-инженер' },
      responsibilities: {
        en: [
          'Build secure and repeatable cloud infrastructure',
          'Improve CI/CD workflows and developer self-service',
          'Own observability for customer-facing banking services',
          'Automate access controls, secrets and environment provisioning',
          'Define service reliability objectives with product teams',
          'Run incident reviews and turn findings into platform improvements',
          'Reduce operational toil through clear tooling and documentation',
        ],
        ru: [
          'Строить безопасную и воспроизводимую облачную инфраструктуру',
          'Улучшать CI/CD и self-service для разработчиков',
          'Развивать наблюдаемость клиентских банковских сервисов',
          'Автоматизировать доступы, секреты и создание окружений',
          'Определять SLO вместе с продуктовыми командами',
          'Проводить разборы инцидентов и улучшать платформу по их итогам',
          'Снижать операционную нагрузку с помощью понятных инструментов',
        ],
      },
      requirements: {
        en: [
          'Production experience with cloud infrastructure and containers',
          'Confident use of infrastructure as code',
          'Understanding of observability, networking and access control',
          'Experience supporting high-availability services',
          'A pragmatic automation and security mindset',
          'Working English for an international team',
        ],
        ru: [
          'Продакшен-опыт с облачной инфраструктурой и контейнерами',
          'Уверенная работа с infrastructure as code',
          'Понимание observability, сетей и контроля доступа',
          'Опыт поддержки высокодоступных сервисов',
          'Практичный подход к автоматизации и безопасности',
          'Рабочий английский для международной команды',
        ],
      },
      desc: {
        en: 'Create the platform that lets product teams ship secure financial services with confidence.',
        ru: 'Создавайте платформу, с которой продуктовые команды уверенно выпускают безопасные финансовые сервисы.',
      },
      fulldesc: {
        en: 'You will improve the path from code to production while keeping reliability, access and auditability visible by default.',
        ru: 'Вы улучшите путь от кода до продакшена, сохраняя надёжность, доступы и аудит прозрачными по умолчанию.',
      },
    },
    {
      id: 9,
      ...roleMeta,
      title: { en: 'Fullstack Engineer', ru: 'Fullstack-разработчик' },
      responsibilities: {
        en: [
          'Build account, card and payment journeys across web and backend',
          'Turn complex financial rules into understandable interfaces',
          'Design typed APIs and resilient client-side data flows',
          'Write focused tests for critical money movement scenarios',
          'Improve accessibility, performance and responsive behaviour',
          'Collaborate closely with product designers and domain specialists',
          'Own features through release, monitoring and iteration',
        ],
        ru: [
          'Разрабатывать сценарии счетов, карт и платежей на web и backend',
          'Превращать сложные финансовые правила в понятные интерфейсы',
          'Проектировать типизированные API и устойчивые клиентские data flow',
          'Писать точечные тесты для критичных денежных сценариев',
          'Улучшать доступность, производительность и адаптивность',
          'Тесно работать с продуктовыми дизайнерами и экспертами домена',
          'Вести функции от релиза до мониторинга и следующих итераций',
        ],
      },
      requirements: {
        en: [
          'Strong TypeScript and React experience',
          'Backend experience with Node.js or a comparable stack',
          'Understanding of API contracts, state and failure handling',
          'Care for accessibility and precise interface implementation',
          'Experience testing user journeys end to end',
          'Working English for an international team',
        ],
        ru: [
          'Сильный опыт с TypeScript и React',
          'Backend-опыт с Node.js или сопоставимым стеком',
          'Понимание API-контрактов, состояния и обработки ошибок',
          'Внимание к доступности и точной реализации интерфейсов',
          'Опыт end-to-end тестирования пользовательских сценариев',
          'Рабочий английский для международной команды',
        ],
      },
      desc: {
        en: 'Build complete financial journeys with a product team that owns the outcome together.',
        ru: 'Создавайте финансовые сценарии целиком в продуктовой команде с общей ответственностью за результат.',
      },
      fulldesc: {
        en: 'You will work across the interface and service boundary, making everyday banking fast, accessible and dependable.',
        ru: 'Вы будете работать на границе интерфейса и сервисов, делая ежедневный банкинг быстрым, доступным и надёжным.',
      },
    },
  ];

  constructor() {
    makeAutoObservable(this);
  }
}

export default new JobStore();

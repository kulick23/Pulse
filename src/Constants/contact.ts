export type ContactVariant = 'default' | 'vacancies' | 'form';

export const CONTACT_METHODS = ['email', 'telegram'] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const CONTACT_PLACEHOLDERS = {
  email: 'hello@pulsebank.dev',
  telegram: '@pulsebank',
  name: 'Danila',
  site: 'PULSEBANK.DEV',
};

export const CONTACT_TEXT_KEYS = {
  title: 'contact.title',
  name: 'contact.name',
  site: 'contact.site',
  resume: 'contact.resume',
  example: 'contact.example',
  describe: 'contact.describe',
  about: 'contact.about',
  button: 'contact.button',
  button2: 'contact.button2',
};

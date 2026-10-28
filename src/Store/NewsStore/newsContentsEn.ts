const article = (title: string, body: string) => `
  <p><strong>${title}</strong></p>
  <p>${body}</p>
  <p>Pulse uses this as a product direction: fewer extra steps, more clarity around money, payments and services built around the user.</p>
`;

export const newsContentsEn = {
  1: article(
    'Ecosystem instead of scattered sections',
    'A modern bank competes with more than rates and cards. It competes by how quickly it helps users pay, book, choose offers, understand spending and keep rewards.'
  ),
  2: article(
    'Cashback becomes personal',
    'Generic campaigns get old quickly. Users care more about value in categories where they actually spend: food, trips, subscriptions, hotels or shopping.'
  ),
  3: article(
    'Travel inside banking',
    'A trip includes money, currency, tickets, insurance, hotel and alerts. When these live in one flow, the bank becomes more than a place to store funds.'
  ),
  4: article(
    'Marketplace without noise',
    'A financial marketplace should be focused: not an endless catalog, but relevant offers, understandable installments, cashback and clear final price.'
  ),
  5: article(
    'Business workspace',
    'Team cards, roles, limits and reports are daily tools for small businesses. This workspace should be faster than spreadsheets and simpler than corporate systems.'
  ),
  6: article(
    'Understandable security',
    'Security should not feel like punishment. Good fintech explains what is happening with devices, limits, confirmations and suspicious transactions.'
  ),
  7: article(
    'Finance inside the daily interface',
    'The best hints appear where users already make decisions: payment, booking, transfer, purchase or subscription setup.'
  ),
};

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:3000';

const routes = [
  '/',
  '/services',
  '/services/1',
  '/about',
  '/job',
  '/vacancies/2',
  '/contact',
  '/news',
  '/news/7',
  '/registration',
  '/recovery',
  '/confirmation',
  '/privacy',
  '/login',
  '/profile',
  '/bank',
  '/bank/operations',
  '/bank/payments',
  '/bank/bonuses',
  '/bank/account/eur',
  '/bank/card/4821',
  '/bank/card/4821/link-account',
  '/bank/more',
  '/business',
  '/investing',
  '/mobile',
  '/insurance',
  '/travel',
  '/travel/indonesia',
  '/shop',
  '/shop/product/studio-pro',
  '/route-that-does-not-exist',
];

const results = await Promise.all(
  routes.map(async (route) => {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    const ok =
      response.ok &&
      response.headers.get('content-type')?.includes('text/html') &&
      html.includes('id="root"');
    return { route, status: response.status, ok: Boolean(ok) };
  })
);

const failed = results.filter((result) => !result.ok);
for (const result of results) {
  console.log(`${result.ok ? 'PASS' : 'FAIL'} ${result.status} ${result.route}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
}

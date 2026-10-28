# Pulse Super App: audit and redesign plan

Date: 21 October 2026

## Scope

This document records the pre-redesign audit of the existing Pulse project and the four projects in `legacy-projects`. No production UI was redesigned during this phase. The reference at `https://www.maljoy.io/` was reviewed as art direction, not as a source to copy.

## Executive summary

Pulse already contains the beginnings of a real product, especially in the banking area: accounts, cards, activity, transfer flows, rewards and settings are represented, routing works, Russian and English copy exists, and the production build succeeds. The main problem is not the absence of screens. It is that the public website, the former agency/profile code and the newer banking application still behave like three separate products.

The recommended direction is to keep React, Vite, React Router, i18next and the useful banking work, then introduce one domain-based architecture and one visual system. The public ecosystem pages can borrow Maljoy's editorial scale, flat colour fields and strong product imagery. The authenticated banking workspace should use the same identity in a denser, quieter form: light ledger surfaces, dark ink, one cobalt data accent and restrained status colours.

The first implementation milestone should be one reference-quality home screen, approved before the rest of the application is migrated.

## Current stack

- React 19, TypeScript and Vite 6.
- React Router 6 with a custom history adapter.
- i18next for Russian and English.
- Redux Toolkit and RTK Query for the former authentication/order flows.
- MobX stores for legacy news, services, jobs and cases.
- Local React state for nearly all banking interactions.
- SCSS split by page/component, with a large bank stylesheet.
- Swiper and AOS in the dependency graph.

This stack is sufficient. A framework migration would add risk without improving the product. The state layer should be simplified by domain during integration, but not rewritten in one pass.

## Existing route map

### Public ecosystem

| Route | Current purpose | Assessment |
| --- | --- | --- |
| `/` | Corporate-style Pulse home | Functional but reads as an agency/portfolio shell rather than a super app entry point. |
| `/about` | Company information | Keep, rewrite around the European fintech ecosystem and trust model. |
| `/services` | Services/ecosystem catalogue | Natural future entry to Bank, Travel, City/Shop and other verticals. |
| `/services/:id` | Service detail | Existing generic template; should become domain-aware or be replaced by real routes. |
| `/job` | Careers landing | Keep and restyle. |
| `/vacancies/:id` | Vacancy detail | Keep data-driven structure. |
| `/contact` | Contact form | Keep, modernise states and validation. |
| `/news` | News list | Keep, change to finance/ecosystem editorial content. |
| `/news/:id` | News detail | Keep. |
| `/privacy` | Privacy policy | Keep; important for fintech credibility. |

### Authentication and former profile

| Route | Current purpose | Assessment |
| --- | --- | --- |
| `/login` | Currently renders the bank/profile application directly | Route semantics are wrong; login and authenticated app need distinct shells. |
| `/registration` | Registration | Existing form flow, currently demo-backed. |
| `/confirmation` | Code confirmation | Existing form flow. |
| `/recovery` | Password recovery | Existing form flow. |
| `/profile` | Former profile area | Duplicates the bank entry concept. Should redirect or become account settings. |

### Banking workspace

| Route | Current purpose | Assessment |
| --- | --- | --- |
| `/bank` | Accounts, quick actions, rewards preview and recent activity | Best current product screen; reference screen for the first redesign. |
| `/bank/operations` | Search, filters, totals and transaction list | Functional demo, but data and filters are local and not URL-addressable. |
| `/bank/payments` | Transfers, bills, payments and requests | Many individual flows exist; validation and durable state are incomplete. |
| `/bank/bonuses` | Cashback, categories and partner offers | Visually richer, but partner data and search/filter behaviour are mostly decorative. |
| `/bank/account/:id` | Account details and actions | Reusable direction, currently hard-coded to the EUR demo account. |
| `/bank/card/:id` | Card details, limits and controls | Strong foundation for the Nike-inspired card presentation. |
| `/bank/link-account` | Link a card/account to an account | Existing flow, should become a typed step-based feature. |
| `/bank/more` | Settings, security and documents | Most rows currently lead to a generic notice. |

There are no Travel or City/Shop routes in the main app yet.

## Browser audit

The current application and all four legacy projects were run locally and inspected with Playwright at desktop and mobile widths. Evidence is stored in `.audit/`; the design inspector report is in `.taste-skill/before-bank/`.

### What already works

- The production build completes successfully.
- Banking navigation and primary detail routes render without runtime failure.
- The banking UI has coherent European demo content: EUR/GBP/USD/CHF accounts, IBAN, SEPA and partner rewards.
- Payment types open distinct screens rather than one generic modal.
- Core controls use real buttons and links in most of the newer bank code.
- Bank panels avoid large resting shadows and use a fairly restrained radius.
- Russian and English modes are available throughout the banking shell.

### Critical visual and UX problems

1. **Mobile bank layout overflows horizontally.** Account cards and reward content are clipped at 390px. The page then exposes a white band before the footer, breaking the dark application field.
2. **Everything has the same visual weight.** Accounts, search, quick actions, rewards and history are all framed by similar borders and surfaces. The balance and the next useful action do not dominate.
3. **Two unrelated design systems coexist.** The public site uses an oversized cinematic dark website language; the bank uses a dense outlined dashboard language. Typography, spacing and interaction patterns do not connect them.
4. **The palette is over-specified.** The bank stylesheet contains many near-identical dark blues, translucent cyans and ad-hoc status colours instead of semantic tokens.
5. **Generated-dashboard tells are visible.** Tinted icon squares, eyebrow labels, repeated bordered panels, radial gradients, blur and equal card grids make the bank look templated.
6. **Typography is fragmented.** The live bank renders Arial plus three Manrope faces and 16 distinct font sizes. The inspector found text as small as 8px.
7. **Navigation does not scale to the ecosystem.** Both global services and bank tabs are horizontal rows. On mobile they become a wide strip rather than a deliberate compact shell.
8. **Several controls are demonstrations rather than complete scenarios.** “All products”, More, several account actions and service navigation end in a generic notice.
9. **State is not reflected in URLs.** Transaction filters, reward categories, selected transfer flow and modal/detail state cannot be deep-linked or restored.
10. **Accessibility is inconsistent.** Some close/icon buttons lack labels, many form fields rely on visible text without `htmlFor`, decorative SVGs are not consistently hidden, focus replacement is incomplete and the app has no skip link.

### Quality gates found during the audit

- Production build: passes.
- ESLint: cannot start because `eslint.config.js` uses CommonJS syntax while the package is ESM.
- Automated tests: none found.
- Bundle: main JavaScript is about 759 kB minified and two background videos are about 25 MB and 27 MB.
- Design inspector: 5 failures and 4 warnings on `/bank`, including a gradient background, four rendered font families, text below 11px, edge spacing, strong panel borders and tinted icon chips.

## Reference analysis: Maljoy

The reference uses a warm blue-grey ground, almost-black ink, white surfaces and concentrated cobalt accents. Its character comes from proportion and content rather than effects.

- Display type is compact, heavy and tightly tracked; body type is neutral and modest.
- The first screen has a centred editorial statement and a dominant bespoke illustration rather than a generic product card.
- Navigation is a compact floating capsule, but the page sections themselves are not floating cards.
- Product areas alternate large image-led compositions, statistics and full colour fields.
- Corners and controls are intentional: large rounding appears selectively, not on every object.
- Motion is concentrated in product reveals, modal transitions and background/object transforms; it does not animate every panel.
- Colour is allocated in fields. It is not distributed as many small cyan borders and icon tiles.

### Translation to Pulse

Do not copy the Maljoy logo, mascot, product compositions or pill navigation. Reuse these principles:

- one large product statement per public screen;
- financial objects as the imagery: physical cards, receipts, travel tickets, merchant goods and currency artifacts;
- pale neutral ground with dark ink and a rare cobalt signal;
- one expressive display face for public pages and one highly readable interface face;
- large flat colour moments for product verticals, followed by quiet operational screens;
- motion reserved for transitions between real products, especially cards.

## Legacy project reports

### Indonesia: Travel foundation

**Strengths**

- Strong full-viewport hero built around a real destination image.
- Clear editorial sequencing: destination, holiday, mountain experience, culture and closing CTA.
- Good sense of photographic scale and asymmetrical text/image composition.
- Existing Indonesia photographs are immediately useful as first-party project assets.

**Weaknesses**

- Static HTML with absolute positioning and fixed pixel geometry.
- Search, cart, “read more” and CTA controls are mostly non-functional.
- Content is a single page, not a reusable destination model.
- Accessibility is weak: inputs use values as labels, image dimensions are absent and many links point to `#`.

**Integration decision**

Rebuild as React components and typed destination data, not an iframe. Keep the photography and the editorial rhythm. Indonesia becomes the first complete destination; future countries use the same route and schema.

Suggested routes: `/travel`, `/travel/:countrySlug`, `/travel/:countrySlug/:experienceSlug`.

### Beats: City/Shop foundation

**Strengths**

- Already migrated to React and split into widget/shared layers.
- Product hero, colour gallery, specifications, related products and package contents form a useful commerce narrative.
- Swiper is already available in the main app.
- The subscribe form contains basic validation and live success/error feedback.

**Weaknesses**

- Product data is minimal and repetitive; some copy is still lorem ipsum.
- Product links and cart icons use `href="#"`; no basket, quantity, variant or checkout state exists.
- The visual language is tied directly to Beats branding and one coral campaign.
- One 1,029-line global stylesheet makes reuse difficult.

**Integration decision**

Retain the product-stage compositions and image assets as a prototype category. Move data to a typed catalogue and rebuild product cards, variant selection, basket and order summary in the Pulse design system.

Suggested routes: `/city`, `/city/:categorySlug`, `/city/product/:productSlug`, `/city/cart`.

### Nike Slider: Card presentation

**Strengths**

- The core visual trick is exactly relevant: the object sits between a filled title and its outlined duplicate, producing convincing depth without WebGL.
- Transition uses one translated track and a custom easing curve.
- Large transparent product PNGs, a shadow plane and restrained floating motion create volume cheaply.
- Previous/next controls and autoplay reset are simple and understandable.

**Weaknesses**

- Autoplay does not respect reduced motion and has no pause control.
- The slider is viewport-bound and assumes fixed full-screen slides.
- No touch/swipe, keyboard handling, indicators or per-slide state.
- CSS gradient and infinite float should not be carried over literally.

**Integration decision**

Reimplement the mechanism in React as `CardShowcase`: CSS perspective, layered card artwork, transform/opacity transitions, keyboard/swipe controls and a reduced-motion mode. No Three.js is needed unless later card artwork requires true rotation on all axes.

### Energy Construction: selective reuse only

**Strengths**

- Effective large-image grid alternating photography and concise information.
- Strong visual rhythm from scale changes and white space.
- Carousel and modular project tiles can inform destination or merchant collections.

**Weaknesses**

- jQuery and Owl Carousel are obsolete in this stack.
- The content and icon font are specific to construction.
- Interaction is shallow and several links are invalid.

**Integration decision**

Do not add an energy/construction product vertical. Reuse only the composition principle: alternating image-led editorial modules, potentially in Travel stories or City merchant collections. Keep this repository intact as a legacy reference.

## Proposed architecture

```text
src/
  app/
    router/
    providers/
    layouts/
  design-system/
    tokens/
    primitives/
    patterns/
    icons/
  domains/
    bank/
      data/
      model/
      components/
      features/
      pages/
    travel/
      data/
      components/
      pages/
    city/
      data/
      cart/
      components/
      pages/
    editorial/
    careers/
  shared/
    assets/
    lib/
    types/
```

### Architectural rules

- Keep the existing stack; add no new state library during the redesign.
- Route state belongs in the URL where users should be able to return or share it.
- Domain data is typed and separated from rendering. Demo data should still reconcile: balances, totals and transactions derive from the same source.
- Shared primitives remain small: button, field, dialog, sheet, tabs, money, media and focus utilities. Product-specific blocks stay inside their domain.
- Replace the single `ProfilePage` path parser with nested bank routes and a `BankLayout` using `Outlet`.
- Lazy-load Travel, City, editorial details and heavy media routes.
- Preserve i18n from the start; do not duplicate Russian and English component trees.
- Demo actions should complete honestly with local state, validation and success/undo states instead of “function unavailable” notices.

## Proposed visual system

The recommended bank direction is an **achromatic ledger with editorial product moments**.

- Ground: cool near-white blue-grey.
- Surface: white, separated mainly by tone rather than dark borders or shadows.
- Ink: almost black navy.
- Data accent: one cobalt blue used for selected data, focus and the main action.
- Status: reserved green, red and amber only for meaning.
- Public ecosystem pages may use full cobalt, coral or destination photography as section fields, but the bank chrome stays neutral.
- App title: 22–28px; section title: 16–20px; balances: 32–48px; supporting text: 14–16px.
- Radius: 6–8px for controls/panels, 16–20px only for product objects or intentional feature surfaces.
- No decorative gradients, glass panels, emoji icons or repeated icon-in-square components.

The product's own signature should be **a pulse line derived from financial events**, used sparingly as a data marker and transition device, not as a decorative wave on every screen.

## Integration plan

### A. Stabilise the foundation

- Fix ESLint configuration and establish lint/build checks.
- Add Playwright smoke coverage for public home, bank home, transfer, card, Travel and City.
- Introduce semantic tokens and the two primary layouts.
- Split nested bank routes and extract bank demo data from components.

### B. One reference screen

- Redesign `/bank` first.
- Make total balance, account ownership and the most frequent action answer the first-screen question.
- Remove horizontal overflow and establish the mobile navigation pattern.
- Add loading, empty and error variants before approving the screen.

### C. Cards

- Build `CardShowcase` from the Nike mechanism.
- Connect selected card to card details, limits and controls.
- Verify keyboard, swipe, reduced motion and small-screen layouts.

### D. Travel

- Define the destination schema and catalogue.
- Port Indonesia photography and content into the first destination.
- Add honest source/date fields for volatile travel information instead of inventing rules or prices.

### E. City/Shop

- Define catalogue, variants, merchant and cart state.
- Port the best Beats product stage and gallery mechanics.
- Complete browse, product, basket and demo order-confirmation scenarios.

### F. Public ecosystem and remaining bank flows

- Rebuild the public home around the real verticals, not agency sections.
- Restyle About, Careers, Contact and News within the same identity.
- Replace bank notices with real local demo flows or remove controls that have no meaningful outcome.

### G. Final quality pass

- Desktop, tablet and mobile Playwright walkthroughs.
- Keyboard and screen-reader pass.
- Currency/date formatting through `Intl`.
- Bundle splitting and media compression.
- Visual regression snapshots and final build/lint/test verification.

## Approval checkpoint

Before implementation, approve or adjust these decisions:

1. Public ecosystem: editorial, image-led and more expressive.
2. Banking workspace: primarily light, neutral and ledger-like rather than the current all-dark shell.
3. Cobalt is the single shared Pulse accent; domain colours appear only in large product moments.
4. The first implemented screen is `/bank`, followed by the card showcase.
5. Energy Construction contributes composition patterns only and does not become a separate service.


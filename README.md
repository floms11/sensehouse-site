# Sense House — сайт-лендинг

Односторінковий сайт компанії **Sense House**: електрика та розумний будинок
під ключ у Кропивницькому та Кіровоградській області.

Стек: **Next.js (App Router) + TypeScript + Tailwind CSS 4**. Анімації — CSS +
IntersectionObserver (без важких бібліотек). Головна сторінка повністю
статична (SSG), інтерактив — точкові client components.

---

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
```

Продакшн:

```bash
npm run build
npm start
```

Лінтер: `npm run lint`.

## Конфігурація

Скопіюйте [.env.example](.env.example) у `.env.local` і заповніть значення.
Контакти, посилання та навігація редагуються в одному файлі:
[src/config/site.ts](src/config/site.ts).

### Форма заявок (обовʼязково налаштувати!)

Форма надсилає POST на `/api/lead` (rate limit 5 заявок / 10 хв на IP),
який пересилає заявку через адаптер
[src/lib/lead-adapter.ts](src/lib/lead-adapter.ts). Потрібен **один** канал
(перевіряються в цьому порядку):

| Змінна | Призначення |
|---|---|
| `LEAD_API_URL` + `LEAD_API_KEY` + `LEAD_API_SECRET` | **Основний**: CRM API з HMAC-SHA256-підписом, захистом від replay та idempotency — повна специфікація для боку CRM у [docs/lead-api.md](docs/lead-api.md) |
| `LEAD_WEBHOOK_URL` | Будь-який webhook: Make, n8n, Zapier… (без підпису) |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` | Заявки повідомленням у Telegram-чат |

**Поки канал не налаштовано, форма чесно повертає помилку** («Форма тимчасово
не працює…») з телефоном як запасним каналом. Фальшивого «успішно надіслано»
немає свідомо — не вмикайте його.

Захист: honeypot-поле, валідація на клієнті й сервері, блокування повторного
надсилання, обмеження довжини полів.

### Telegram-кнопка

Посилання задано: `https://t.me/sensehousecom`
(`src/config/site.ts` → `social.telegram`). Якщо значення зробити порожнім
рядком, кнопки Telegram автоматично зникнуть.

### Аналітика

Події вже розмічені по всьому сайту (`hero_cta_click`, `phone_click`,
`form_submit_success`, `scenario_change` тощо — повний перелік у
[src/lib/analytics.ts](src/lib/analytics.ts)). Скрипти GA4 / Meta Pixel
підключаються **лише** якщо задано `NEXT_PUBLIC_GA_ID` /
`NEXT_PUBLIC_META_PIXEL_ID`. Події також дублюються в `dataLayer` (GTM).

### SEO

Title/description, Open Graph, canonical — у
[src/app/layout.tsx](src/app/layout.tsx). Там же — structured data
`ProfessionalService` (телефон, `areaServed`, Instagram). `sitemap.xml` і
`robots.txt` генеруються автоматично. Перед релізом задайте
`NEXT_PUBLIC_SITE_URL` — він використовується в canonical і sitemap.

---

## Архітектура компонентів

```
src/
  config/site.ts          — контакти, навігація, геозона (єдине джерело)
  lib/
    analytics.ts          — trackEvent + типізований перелік подій
    lead-adapter.ts       — доставка заявок (webhook / Telegram)
  app/
    layout.tsx            — шрифти, metadata, JSON-LD, аналітика
    page.tsx              — композиція секцій
    globals.css           — дизайн-токени (@theme), фірмова графіка
    api/lead/route.ts     — прийом заявок (валідація, honeypot, 503 без каналу)
    icon.svg / opengraph-image.tsx / robots.ts / sitemap.ts
  components/
    Header, MobileContactBar        — навігація + контакти в один дотик
    Hero, HeroScene                 — головна сцена (авторський SVG)
    SystemsSection                  — «основа + логіка» з лінією-звʼязком
    ScenariosSection, ScenarioSwitcher — 4 життєві сценарії (tabs + сцена)
    ApproachSection                 — підхід, placeholder техпроєкту
    ProcessTimeline                 — 4 етапи на Smart Line
    TrustSection                    — принципи замість вигаданих цифр
    FinalCTA, LeadForm              — фінальний CTA + форма
    Footer, Logo
    Reveal, SectionHeading, CTAButton, ContactActions,
    SmartLine, HousePulse           — повторно використовувані примітиви
```

Дизайн-токени (палітра Deep Navy / Electric Blue / Graphite / Soft Silver /
Warm Gold, шрифти, радіуси, тіні, breakpoints) — у `@theme` блоці
[src/app/globals.css](src/app/globals.css).

Шрифти: **Manrope** (весь український текст) + **Space Grotesk** (лише
латинські display-елементи: wordmark, номери етапів — у Space Grotesk немає
кирилиці, тому для заголовків він не використовується).

Доступність: семантика, один `h1`, tabs із клавіатурною навігацією,
`aria-live` для статусів форми, видимі focus-стани, skip-link,
`prefers-reduced-motion` вимикає всі анімації.

---

## ⚠️ Відсутні матеріали (надати для заміни placeholders)

1. **Ключі CRM API** (`LEAD_API_URL`, `LEAD_API_KEY`, `LEAD_API_SECRET`) —
   сторона сайту готова, специфікація для CRM: [docs/lead-api.md](docs/lead-api.md).
   До налаштування форма повертає 503.
2. **Справжні фото обʼєктів і процесу монтажу** — фотографій фізичних робіт
   поки немає (техпроєкт уже інтегровано — див. нижче).
3. **Політика конфіденційності** — посилання у футері зʼявиться після
   надання документа (місце позначено коментарем у `Footer.tsx`).
4. **Юридичні реквізити, email, адреса** — не вигадувалися, на сайті відсутні.
5. **Google Analytics ID / Meta Pixel ID** — аналітика вимкнена до надання.

Вже надано й інтегровано:
- логотип (`logoSenseHouseV3.svg` → `Logo.tsx`, favicon, OG-image);
- домен `sense-house.com`, Telegram `@sensehousecom`;
- **реальний технічний проєкт «Власна оселя 001»**: 10 сторінок PDF
  відрендерено у WebP (`public/project/`) і показано в інтерактивному
  переглядачі (`src/components/ProjectShowcase.tsx`) у секції «Підхід».
  Щоб замінити/додати сторінки: відрендерити сторінку PDF
  (`pdftoppm -png -r 150 -f N -l N проєкт.pdf out && magick out-*.png -quality 82 public/project/назва.webp`)
  і додати запис у масив `groups` у `ProjectShowcase.tsx`.

## Використані placeholders

| Місце | Що стоїть зараз | Чим замінити |
|---|---|---|
| Hero | Авторська SVG-сцена будинку | Можна замінити/доповнити реальним фото чи відео (з poster та мобільною статикою) |
| OG-image | Генерована картка зі знаком і меседжем | За бажання — дизайнерський банер 1200×630 |

## Перевірки

- `npm run build` — збірка й типи проходять; головна сторінка статична.
- `npm run lint` — без зауважень.
- Адаптивність перевірена на 1440 / 1280 / 1024 / 768 / 430 / 390 / 360 px;
  горизонтального скролу немає.
- Форма: валідація, стани loading/success/error, honeypot, `aria-live`,
  чесна помилка без каналу доставки.
- Lighthouse (продакшн-збірка, заміряно локально):
  - **Desktop:** Performance 100 · Accessibility 100 · Best Practices 100 ·
    SEO 100 · LCP 0,6 с · CLS 0.
  - **Mobile (повне 4G-тротлінгування):** Performance 97 · Accessibility 100 ·
    Best Practices 100 · SEO 100 · LCP 2,6 с · CLS 0. LCP обмежений
    завантаженням шрифту (self-hosted, preload вже увімкнені next/font);
    на реальних пристроях значення нижче.

  Повторити перевірку:

```bash
npm run build && npm start &
npx lighthouse http://localhost:3000 --preset=desktop --view
```

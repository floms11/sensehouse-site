# Sense House — production landing

Сайт компанії **Sense House**: проєктування та реалізація електрики й
інженерних систем для приватних будинків і бізнесу у Кропивницькому та
Кіровоградській області.

Стек: **Next.js App Router + TypeScript + Tailwind CSS 4**. Головна сторінка
статична; JavaScript використовується лише для навігації, сценаріїв,
переглядача документації, reveal-ефектів і форми.

## Запуск

```bash
npm install
npm run dev
npm run lint
npm run build
npm start
```

Контакти, географія, соціальні посилання й меню зберігаються в
`src/config/site.ts`. Дизайн-токени — у `src/app/globals.css`.

## Структура

- `/` — головна: hero, рішення, перехід для бізнесу, інженерна система
  обʼєкта, процес, проєктування, контакти;
- `/dlia-biznesu` — інженерні системи для комерційних просторів;
- `/posluhy/elektromontazh-kropyvnytskyi` — електромонтаж і послуги електрика;
- `/posluhy/zamina-provodky-kropyvnytskyi` — заміна та модернізація електрики
  у квартирах і будинках;
- `/posluhy/proektuvannia-elektryky-kropyvnytskyi` — технічне проєктування;
- `/posluhy/elektroshchyty-kropyvnytskyi` — електрощити;
- `/posluhy/rozumnyi-dim-kropyvnytskyi` — розумний дім та автоматизація
  (тут живуть інтерактивні сценарії);
- `/posluhy/rezervne-zhyvlennia-kropyvnytskyi` — резервне живлення;
- `/posluhy/merezha-ta-videosposterezhennia-kropyvnytskyi` — мережа та
  відеоспостереження;
- `/privacy` — політика конфіденційності;
- `/api/lead` — серверний прийом заявок;
- `robots.txt`, `sitemap.xml`, Open Graph і JSON-LD генеруються Next.js.

Дані сторінок послуг зберігаються в `src/lib/service-pages.ts` і рендеряться
спільним шаблоном `src/components/ServiceLandingPage.tsx`.

## Форма заявок

Обовʼязкові поля: імʼя та український мобільний номер або Telegram. Короткий
опис обʼєкта необовʼязковий.

Форма має клієнтську та серверну валідацію, honeypot, rate limit, обмеження
формату й розміру запиту, блокування повторного надсилання та збереження
введених даних після помилки.

Для доставки потрібен один канал, у такому порядку:

| Змінна | Призначення |
| --- | --- |
| `LEAD_API_URL` + `LEAD_API_KEY` + `LEAD_API_SECRET` | CRM API з HMAC-підписом; контракт у `docs/lead-api.md` |
| `LEAD_WEBHOOK_URL` | Make, n8n, Zapier або інший webhook |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` | Telegram-бот компанії |

Без каналу API повертає `503`; фальшивий успіх не показується.

## Аналітика

Уся аналітика живе в `src/lib/analytics.ts`; події надсилаються лише через
`trackEvent`. GA4 і Meta Pixel підключаються тільки за наявності реальних
`NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL_ID` (це build-time змінні —
задавайте їх у середовищі production-збірки та перезбирайте сайт).

**Перегляди сторінок.** `gtag('config')` викликається з
`send_page_view: false`; один `page_view` (GA4) та `PageView` (Meta) на
кожен перегляд — перше завантаження і переходи App Router — надсилає
`<AnalyticsPageViews />`. Щоб уникнути дублювання, у налаштуваннях потоку
GA4 вимкніть у Enhanced Measurement пункт «Page changes based on browser
history events» (Зміни сторінки на основі подій історії браузера).

**Події** (усі йдуть у GA4 як custom events та в Meta як `trackCustom`):
`hero_cta_click`, `header_cta_click`, `phone_click`, `instagram_click`,
`telegram_click`, `form_start`, `form_submit`, `form_submit_success`,
`form_submit_error`, `scenario_change`, `project_page_change`,
`project_sheet_open`, `process_section_view`, `final_cta_view`.

**Конверсії.**

- `form_submit_success` — основна конверсія. Викликається лише після
  успішної відповіді `/api/lead`; додатково надсилає стандартну подію
  Meta **Lead** (один раз, не спрацьовує при помилці форми чи кліку).
- `phone_click`, `telegram_click` — допоміжні конверсії.
- У GA4 позначте ці події як ключові (Admin → Events → Mark as key
  event); Google Ads імпортує конверсії з GA4 — окремий Ads-тег на сайті
  не потрібен і не додається.

**Перевірка.** GA4: DebugView (Admin → DebugView) показує події з
локальної збірки, якщо відкрити сайт із розширенням Google Analytics
Debugger або додати `?gtm_debug=x`; має бути один `page_view` на перегляд.
Meta: Events Manager → Test Events — введіть адресу сайту та перевірте
`PageView` на переходах і одиничний `Lead` після успішної заявки.

## SEO

Title, description, canonical і Open Graph налаштовані через Metadata API.
Головна містить `WebSite`, `Organization` і `Service` JSON-LD, а сторінки
послуг — власні `Service` та `BreadcrumbList`. Канонічний домен зафіксований
у `src/config/site.ts`, щоб preview- або origin-адреса не потрапила до
canonical, sitemap чи соціальних превʼю. Видимий контент природно покриває
локальні наміри: електромонтаж, електрик, розумний дім і автоматизація у
Кропивницькому.

## Контент і матеріали

- Жодних вигаданих цифр, відгуків, кейсів, цін, строків, адрес чи гарантій.
- Hero використовує кодову архітектурну схему, а секція проєктування —
  надані WebP-фрагменти робочої документації з `public/project/`.
- Manrope використовується для всього українського тексту; Space Grotesk —
  лише для Latin display-елементів і номерів.
- Анімації реалізовані CSS + IntersectionObserver та поважають
  `prefers-reduced-motion`.

## Перед публікацією

- заповнити `.env.local` на основі `.env.example`;
- перевірити роботу реального каналу заявки;
- перевірити телефон, Telegram, Instagram і всі CTA;
- виконати `npm run lint` та `npm run build`;
- на запущеній production-збірці виконати
  `npm run seo:check -- http://127.0.0.1:3000`;
- переглянути 375, 768, 1024 і 1440px, клавіатурну навігацію та reduced
  motion.

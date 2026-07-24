# Sense House — production landing

Сайт компанії **Sense House**: проєктування та реалізація електрики й
інженерних систем для приватних будинків у Кропивницькому та Кіровоградській
області.

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

- `/` — головна: hero, рішення, процес, сценарії, проєктування, контакти;
- `/privacy` — політика конфіденційності;
- `/api/lead` — серверний прийом заявок;
- `robots.txt`, `sitemap.xml`, Open Graph і JSON-LD генеруються Next.js.

## Форма заявок

Обовʼязкові поля: імʼя, український мобільний номер або Telegram, короткий
опис обʼєкта. Площа й етап будівництва необовʼязкові.

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

Події надсилаються лише через `trackEvent` із `src/lib/analytics.ts`. GA4 і
Meta Pixel підключаються тільки за наявності реальних
`NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL_ID`.

## SEO

Title, description, canonical, Open Graph і `LocalBusiness` JSON-LD
налаштовані в `src/app/layout.tsx`. Домен береться з
`NEXT_PUBLIC_SITE_URL` і за замовчуванням дорівнює
`https://sense-house.com`.

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
- переглянути 375, 768, 1024 і 1440px, клавіатурну навігацію та reduced
  motion.

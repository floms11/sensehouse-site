# Sense House — лендинг

Next.js (App Router) + TypeScript + Tailwind CSS 4. Головна сторінка — SSG.

- Контакти/навігація/Telegram: `src/config/site.ts` (порожній telegram = кнопка прихована).
- Дизайн-токени: `@theme` у `src/app/globals.css`. Палітра: Deep Navy `#081A3A`, Electric Blue `#21B4FF`, Graphite `#1B2435`, Soft Silver `#E8EDF3`, Warm Gold `#F4C45B` (gold — максимум 5–10%, лише преміальні акценти).
- Шрифти: Manrope (весь укр. текст), Space Grotesk (лише латинські display-елементи — кирилиці в ньому немає).
- Анімації: CSS + IntersectionObserver (`Reveal`, `SmartLine`); framer-motion не додавати. Поважати `prefers-reduced-motion`.
- Форма: `/api/lead` → `src/lib/lead-adapter.ts` (LEAD_WEBHOOK_URL або Telegram-бот). Без каналу — 503; фальшивий success заборонено.
- Контентні правила: жодних вигаданих цифр, відгуків, кейсів, цін, строків, адрес. Не додавати їх у тексти.
- Аналітика: лише через `trackEvent` із `src/lib/analytics.ts`; ID — тільки з env.

Перевірки: `npm run lint`, `npm run build`. Повний контекст — у README.md.

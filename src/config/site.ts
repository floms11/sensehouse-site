/**
 * Центральна конфігурація сайту Sense House.
 *
 * Тут зібрані всі контакти, посилання та зовнішні інтеграції.
 * Порожні значення означають «ще не надано» — відповідні елементи
 * інтерфейсу автоматично приховуються (див. README, розділ
 * «Відсутні матеріали»).
 */

export const site = {
  name: "Sense House",
  tagline: "Електрика та інженерні системи під ключ",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sense-house.com",

  phone: {
    /** Формат для tel: посилань */
    e164: "+380731984918",
    /** Формат для відображення */
    display: "+380 73 198 49 18",
  },

  social: {
    instagram: "https://www.instagram.com/sense.house.krop",
    telegram: "https://t.me/sensehousecom",
  },

  geo: {
    primary: "Кропивницький",
    region: "Кіровоградська область",
    note: "Інші міста — за домовленістю.",
  },

  nav: [
    { href: "/#solutions", label: "Рішення" },
    { href: "/#process", label: "Як працюємо" },
    { href: "/#scenarios", label: "Сценарії" },
    { href: "/#design", label: "Проєктування" },
    { href: "/#contact", label: "Контакти" },
  ],
} as const;

export type Site = typeof site;

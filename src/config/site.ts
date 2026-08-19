/**
 * Центральна конфігурація сайту Sense House.
 *
 * Тут зібрані всі контакти, посилання та зовнішні інтеграції.
 * Порожні значення означають «ще не надано» — відповідні елементи
 * інтерфейсу автоматично приховуються (див. README, розділ
 * «Відсутні матеріали»).
 */

/**
 * Канонічний домен навмисно не залежить від env.
 *
 * Публічні SEO-URL не повинні змінюватися на адресу origin-сервера,
 * preview-домен або внутрішній IP через конфігурацію хостингу.
 */
const canonicalUrl = "https://sense-house.com";

export const site = {
  name: "Sense House",
  tagline: "Електрика та інженерні системи під ключ",
  url: canonicalUrl,

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
    { href: "/dlia-biznesu", label: "Для бізнесу" },
    { href: "/#process", label: "Як працюємо" },
    { href: "/#design", label: "Проєктування" },
    { href: "/#contact", label: "Контакти" },
  ],

  businessPage: {
    href: "/dlia-biznesu",
    label: "Інженерні системи для бізнесу",
  },

  servicePages: [
    {
      href: "/posluhy/elektromontazh-kropyvnytskyi",
      label: "Електромонтаж",
    },
    {
      href: "/posluhy/zamina-provodky-kropyvnytskyi",
      label: "Заміна проводки",
    },
    {
      href: "/posluhy/proektuvannia-elektryky-kropyvnytskyi",
      label: "Проєктування електрики",
    },
    {
      href: "/posluhy/elektroshchyty-kropyvnytskyi",
      label: "Електрощити",
    },
    {
      href: "/posluhy/rozumnyi-dim-kropyvnytskyi",
      label: "Розумний дім та автоматизація",
    },
    {
      href: "/posluhy/rezervne-zhyvlennia-kropyvnytskyi",
      label: "Резервне живлення",
    },
    {
      href: "/posluhy/merezha-ta-videosposterezhennia-kropyvnytskyi",
      label: "Мережа та відеоспостереження",
    },
  ],
} as const;

export type Site = typeof site;

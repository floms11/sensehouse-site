import { site } from "@/config/site";

const organizationId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;
const serviceId = `${site.url}/#service`;

const areaServed = [
  { "@type": "City", name: site.geo.primary },
  { "@type": "AdministrativeArea", name: site.geo.region },
] as const;

/**
 * Дані головної сторінки без вигаданих адрес, рейтингів, цін або графіка.
 *
 * LocalBusiness не використовується, доки немає підтвердженої адреси:
 * Google вимагає address для цього типу rich result. Organization + Service
 * коректно описують сервісну компанію, що працює у визначеному регіоні.
 */
export const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: site.url,
      name: site.name,
      inLanguage: "uk-UA",
      publisher: { "@id": organizationId },
    },
    {
      "@type": "Organization",
      "@id": organizationId,
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/icon.svg`,
      },
      image: `${site.url}/opengraph-image`,
      telephone: site.phone.e164,
      sameAs: [site.social.instagram, site.social.telegram].filter(Boolean),
      areaServed,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: site.phone.e164,
        contactType: "customer service",
        areaServed: "UA",
        availableLanguage: ["uk"],
      },
      knowsAbout: [
        "Електромонтаж",
        "Проєктування електрики",
        "Розумний дім",
        "Автоматизація будинку",
        "Монтаж електрощитів",
        "Резервне живлення",
        "Відеоспостереження",
        "Локальні мережі",
      ],
    },
    {
      "@type": "Service",
      "@id": serviceId,
      name: site.tagline,
      serviceType: [
        "Електрика під ключ",
        "Технічне проєктування",
        "Розумний дім",
        "Резервне живлення",
        "Мережа та відеоспостереження",
      ],
      description:
        "Проєктування та реалізація електрики, розумного дому й інженерних систем для приватних будинків.",
      provider: { "@id": organizationId },
      areaServed,
      audience: {
        "@type": "Audience",
        audienceType: "Власники приватних будинків",
      },
    },
  ],
} as const;

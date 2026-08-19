import { site } from "@/config/site";
import type { ServicePage } from "@/lib/service-pages";

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
        "Контроль доступу",
        "Інженерні системи для бізнесу",
      ],
    },
    {
      "@type": "Service",
      "@id": serviceId,
      name: site.tagline,
      serviceType: [
        "Електромонтаж під ключ",
        "Послуги електрика",
        "Технічне проєктування",
        "Розумний дім",
        "Автоматизація будинку",
        "Резервне живлення",
        "Мережа та відеоспостереження",
      ],
      description:
        "Проєктування та реалізація електрики й інженерних систем для приватних будинків і комерційних обʼєктів.",
      provider: { "@id": organizationId },
      areaServed,
      audience: {
        "@type": "Audience",
        audienceType: "Власники приватних будинків і комерційних обʼєктів",
      },
    },
  ],
} as const;

export function createServiceStructuredData(page: ServicePage) {
  const pageUrl = `${site.url}/posluhy/${page.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}/#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Головна",
            item: site.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.title,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: site.name,
        url: site.url,
        logo: `${site.url}/icon.svg`,
        telephone: site.phone.e164,
        sameAs: [site.social.instagram, site.social.telegram].filter(Boolean),
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}/#service`,
        url: pageUrl,
        name: page.title,
        serviceType: page.serviceTypes,
        description: page.metaDescription,
        provider: { "@id": organizationId },
        areaServed,
        audience: {
          "@type": "Audience",
          audienceType: "Власники приватних будинків і комерційних обʼєктів",
        },
      },
    ],
  } as const;
}

/** Структуровані дані сторінки «Для бізнесу»: Service + BreadcrumbList. */
export function createBusinessStructuredData() {
  const pageUrl = `${site.url}/dlia-biznesu`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}/#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Головна",
            item: site.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Інженерні системи для бізнесу",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: site.name,
        url: site.url,
        logo: `${site.url}/icon.svg`,
        telephone: site.phone.e164,
        sameAs: [site.social.instagram, site.social.telegram].filter(Boolean),
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}/#service`,
        url: pageUrl,
        name: "Інженерні системи для бізнесу",
        serviceType: [
          "Електрика для комерційних приміщень",
          "Розподіл живлення та електрощити",
          "Освітлення комерційних просторів",
          "Резервне живлення для бізнесу",
          "Мережа та Wi‑Fi",
          "Відеоспостереження",
          "Контроль доступу",
          "Автоматизація комерційних обʼєктів",
        ],
        description:
          "Проєктування та реалізація електрики, освітлення, резервного живлення, мережі, безпеки й автоматизації для комерційних просторів.",
        provider: { "@id": organizationId },
        areaServed,
        audience: {
          "@type": "BusinessAudience",
          audienceType: "Власники та керівники бізнесу",
        },
      },
    ],
  } as const;
}

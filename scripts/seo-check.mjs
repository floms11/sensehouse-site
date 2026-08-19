const auditBaseUrl = new URL(
  process.argv[2] ?? process.env.SEO_AUDIT_URL ?? "http://127.0.0.1:3000",
);
const canonicalOrigin = "https://sense-house.com";
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function attributes(tag) {
  return Object.fromEntries(
    Array.from(tag.matchAll(/([:\w-]+)=["']([^"']*)["']/g), (match) => [
      match[1].toLowerCase(),
      match[2],
    ]),
  );
}

function tags(html, tagName) {
  return Array.from(
    html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi")),
    (match) => attributes(match[0]),
  );
}

function metaContent(html, attribute, value) {
  return tags(html, "meta").find((meta) => meta[attribute] === value)?.content;
}

function canonical(html) {
  return tags(html, "link").find((link) =>
    link.rel?.split(/\s+/).includes("canonical"),
  )?.href;
}

function mainText(html) {
  return mainHtml(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mainHtml(html) {
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
}

function footerHtml(html) {
  return html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/i)?.[1] ?? "";
}

async function read(pathname) {
  const response = await fetch(new URL(pathname, auditBaseUrl), {
    redirect: "manual",
  });
  return {
    response,
    text: await response.text(),
  };
}

const home = await read("/");
check(home.response.status === 200, `Головна повернула ${home.response.status}`);
check(
  canonical(home.text) === canonicalOrigin,
  `Некоректний canonical головної: ${canonical(home.text) ?? "відсутній"}`,
);
check(
  metaContent(home.text, "property", "og:url") === canonicalOrigin,
  "og:url не збігається з canonical",
);
check(
  metaContent(home.text, "property", "og:image")?.startsWith(canonicalOrigin),
  "og:image не використовує публічний домен",
);
check(
  metaContent(home.text, "name", "twitter:image")?.startsWith(canonicalOrigin),
  "twitter:image не використовує публічний домен",
);
check(
  metaContent(home.text, "name", "robots")?.includes("index"),
  "Головна не дозволяє індексацію",
);
check(
  (home.text.match(/<h1\b/gi) ?? []).length === 1,
  "На головній має бути рівно один H1",
);
check(
  !metaContent(home.text, "name", "keywords"),
  "Застарілий meta keywords не видалено",
);
check(
  !/(?<!\p{L})електрик(?!\p{L})/iu.test(mainText(home.text)),
  "На головній у видимому тексті використано слово «електрик»",
);

const jsonLdBlocks = Array.from(
  home.text.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  ),
  (match) => JSON.parse(match[1]),
);
const graphTypes = jsonLdBlocks.flatMap((block) =>
  (block["@graph"] ?? [block]).flatMap((node) => node["@type"] ?? []),
);
for (const type of ["WebSite", "Organization", "Service"]) {
  check(graphTypes.includes(type), `У JSON-LD відсутній тип ${type}`);
}

const servicePages = [
  {
    path: "/posluhy/elektromontazh-kropyvnytskyi",
    terms: ["електромонтаж", "електрик", "квартир", "Кропивницьк"],
  },
  {
    path: "/posluhy/zamina-provodky-kropyvnytskyi",
    terms: ["заміна", "проводк", "квартир", "Кропивницьк"],
    // Немає власної картки на головній — доступна з футера та суміжних послуг
    homeCard: false,
  },
  {
    path: "/posluhy/proektuvannia-elektryky-kropyvnytskyi",
    terms: ["проєктування електрики", "Кропивницьк"],
  },
  {
    path: "/posluhy/elektroshchyty-kropyvnytskyi",
    terms: ["електрощит", "Кропивницьк"],
  },
  {
    path: "/posluhy/rozumnyi-dim-kropyvnytskyi",
    terms: ["розумний дім", "розумний будинок", "автоматизац", "Кропивницьк"],
  },
  {
    path: "/posluhy/rezervne-zhyvlennia-kropyvnytskyi",
    terms: ["резервне живлення", "Кропивницьк"],
  },
  {
    path: "/posluhy/merezha-ta-videosposterezhennia-kropyvnytskyi",
    terms: ["мереж", "відеоспостереження", "Кропивницьк"],
  },
];
const businessPath = "/dlia-biznesu";

// Картки секції «Рішення» ведуть на сторінки послуг просто з головної.
for (const servicePage of servicePages) {
  if (servicePage.homeCard === false) continue;
  check(
    mainHtml(home.text).includes(`href="${servicePage.path}"`),
    `У секції рішень головної немає посилання ${servicePage.path}`,
  );
}
check(
  mainHtml(home.text).includes(`href="${businessPath}"`),
  `На головній немає переходу на ${businessPath}`,
);
for (const servicePage of servicePages) {
  check(
    footerHtml(home.text).includes(`href="${servicePage.path}"`),
    `У футері головної немає посилання ${servicePage.path}`,
  );
}

for (const servicePage of servicePages) {
  const page = await read(servicePage.path);
  const expectedCanonical = `${canonicalOrigin}${servicePage.path}`;

  check(
    page.response.status === 200,
    `${servicePage.path} повернула ${page.response.status}`,
  );
  check(
    canonical(page.text) === expectedCanonical,
    `Некоректний canonical ${servicePage.path}`,
  );
  check(
    metaContent(page.text, "property", "og:url") === expectedCanonical,
    `Некоректний og:url ${servicePage.path}`,
  );
  check(
    (page.text.match(/<h1\b/gi) ?? []).length === 1,
    `На ${servicePage.path} має бути рівно один H1`,
  );
  check(
    !metaContent(page.text, "name", "keywords"),
    `${servicePage.path} містить застарілий meta keywords`,
  );
  check(
    !/(?<!\p{L})електрик(?!\p{L})/iu.test(mainText(page.text)),
    `${servicePage.path} містить слово «електрик» у видимому тексті`,
  );
  for (const linkedPage of servicePages) {
    check(
      footerHtml(page.text).includes(`href="${linkedPage.path}"`),
      `У футері ${servicePage.path} немає посилання ${linkedPage.path}`,
    );
  }

  const normalizedHtml = page.text.toLocaleLowerCase("uk");
  for (const term of servicePage.terms) {
    check(
      normalizedHtml.includes(term.toLocaleLowerCase("uk")),
      `${servicePage.path} не містить цільовий термін «${term}»`,
    );
  }

  const serviceJsonLd = Array.from(
    page.text.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
    (match) => JSON.parse(match[1]),
  ).flatMap((block) => block["@graph"] ?? [block]);
  check(
    serviceJsonLd.some((node) => node["@type"] === "Service"),
    `${servicePage.path} не містить Service JSON-LD`,
  );
  check(
    serviceJsonLd.some((node) => node["@type"] === "BreadcrumbList"),
    `${servicePage.path} не містить BreadcrumbList JSON-LD`,
  );
}

const business = await read(businessPath);
const businessCanonical = `${canonicalOrigin}${businessPath}`;
check(
  business.response.status === 200,
  `${businessPath} повернула ${business.response.status}`,
);
check(
  canonical(business.text) === businessCanonical,
  `Некоректний canonical ${businessPath}`,
);
check(
  metaContent(business.text, "property", "og:url") === businessCanonical,
  `Некоректний og:url ${businessPath}`,
);
check(
  (business.text.match(/<h1\b/gi) ?? []).length === 1,
  `На ${businessPath} має бути рівно один H1`,
);
check(
  !/(?<!\p{L})електрик(?!\p{L})/iu.test(mainText(business.text)),
  `${businessPath} містить слово «електрик» у видимому тексті`,
);
const businessNormalizedHtml = business.text.toLocaleLowerCase("uk");
for (const term of ["для бізнесу", "кропивницьк"]) {
  check(
    businessNormalizedHtml.includes(term),
    `${businessPath} не містить цільовий термін «${term}»`,
  );
}
for (const servicePage of servicePages) {
  check(
    mainHtml(business.text).includes(`href="${servicePage.path}"`),
    `${businessPath} не посилається на ${servicePage.path}`,
  );
}
const businessJsonLd = Array.from(
  business.text.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  ),
  (match) => JSON.parse(match[1]),
).flatMap((block) => block["@graph"] ?? [block]);
check(
  businessJsonLd.some((node) => node["@type"] === "Service"),
  `${businessPath} не містить Service JSON-LD`,
);
check(
  businessJsonLd.some((node) => node["@type"] === "BreadcrumbList"),
  `${businessPath} не містить BreadcrumbList JSON-LD`,
);

const robots = await read("/robots.txt");
check(robots.response.status === 200, `robots.txt повернув ${robots.response.status}`);
check(
  robots.text.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`),
  "robots.txt містить некоректний sitemap URL",
);
check(robots.text.includes("Disallow: /api/"), "robots.txt не закриває /api/");

const sitemap = await read("/sitemap.xml");
check(sitemap.response.status === 200, `sitemap.xml повернув ${sitemap.response.status}`);
check(
  sitemap.text.includes(`<loc>${canonicalOrigin}</loc>`),
  "У sitemap немає canonical URL головної",
);
for (const servicePage of servicePages) {
  check(
    sitemap.text.includes(
      `<loc>${canonicalOrigin}${servicePage.path}</loc>`,
    ),
    `У sitemap немає ${servicePage.path}`,
  );
}
check(
  sitemap.text.includes(`<loc>${canonicalOrigin}${businessPath}</loc>`),
  `У sitemap немає ${businessPath}`,
);
check(
  !/(?:localhost|127\.0\.0\.1|192\.168\.|<priority>|<changefreq>|<lastmod>)/i.test(
    sitemap.text,
  ),
  "Sitemap містить внутрішній URL або недостовірні службові поля",
);

const privacy = await read("/privacy");
check(
  privacy.response.status === 200,
  `Сторінка privacy повернула ${privacy.response.status}`,
);
check(
  canonical(privacy.text) === `${canonicalOrigin}/privacy`,
  "Некоректний canonical сторінки privacy",
);
check(
  metaContent(privacy.text, "name", "robots")?.includes("noindex"),
  "Службова сторінка privacy повинна мати noindex",
);

if (failures.length > 0) {
  console.error("SEO-перевірка не пройдена:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`SEO-перевірка пройдена: ${auditBaseUrl.origin}`);
}

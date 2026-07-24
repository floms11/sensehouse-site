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

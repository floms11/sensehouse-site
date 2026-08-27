/**
 * Аналітична розмітка.
 *
 * Події надсилаються в усі підключені системи (GA4 через gtag,
 * Meta Pixel через fbq, dataLayer для GTM). Якщо жодна система
 * не підключена, виклики нічого не роблять — фіктивні ID не
 * використовуються. ID задаються через змінні середовища:
 *
 *   NEXT_PUBLIC_GA_ID          — Google Analytics 4
 *   NEXT_PUBLIC_META_PIXEL_ID  — Meta Pixel
 *
 * Ініціалізація gtag/fbq виконується тут (а не інлайн-скриптами),
 * щоб команди завжди потрапляли у чергу в правильному порядку:
 * js → config → події. Зовнішні скрипти лише «підхоплюють» чергу.
 *
 * page_view / PageView:
 *  - config викликається із send_page_view: false;
 *  - кожен перегляд (перше завантаження і переходи App Router)
 *    надсилає <AnalyticsPageViews /> через trackPageView() —
 *    рівно один раз на URL, без дублювання.
 *
 * Конверсії:
 *  - form_submit_success — основна конверсія. Викликається лише
 *    після успішної відповіді /api/lead і додатково надсилає
 *    стандартну подію Meta «Lead»;
 *  - phone_click і telegram_click — допоміжні конверсії
 *    (позначаються ключовими подіями в інтерфейсі GA4);
 *  - решта подій — звичайна аналітика. Google Ads імпортує
 *    конверсії з GA4, окремий Ads-тег не потрібен.
 */

export type AnalyticsEvent =
  | "hero_cta_click"
  | "header_cta_click"
  | "phone_click"
  | "instagram_click"
  | "telegram_click"
  | "form_start"
  | "form_submit"
  | "form_submit_success"
  | "form_submit_error"
  | "scenario_change"
  | "project_page_change"
  | "project_sheet_open"
  | "process_section_view"
  | "final_cta_view";

type EventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

let gaInitialized = false;
let metaInitialized = false;

/**
 * Готує gtag до роботи: створює dataLayer і функцію-чергу та один раз
 * викликає js/config. Повертає false, якщо GA_ID не задано.
 */
function ensureGtag(): boolean {
  if (!GA_ID || typeof window === "undefined") return false;

  window.dataLayer = window.dataLayer ?? [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // gtag.js очікує саме об'єкт arguments, а не масив.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }
  if (!gaInitialized) {
    gaInitialized = true;
    window.gtag("js", new Date());
    // page_view надсилається вручну з trackPageView, щоб перше
    // завантаження і переходи App Router рахувалися однаково.
    window.gtag("config", GA_ID, { send_page_view: false });
  }
  return true;
}

/**
 * Готує fbq до роботи: створює стандартну функцію-чергу Meta Pixel
 * і один раз викликає init. Повертає false, якщо ID не задано.
 */
function ensureMetaPixel(): boolean {
  if (!META_PIXEL_ID || typeof window === "undefined") return false;

  if (!window.fbq) {
    type FbqStub = ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[];
      push: unknown;
      loaded: boolean;
      version: string;
    };
    const stub = function fbqStub() {
      // fbevents.js очікує саме об'єкт arguments у черзі.
      // eslint-disable-next-line prefer-rest-params
      const args = arguments;
      if (stub.callMethod) {
        stub.callMethod(...Array.from(args));
      } else {
        stub.queue.push(args);
      }
    } as FbqStub;
    stub.push = stub;
    stub.loaded = true;
    stub.version = "2.0";
    stub.queue = [];
    window.fbq = stub;
    if (!window._fbq) window._fbq = stub;
  }
  if (!metaInitialized) {
    metaInitialized = true;
    window.fbq("init", META_PIXEL_ID);
  }
  return true;
}

/**
 * Один перегляд сторінки: GA4 page_view + Meta PageView.
 * Викликається лише з <AnalyticsPageViews />, який гарантує
 * один виклик на кожен URL.
 */
export function trackPageView() {
  if (typeof window === "undefined") return;

  try {
    if (ensureGtag()) {
      window.gtag?.("event", "page_view", {
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title,
      });
    }
    if (ensureMetaPixel()) {
      window.fbq?.("track", "PageView");
    }
  } catch {
    // Аналітика ніколи не повинна ламати інтерфейс.
  }
}

export function trackEvent(event: AnalyticsEvent, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  try {
    window.dataLayer?.push({ event, ...params });
    if (ensureGtag()) {
      window.gtag?.("event", event, params);
    }
    if (ensureMetaPixel()) {
      window.fbq?.("trackCustom", event, params);
      // Стандартна конверсія Meta — лише після успішної відповіді
      // /api/lead (form_submit_success викликається один раз на
      // успішне надсилання форми, тому Lead не дублюється).
      if (event === "form_submit_success") {
        window.fbq?.("track", "Lead");
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event, params);
    }
  } catch {
    // Аналітика ніколи не повинна ламати інтерфейс.
  }
}

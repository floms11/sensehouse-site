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
  | "process_section_view"
  | "final_cta_view";

type EventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  try {
    window.dataLayer?.push({ event, ...params });
    window.gtag?.("event", event, params);
    window.fbq?.("trackCustom", event, params);

    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event, params);
    }
  } catch {
    // Аналітика ніколи не повинна ламати інтерфейс.
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

/**
 * Один page_view (GA4) та PageView (Meta Pixel) на кожен перегляд:
 * перше завантаження і клієнтські переходи App Router.
 *
 * Ref захищає від дублювання: повторний рендер із тим самим pathname
 * (зокрема подвійний ефект у StrictMode та hash-навігація в межах
 * сторінки) не надсилає повторної події.
 */
export default function AnalyticsPageViews() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastTracked.current === pathname) return;
    lastTracked.current = pathname;
    trackPageView();
  }, [pathname]);

  return null;
}

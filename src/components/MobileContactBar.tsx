"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

/**
 * Sticky contact bar для мобільних: телефон, заявка, Telegram.
 * Зʼявляється після першого екрана, ховається біля фінальної форми,
 * щоб не перекривати її.
 */
export default function MobileContactBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");

    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.8;
      const nearForm = contact
        ? contact.getBoundingClientRect().top < window.innerHeight * 0.7
        : false;
      setVisible(pastHero && !nearForm);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-4 bottom-4 z-40 transition-[opacity,translate] duration-500 lg:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch gap-2 rounded-2xl border border-silver/15 bg-navy-deep/90 p-2 shadow-card backdrop-blur-md">
        <a
          href={`tel:${site.phone.e164}`}
          onClick={() => trackEvent("phone_click", { placement: "sticky_bar" })}
          aria-label={`Зателефонувати: ${site.phone.display}`}
          className="inline-flex min-h-12 flex-none items-center justify-center rounded-xl border border-silver/20 px-4 text-silver"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
            <path
              d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a
          href="#contact"
          onClick={() => trackEvent("header_cta_click", { placement: "sticky_bar" })}
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-blue px-4 text-[0.95rem] font-semibold text-navy-deep"
        >
          Обговорити проєкт
        </a>
        {site.social.telegram && (
          <a
          href={site.social.telegram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("telegram_click", { placement: "sticky_bar" })}
          aria-label="Написати Sense House у Telegram"
          className="inline-flex min-h-12 flex-none items-center justify-center rounded-xl border border-silver/20 px-4 text-silver"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
            <path
              d="m4 11.2 15-6.1c.7-.3 1.3.4 1 1.1l-5.1 13.1c-.2.6-1 .7-1.4.3l-3.2-3-2 1.9.3-3.7 7.6-6.1-9.4 5-2.9-1.2c-.7-.3-.7-1 0-1.3Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        )}
      </div>
    </div>
  );
}

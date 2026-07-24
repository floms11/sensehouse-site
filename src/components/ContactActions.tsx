"use client";

import { site } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

type ContactActionsProps = {
  /** compact — тільки іконки (header), full — з підписами */
  layout?: "compact" | "full";
  className?: string;
};

const iconCls = "size-5 shrink-0";

function PhoneIcon() {
  return (
    <svg className={iconCls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className={iconCls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className={iconCls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m21 4-3 15.5-6.6-4.8L8 19l-.6-5L20 5.5 6.5 12.6 3 11.4 21 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Контактні дії: телефон, Instagram і Telegram (останній —
 * лише якщо в конфігурації задано справжній URL).
 */
export default function ContactActions({
  layout = "full",
  className = "",
}: ContactActionsProps) {
  const compact = layout === "compact";

  const linkCls = compact
    ? "inline-flex size-11 items-center justify-center rounded-full border border-silver/20 text-silver-dim transition-colors hover:border-blue/60 hover:text-blue-soft"
    : "inline-flex min-h-11 items-center gap-3 text-silver transition-colors hover:text-blue-soft";

  return (
    <ul className={`flex ${compact ? "gap-2" : "flex-col gap-4"} ${className}`}>
      <li>
        <a
          href={`tel:${site.phone.e164}`}
          className={linkCls}
          onClick={() => trackEvent("phone_click", { placement: layout })}
          aria-label={`Зателефонувати: ${site.phone.display}`}
        >
          <PhoneIcon />
          {!compact && <span className="font-medium">{site.phone.display}</span>}
        </a>
      </li>
      <li>
        <a
          href={site.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={linkCls}
          onClick={() => trackEvent("instagram_click", { placement: layout })}
          aria-label="Instagram Sense House"
        >
          <InstagramIcon />
          {!compact && <span className="font-medium">Instagram</span>}
        </a>
      </li>
      {site.social.telegram && (
        <li>
          <a
            href={site.social.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
            onClick={() => trackEvent("telegram_click", { placement: layout })}
            aria-label="Telegram Sense House"
          >
            <TelegramIcon />
            {!compact && <span className="font-medium">Telegram</span>}
          </a>
        </li>
      )}
    </ul>
  );
}

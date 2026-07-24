import { createHmac, randomUUID } from "node:crypto";

/**
 * Адаптер доставки заявок.
 *
 * Канали (перевіряються по черзі, використовується перший налаштований):
 *
 * 1. CRM API (основний): LEAD_API_URL + LEAD_API_KEY + LEAD_API_SECRET.
 *    Підписаний HMAC-SHA256 запит — повна специфікація для боку CRM:
 *    docs/lead-api.md. Секрети живуть тільки на сервері (route handler),
 *    у браузер не потрапляють.
 *
 * 2. LEAD_WEBHOOK_URL — довільний webhook (Make, n8n, Zapier…), без підпису.
 *
 * 3. TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID — Telegram-бот компанії.
 *
 * Якщо не налаштовано жодного каналу, forwardLead повертає
 * { ok: false, reason: "not_configured" } — API відповість 503 і
 * користувач побачить чесне повідомлення з телефоном.
 */

export type LeadPayload = {
  name: string;
  phone: string;
  objectType: string;
  area: string;
  stage: string;
  comment: string;
  contactMethod: string;
};

export type ForwardResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "delivery_failed" };

const REQUEST_TIMEOUT_MS = 10_000;

/** POST на CRM API з HMAC-підписом; одна повторна спроба на 5xx/мережу. */
async function sendToCrm(
  lead: LeadPayload,
  url: string,
  apiKey: string,
  secret: string,
): Promise<ForwardResult> {
  const body = JSON.stringify({
    source: "sense-house.com",
    submittedAt: new Date().toISOString(),
    lead,
  });

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const idempotencyKey = randomUUID();
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${idempotencyKey}.${body}`)
    .digest("hex");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "X-Timestamp": timestamp,
    "X-Idempotency-Key": idempotencyKey,
    "X-Signature": `sha256=${signature}`,
  };

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      // 409 = дублікат idempotency key: заявка вже прийнята раніше
      if (res.ok || res.status === 409) return { ok: true };

      // 4xx (крім 429) повторювати немає сенсу — проблема в запиті/ключах
      if (res.status < 500 && res.status !== 429) {
        console.error(`[lead-adapter] CRM відхилила заявку: ${res.status}`);
        return { ok: false, reason: "delivery_failed" };
      }
    } catch (error) {
      if (attempt === 1) {
        console.error("[lead-adapter] CRM недоступна:", error);
        return { ok: false, reason: "delivery_failed" };
      }
    }
    // коротка пауза перед повтором
    await new Promise((r) => setTimeout(r, 800));
  }

  return { ok: false, reason: "delivery_failed" };
}

function formatTelegramMessage(lead: LeadPayload): string {
  const lines = [
    "🔔 Нова заявка з сайту Sense House",
    "",
    `Імʼя: ${lead.name}`,
    `Контакт: ${lead.phone}`,
    `Тип обʼєкта: ${lead.objectType}`,
  ];
  if (lead.area) lines.push(`Площа: ${lead.area} м²`);
  if (lead.stage) lines.push(`Етап: ${lead.stage}`);
  if (lead.contactMethod) lines.push(`Звʼязок: ${lead.contactMethod}`);
  if (lead.comment) lines.push("", `Коментар: ${lead.comment}`);
  return lines.join("\n");
}

export async function forwardLead(lead: LeadPayload): Promise<ForwardResult> {
  const crmUrl = process.env.LEAD_API_URL;
  const crmKey = process.env.LEAD_API_KEY;
  const crmSecret = process.env.LEAD_API_SECRET;
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;

  if (crmUrl && crmKey && crmSecret) {
    return sendToCrm(lead, crmUrl, crmKey, crmSecret);
  }

  try {
    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "sense-house-site", ...lead }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      return res.ok ? { ok: true } : { ok: false, reason: "delivery_failed" };
    }

    if (tgToken && tgChatId) {
      const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: formatTelegramMessage(lead),
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      return res.ok ? { ok: true } : { ok: false, reason: "delivery_failed" };
    }
  } catch (error) {
    console.error("[lead-adapter] delivery failed:", error);
    return { ok: false, reason: "delivery_failed" };
  }

  console.warn(
    "[lead-adapter] Жоден канал доставки не налаштовано. " +
      "Задайте LEAD_API_URL + LEAD_API_KEY + LEAD_API_SECRET (див. docs/lead-api.md).",
  );
  return { ok: false, reason: "not_configured" };
}

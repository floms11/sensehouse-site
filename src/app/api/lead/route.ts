import { NextResponse } from "next/server";
import { forwardLead, type LeadPayload } from "@/lib/lead-adapter";
import { isValidUkrainianMobilePhone } from "@/lib/contact-validation";

/**
 * Прийом заявок з форми.
 *
 * Заявка пересилається через адаптер (src/lib/lead-adapter.ts) у
 * налаштований канал: webhook/CRM або Telegram-бот. Якщо жоден канал
 * не налаштовано, повертаємо 503 — користувач НЕ побачить фальшивого
 * «успішно надіслано». Налаштування — див. README та .env.example.
 */
/**
 * Мʼякий rate limit по IP: 5 заявок за 10 хвилин.
 * In-memory: на serverless-платформах діє в межах одного інстансу —
 * як перша лінія захисту цього достатньо; жорсткий ліміт — на боці CRM
 * (див. docs/lead-api.md).
 */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // не даємо мапі рости безмежно
  if (hits.size > 10_000) hits.clear();
  return false;
}

function isValidContact(value: string): boolean {
  if (/^@[A-Za-z0-9_]{3,64}$/.test(value)) return true;
  return isValidUkrainianMobilePhone(value);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ message: "Некоректний формат запиту." }, { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > 16_384) {
    return NextResponse.json({ message: "Запит завеликий." }, { status: 413 });
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) {
    return NextResponse.json({ message: "Запит відхилено." }, { status: 403 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Забагато спроб. Спробуйте за кілька хвилин або зателефонуйте нам." },
      { status: 429 },
    );
  }

  let body: Partial<LeadPayload> & { company?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Некоректний запит." }, { status: 400 });
  }

  // Honeypot: боти заповнюють приховане поле. Відповідаємо 200,
  // щоб не підказувати боту, що його виявлено, але нічого не пересилаємо.
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const objectType = String(body.objectType ?? "").trim();
  const comment = String(body.comment ?? "").trim();
  const area = String(body.area ?? "").trim();

  if (
    name.length < 2 ||
    name.length > 200 ||
    !isValidContact(phone) ||
    comment.length < 8 ||
    comment.length > 2000 ||
    (area && !/^\d{1,5}$/.test(area))
  ) {
    return NextResponse.json(
      {
        message:
          "Перевірте імʼя, контакт, опис обʼєкта та необовʼязкову площу.",
      },
      { status: 422 },
    );
  }

  const lead: LeadPayload = {
    name: name.slice(0, 200),
    phone: phone.slice(0, 100),
    objectType: objectType.slice(0, 100),
    area,
    stage: String(body.stage ?? "").slice(0, 100),
    comment,
    contactMethod: String(body.contactMethod ?? "").slice(0, 50),
  };

  const result = await forwardLead(lead);

  if (result.ok) {
    return NextResponse.json({ ok: true });
  }

  if (result.reason === "not_configured") {
    return NextResponse.json(
      {
        message:
          "Форма тимчасово не працює. Дані збережено у формі — зателефонуйте нам або напишіть у Telegram.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      message:
        "Не вдалося передати заявку. Спробуйте ще раз або зателефонуйте нам.",
    },
    { status: 502 },
  );
}

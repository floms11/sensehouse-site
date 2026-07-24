"use client";

import { useRef, useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import { site } from "@/config/site";

const objectTypes = ["Приватний будинок", "Квартира", "Бізнес-приміщення", "Інше"];

const stages = [
  "Планування",
  "Є дизайн-проєкт",
  "Починається ремонт",
  "Уже триває електромонтаж",
  "Частина робіт уже виконана",
];

const contactMethods = ["Телефон", "Telegram", "Viber", "WhatsApp"];

type Status = "idle" | "loading" | "success" | "error";

type FieldErrors = Partial<Record<"name" | "phone" | "objectType", string>>;

/** Дуже мʼяка перевірка телефону/месенджера: цифри, +, пробіли, дужки, дефіси або @нікнейм */
function validatePhone(value: string): boolean {
  const trimmed = value.trim();
  if (/^@[\w.]{3,}$/.test(trimmed)) return true;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15 && /^[+\d\s()-]+$/.test(trimmed);
}

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverMessage, setServerMessage] = useState("");
  const startedRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onFirstInteraction = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("form_start");
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return; // захист від повторного надсилання

    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const objectType = String(data.get("objectType") ?? "");

    const nextErrors: FieldErrors = {};
    if (name.length < 2) nextErrors.name = "Вкажіть, як до вас звертатися.";
    if (!validatePhone(phone))
      nextErrors.phone = "Вкажіть номер телефону (напр. +380 …) або @нікнейм.";
    if (!objectType) nextErrors.objectType = "Оберіть тип обʼєкта.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const fieldIds: Record<keyof FieldErrors, string> = {
        name: "lead-name",
        phone: "lead-phone",
        objectType: "lead-object",
      };
      const firstKey = (["name", "phone", "objectType"] as const).find(
        (key) => nextErrors[key],
      );
      if (firstKey) document.getElementById(fieldIds[firstKey])?.focus();
      return;
    }

    setStatus("loading");
    setServerMessage("");
    trackEvent("form_submit");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          objectType,
          area: String(data.get("area") ?? "").trim(),
          stage: String(data.get("stage") ?? ""),
          comment: String(data.get("comment") ?? "").trim(),
          contactMethod: String(data.get("contactMethod") ?? ""),
          // Honeypot: заповнене поле = бот
          company: String(data.get("company") ?? ""),
        }),
      });

      if (res.ok) {
        setStatus("success");
        trackEvent("form_submit_success");
      } else {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        setStatus("error");
        setServerMessage(
          body?.message ??
            "Не вдалося надіслати заявку. Зателефонуйте нам або напишіть в Instagram.",
        );
        trackEvent("form_submit_error", { code: res.status });
      }
    } catch {
      setStatus("error");
      setServerMessage(
        "Немає звʼязку із сервером. Перевірте інтернет або зателефонуйте нам.",
      );
      trackEvent("form_submit_error", { code: "network" });
    }
  };

  const inputCls = (invalid?: boolean) =>
    `w-full rounded-button border bg-navy-deep/60 px-4 py-3.5 text-silver placeholder:text-silver-dim/50 transition-colors focus:border-blue focus:outline-none ${
      invalid ? "border-red-400/70" : "border-silver/20 hover:border-silver/35"
    }`;

  const labelCls = "mb-2 block text-sm font-medium text-silver";

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-card border border-blue/30 bg-graphite/60 p-8 sm:p-10"
      >
        <svg viewBox="0 0 48 48" className="size-12 text-blue" aria-hidden="true" fill="none">
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" />
          <path d="m15 24 6 6 12-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="mt-5 text-2xl font-bold text-silver">Заявку отримано</h3>
        <p className="mt-3 leading-relaxed text-silver-dim">
          Дякуємо! Ми звʼяжемося з вами найближчим часом, щоб обговорити ваш
          обʼєкт. Якщо питання термінове — телефонуйте:{" "}
          <a href={`tel:${site.phone.e164}`} className="font-semibold text-blue-soft">
            {site.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onFocus={onFirstInteraction}
      noValidate
      className="rounded-card border border-silver/12 bg-graphite/60 p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className={labelCls}>
            Імʼя <span className="text-blue">*</span>
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "lead-name-error" : undefined}
            className={inputCls(!!errors.name)}
            placeholder="Як до вас звертатися"
          />
          {errors.name && (
            <p id="lead-name-error" className="mt-1.5 text-sm text-red-300">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lead-phone" className={labelCls}>
            Телефон або месенджер <span className="text-blue">*</span>
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "lead-phone-error" : undefined}
            className={inputCls(!!errors.phone)}
            placeholder="+380 __ ___ __ __"
          />
          {errors.phone && (
            <p id="lead-phone-error" className="mt-1.5 text-sm text-red-300">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lead-object" className={labelCls}>
            Тип обʼєкта <span className="text-blue">*</span>
          </label>
          <select
            id="lead-object"
            name="objectType"
            required
            defaultValue=""
            aria-invalid={errors.objectType ? true : undefined}
            aria-describedby={errors.objectType ? "lead-object-error" : undefined}
            className={`${inputCls(!!errors.objectType)} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='m4 6 4 4 4-4' stroke='%239fb0c8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")] bg-[length:1rem] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
          >
            <option value="" disabled>
              Оберіть зі списку
            </option>
            {objectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.objectType && (
            <p id="lead-object-error" className="mt-1.5 text-sm text-red-300">
              {errors.objectType}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lead-stage" className={labelCls}>
            Етап <span className="font-normal text-silver-dim">(необовʼязково)</span>
          </label>
          <select
            id="lead-stage"
            name="stage"
            defaultValue=""
            className={`${inputCls()} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='m4 6 4 4 4-4' stroke='%239fb0c8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")] bg-[length:1rem] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
          >
            <option value="">Оберіть зі списку</option>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="lead-area" className={labelCls}>
            Площа, м² <span className="font-normal text-silver-dim">(необовʼязково)</span>
          </label>
          <input
            id="lead-area"
            name="area"
            type="text"
            inputMode="numeric"
            className={inputCls()}
            placeholder="Напр. 180"
          />
        </div>

        <div>
          <label htmlFor="lead-contact-method" className={labelCls}>
            Як зручніше звʼязатися{" "}
            <span className="font-normal text-silver-dim">(необовʼязково)</span>
          </label>
          <select
            id="lead-contact-method"
            name="contactMethod"
            defaultValue=""
            className={`${inputCls()} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='m4 6 4 4 4-4' stroke='%239fb0c8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")] bg-[length:1rem] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
          >
            <option value="">Будь-який спосіб</option>
            {contactMethods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="lead-comment" className={labelCls}>
            Коментар <span className="font-normal text-silver-dim">(необовʼязково)</span>
          </label>
          <textarea
            id="lead-comment"
            name="comment"
            rows={3}
            className={`${inputCls()} resize-y`}
            placeholder="Кілька слів про ваш обʼєкт або запитання"
          />
        </div>
      </div>

      {/* Honeypot: приховане від людей поле-пастка для ботів */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="lead-company">
          Компанія
          <input
            id="lead-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div aria-live="assertive" className="mt-5">
        {status === "error" && (
          <p className="rounded-button border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {serverMessage}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-button bg-blue px-8 text-base font-semibold text-navy-deep transition-[background-color,box-shadow,opacity] duration-300 hover:bg-blue-soft hover:shadow-glow-blue disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" && (
          <svg viewBox="0 0 20 20" className="size-5 animate-spin" aria-hidden="true" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
            <path d="M18 10a8 8 0 0 0-8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}
        {status === "loading" ? "Надсилаємо…" : "Обговорити проєкт"}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-silver-dim/70">
        Надсилаючи форму, ви погоджуєтеся, що ми звʼяжемося з вами щодо вашого
        запиту. Жодних розсилок.
      </p>
    </form>
  );
}

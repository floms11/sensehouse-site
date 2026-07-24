"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import { trackEvent } from "@/lib/analytics";
import { isValidUkrainianMobilePhone } from "@/lib/contact-validation";
import { site } from "@/config/site";
import FormSelect from "./FormSelect";

const objectTypes = ["Приватний будинок", "Квартира", "Бізнес-приміщення", "Інше"];

const stages = [
  "Планування",
  "Є дизайн-проєкт",
  "Починається ремонт",
  "Уже триває електромонтаж",
  "Частина робіт уже виконана",
  "Готовий ремонт",
];

const phoneContactMethods = ["Телефон", "Telegram", "WhatsApp"];
const usernameContactMethods = ["Telegram", "WhatsApp"];
const emailContactMethods = ["Email"];

type Status = "idle" | "loading" | "success" | "error";
type ContactMode = "phone" | "username" | "email";

type FieldErrors = Partial<Record<"name" | "phone", string>>;

type ParsedPhone = {
  digits: string;
  formatted: string;
};

/**
 * Нормалізує українські номери, введені як 67…, 067…, 38067… або +38067….
 * Явний номер з «+» іншої країни не переписуємо під +380.
 */
function parsePhone(value: string): ParsedPhone {
  const trimmed = value.trimStart();
  const explicitInternational = trimmed.startsWith("+");
  const rawDigits = value.replace(/\D/g, "");

  if (!rawDigits) {
    return {
      digits: "",
      formatted: explicitInternational ? "+" : "",
    };
  }

  let digits = rawDigits;
  let pendingPrefix = false;

  if (!explicitInternational) {
    if (digits.startsWith("380")) {
      digits = digits.slice(0, 12);
    } else if (digits.startsWith("38")) {
      if (digits.length < 3) {
        pendingPrefix = true;
      } else if (digits[2] === "0") {
        digits = digits.slice(0, 12);
      } else {
        digits = digits.slice(0, 15);
      }
    } else if (digits.startsWith("0")) {
      if (digits.length === 1) {
        pendingPrefix = true;
      } else {
        digits = `38${digits}`.slice(0, 12);
      }
    } else if (digits.length === 1) {
      pendingPrefix = true;
    } else {
      digits = `380${digits}`.slice(0, 12);
    }
  } else {
    digits = digits.slice(0, 15);
  }

  if (pendingPrefix) return { digits, formatted: digits };

  if (digits.startsWith("380")) {
    const national = digits.slice(3, 12);
    const parts = [
      national.slice(0, 2),
      national.slice(2, 5),
      national.slice(5, 7),
      national.slice(7, 9),
    ].filter(Boolean);
    return {
      digits,
      formatted: `+380${parts.length ? ` ${parts.join(" ")}` : ""}`,
    };
  }

  return { digits, formatted: `+${digits}` };
}

function caretAfterDigits(value: string, digitCount: number): number {
  if (digitCount <= 0) return 0;

  let seen = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (/\d/.test(value[index])) seen += 1;
    if (seen === digitCount) return index + 1;
  }
  return value.length;
}

function normalizeUsername(value: string): string {
  const withoutLink = value
    .trim()
    .replace(/^https?:\/\/(?:www\.)?t\.me\//i, "")
    .replace(/^t\.me\//i, "")
    .replace(/^@+/, "")
    .replace(/\s+/g, "");
  return withoutLink ? `@${withoutLink.slice(0, 64)}` : "";
}

function validateContact(value: string, mode: ContactMode): boolean {
  const trimmed = value.trim();
  if (mode === "username") return /^@[A-Za-z0-9_.]{3,64}$/.test(trimmed);
  if (mode === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
  }

  return isValidUkrainianMobilePhone(trimmed);
}

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverMessage, setServerMessage] = useState("");
  const [contactMode, setContactMode] = useState<ContactMode>("phone");
  const [phoneValue, setPhoneValue] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [objectType, setObjectType] = useState("");
  const [stage, setStage] = useState("");
  const startedRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const contactInputRef = useRef<HTMLInputElement>(null);

  const onFirstInteraction = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("form_start");
    }
  };

  const selectContactMode = (
    mode: ContactMode,
    event?: MouseEvent<HTMLButtonElement>,
  ) => {
    event?.preventDefault();
    setContactMode(mode);
    setErrors((current) => ({ ...current, phone: undefined }));
    setContactMethod((current) => {
      if (mode === "email") return "Email";
      if (mode === "username") {
        return usernameContactMethods.includes(current) ? current : "Telegram";
      }
      return phoneContactMethods.includes(current) ? current : "";
    });
    requestAnimationFrame(() => contactInputRef.current?.focus());
  };

  const onPhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const rawValue = input.value;
    const rawCaret = input.selectionStart ?? rawValue.length;
    const parsed = parsePhone(rawValue);
    const parsedBeforeCaret = parsePhone(rawValue.slice(0, rawCaret));

    setPhoneValue(parsed.formatted);
    setErrors((current) => ({ ...current, phone: undefined }));

    requestAnimationFrame(() => {
      const currentInput = contactInputRef.current;
      if (!currentInput) return;
      const caret = parsedBeforeCaret.digits.length
        ? caretAfterDigits(parsed.formatted, parsedBeforeCaret.digits.length)
        : parsedBeforeCaret.formatted.length;
      currentInput.setSelectionRange(caret, caret);
    });
  };

  const onUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const rawValue = input.value;
    const rawCaret = input.selectionStart ?? rawValue.length;
    const normalized = normalizeUsername(rawValue);
    const normalizedBeforeCaret = normalizeUsername(rawValue.slice(0, rawCaret));

    setUsernameValue(normalized);
    setErrors((current) => ({ ...current, phone: undefined }));

    requestAnimationFrame(() => {
      const currentInput = contactInputRef.current;
      if (!currentInput) return;
      const caret = Math.min(normalizedBeforeCaret.length, normalized.length);
      currentInput.setSelectionRange(caret, caret);
    });
  };

  const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.currentTarget.value.replace(/\s/g, "").slice(0, 254));
    setErrors((current) => ({ ...current, phone: undefined }));
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
    if (!validateContact(phone, contactMode)) {
      nextErrors.phone =
        contactMode === "phone"
          ? "Вкажіть коректний український мобільний номер."
          : contactMode === "username"
            ? "Вкажіть нікнейм щонайменше з 3 символів."
            : "Вкажіть коректну email-адресу.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const fieldIds: Record<keyof FieldErrors, string> = {
        name: "lead-name",
        phone: "lead-phone",
      };
      const firstKey = (["name", "phone"] as const).find(
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
    `min-h-13 w-full rounded-xl border bg-navy-deep/65 px-4 py-3.5 text-silver shadow-[inset_0_1px_0_rgb(255_255_255/0.025)] placeholder:text-silver-dim/45 transition-[border-color,background-color,box-shadow] duration-200 focus:border-blue focus:bg-navy-deep/80 focus:shadow-[0_0_0_3px_rgb(33_180_255/0.12)] focus:outline-none ${
      invalid ? "border-red-400/70" : "border-silver/18 hover:border-silver/35"
    }`;

  const labelCls = "mb-2 block text-sm font-medium text-silver";
  const contactMethods =
    contactMode === "phone"
      ? phoneContactMethods
      : contactMode === "email"
        ? emailContactMethods
        : usernameContactMethods;

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
          <label
            htmlFor="lead-name"
            className="mb-2 flex min-h-11 items-center text-sm font-medium text-silver"
          >
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
          <div className="mb-2 flex min-h-11 flex-wrap items-center justify-between gap-2">
            <label htmlFor="lead-phone" className="text-sm font-medium text-silver">
              Контакт <span className="text-blue">*</span>
            </label>
            <div
              role="group"
              aria-label="Формат контакту"
              className="grid grid-cols-3 rounded-lg border border-silver/12 bg-navy-deep/55 p-1"
            >
              <button
                type="button"
                aria-pressed={contactMode === "phone"}
                onClick={(event) => selectContactMode("phone", event)}
                className={`min-h-9 cursor-pointer rounded-md px-3 text-xs font-semibold transition-colors ${
                  contactMode === "phone"
                    ? "bg-blue text-navy-deep shadow-sm"
                    : "text-silver-dim hover:bg-white/[0.05] hover:text-silver"
                }`}
              >
                Номер
              </button>
              <button
                type="button"
                aria-pressed={contactMode === "username"}
                onClick={(event) => selectContactMode("username", event)}
                className={`min-h-9 cursor-pointer rounded-md px-3 text-xs font-semibold transition-colors ${
                  contactMode === "username"
                    ? "bg-blue text-navy-deep shadow-sm"
                    : "text-silver-dim hover:bg-white/[0.05] hover:text-silver"
                }`}
              >
                @нікнейм
              </button>
              <button
                type="button"
                aria-pressed={contactMode === "email"}
                onClick={(event) => selectContactMode("email", event)}
                className={`min-h-9 cursor-pointer rounded-md px-3 text-xs font-semibold transition-colors ${
                  contactMode === "email"
                    ? "bg-blue text-navy-deep shadow-sm"
                    : "text-silver-dim hover:bg-white/[0.05] hover:text-silver"
                }`}
              >
                Email
              </button>
            </div>
          </div>
          <input
            ref={contactInputRef}
            id="lead-phone"
            name="phone"
            type={
              contactMode === "phone"
                ? "tel"
                : contactMode === "email"
                  ? "email"
                  : "text"
            }
            inputMode={
              contactMode === "phone"
                ? "tel"
                : contactMode === "email"
                  ? "email"
                  : "text"
            }
            autoComplete={
              contactMode === "phone"
                ? "tel"
                : contactMode === "email"
                  ? "email"
                  : "username"
            }
            required
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "lead-phone-error" : undefined}
            className={inputCls(!!errors.phone)}
            placeholder={
              contactMode === "phone"
                ? "+380 __ ___ __ __"
                : contactMode === "email"
                  ? "name@example.com"
                  : "@username"
            }
            value={
              contactMode === "phone"
                ? phoneValue
                : contactMode === "email"
                  ? emailValue
                  : usernameValue
            }
            onChange={
              contactMode === "phone"
                ? onPhoneChange
                : contactMode === "email"
                  ? onEmailChange
                  : onUsernameChange
            }
            onBlur={() => {
              const value =
                contactMode === "phone"
                  ? phoneValue
                  : contactMode === "email"
                    ? emailValue
                    : usernameValue;
              if (value && !validateContact(value, contactMode)) {
                setErrors((current) => ({
                  ...current,
                  phone:
                    contactMode === "phone"
                      ? "Вкажіть коректний український мобільний номер."
                      : contactMode === "username"
                        ? "Вкажіть нікнейм щонайменше з 3 символів."
                        : "Вкажіть коректну email-адресу.",
                }));
              }
            }}
          />
          {errors.phone && (
            <p id="lead-phone-error" className="mt-1.5 text-sm text-red-300">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lead-object" className={labelCls}>
            Тип обʼєкта{" "}
            <span className="font-normal text-silver-dim">(необовʼязково)</span>
          </label>
          <FormSelect
            id="lead-object"
            name="objectType"
            value={objectType}
            placeholder="Оберіть зі списку"
            ariaLabel="Тип обʼєкта"
            options={[
              { value: "", label: "Оберіть зі списку" },
              ...objectTypes.map((type) => ({ value: type, label: type })),
            ]}
            onChange={setObjectType}
          />
        </div>

        <div>
          <label htmlFor="lead-stage" className={labelCls}>
            Етап <span className="font-normal text-silver-dim">(необовʼязково)</span>
          </label>
          <FormSelect
            id="lead-stage"
            name="stage"
            value={stage}
            placeholder="Оберіть зі списку"
            ariaLabel="Етап"
            options={[
              { value: "", label: "Оберіть зі списку" },
              ...stages.map((item) => ({ value: item, label: item })),
            ]}
            onChange={setStage}
          />
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
          <FormSelect
            id="lead-contact-method"
            name="contactMethod"
            value={contactMethod}
            placeholder="Будь-який спосіб"
            ariaLabel="Бажаний спосіб звʼязку"
            options={[
              { value: "", label: "Будь-який спосіб" },
              ...contactMethods.map((method) => ({
                value: method,
                label: method,
              })),
            ]}
            onChange={setContactMethod}
          />
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

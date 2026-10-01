"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { isValidUkrainianMobilePhone } from "@/lib/contact-validation";
import { site } from "@/config/site";

type Status = "idle" | "loading" | "success" | "error";
type FieldName = "name" | "phone" | "objectType";
type FieldErrors = Partial<Record<FieldName, string>>;

function normalizedTelegram(value: string): string {
  const match = value
    .trim()
    .match(/^(?:https?:\/\/)?(?:www\.)?t\.me\/([A-Za-z0-9_]{3,64})\/?$/i);
  return match ? `@${match[1]}` : value.trim();
}

function isValidContact(value: string): boolean {
  const normalized = normalizedTelegram(value);
  return (
    /^@[A-Za-z0-9_]{3,64}$/.test(normalized) ||
    isValidUkrainianMobilePhone(normalized)
  );
}

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverMessage, setServerMessage] = useState("");
  const [values, setValues] = useState({
    name: "",
    phone: "",
    objectType: "",
    comment: "",
  });
  const startedRef = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      status !== "success" ||
      !window.matchMedia("(max-width: 767px)").matches
    ) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const success = successRef.current;
      if (!success) return;

      const headerOffset =
        document.querySelector<HTMLElement>("header")?.getBoundingClientRect()
          .height ?? 0;
      const top = Math.max(
        0,
        window.scrollY +
          success.getBoundingClientRect().top -
          headerOffset -
          16,
      );
      const behavior = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
        ? "auto"
        : "smooth";

      window.scrollTo({ top, behavior });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [status]);

  const onFirstInteraction = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("form_start");
  };

  const setValue = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (field === "name" || field === "phone" || field === "objectType") {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const validate = (): FieldErrors => {
    const nextErrors: FieldErrors = {};
    if (values.name.trim().length < 2) {
      nextErrors.name = "Вкажіть, як до вас звертатися.";
    }
    if (!isValidContact(values.phone)) {
      nextErrors.phone =
        "Вкажіть український мобільний номер або Telegram у форматі @username.";
    }
    if (!values.objectType) {
      nextErrors.objectType = "Оберіть тип обʼєкта.";
    }
    return nextErrors;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading" || status === "success") return;

    const nextErrors = validate();
    setErrors(nextErrors);

    const firstError = (["name", "phone", "objectType"] as const).find(
      (field) => nextErrors[field],
    );
    if (firstError) {
      document.getElementById(`lead-${firstError}`)?.focus();
      return;
    }

    const formData = new FormData(event.currentTarget);
    setStatus("loading");
    setServerMessage("");
    trackEvent("form_submit", { object_type: values.objectType });

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: normalizedTelegram(values.phone),
          objectType: values.objectType,
          comment: values.comment.trim(),
          contactMethod: normalizedTelegram(values.phone).startsWith("@")
            ? "Telegram"
            : "Телефон",
          company: String(formData.get("company") ?? ""),
        }),
      });

      if (response.ok) {
        setStatus("success");
        trackEvent("form_submit_success");
        return;
      }

      const body = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;
      setStatus("error");
      setServerMessage(
        body?.message ??
          "Не вдалося надіслати заявку. Дані збережено — спробуйте ще раз або зателефонуйте.",
      );
      trackEvent("form_submit_error", { code: response.status });
    } catch {
      setStatus("error");
      setServerMessage(
        "Немає звʼязку із сервером. Дані збережено — перевірте інтернет або зателефонуйте.",
      );
      trackEvent("form_submit_error", { code: "network" });
    }
  };

  const inputClass = (invalid?: boolean) =>
    `min-h-13 w-full rounded-xl border bg-navy-deep/70 px-4 py-3.5 text-base text-silver placeholder:text-silver-dim/55 transition-[border-color,background-color,box-shadow] duration-200 focus:border-blue focus:bg-navy-deep focus:shadow-[0_0_0_3px_rgb(33_180_255/0.14)] focus:outline-none ${
      invalid ? "border-red-300/80" : "border-silver/18 hover:border-silver/35"
    }`;

  const labelClass = "mb-2 block text-sm font-semibold text-silver";

  if (status === "success") {
    return (
      <div
        ref={successRef}
        role="status"
        aria-live="polite"
        className="rounded-card border border-blue/30 bg-graphite/75 p-8 sm:p-10"
      >
        <svg
          viewBox="0 0 48 48"
          className="size-12 text-blue"
          aria-hidden="true"
          fill="none"
        >
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="2"
          />
          <path
            d="m15 24 6 6 12-12"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3 className="mt-5 text-2xl font-bold text-silver">Заявку отримано</h3>
        <p className="mt-3 leading-relaxed text-silver-dim">
          Дякуємо. Звʼяжемося з вами за вказаним контактом, щоб обговорити
          обʼєкт. Також можна зателефонувати:{" "}
          <a
            href={`tel:${site.phone.e164}`}
            className="font-semibold text-blue-soft"
          >
            {site.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      onFocus={onFirstInteraction}
      noValidate
      className="rounded-card border border-silver/12 bg-graphite/65 p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className={labelClass}>
            Імʼя <span className="text-blue">*</span>
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={(event) => setValue("name", event.currentTarget.value.slice(0, 200))}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "lead-name-error" : undefined}
            className={inputClass(Boolean(errors.name))}
            placeholder="Як до вас звертатися"
          />
          {errors.name && (
            <p id="lead-name-error" className="mt-2 text-sm text-red-200">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lead-phone" className={labelClass}>
            Телефон або Telegram <span className="text-blue">*</span>
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="text"
            inputMode="text"
            autoComplete="tel"
            required
            value={values.phone}
            onChange={(event) => setValue("phone", event.currentTarget.value.slice(0, 100))}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={
              errors.phone
                ? "lead-phone-hint lead-phone-error"
                : "lead-phone-hint"
            }
            className={inputClass(Boolean(errors.phone))}
            placeholder="+380 67 000 00 00 або @username"
          />
          <p id="lead-phone-hint" className="mt-2 text-xs leading-relaxed text-silver-dim/75">
            Вкажіть один зручний спосіб звʼязку.
          </p>
          {errors.phone && (
            <p id="lead-phone-error" className="mt-2 text-sm text-red-200">
              {errors.phone}
            </p>
          )}
        </div>

        <fieldset
          className="sm:col-span-2"
          aria-invalid={errors.objectType ? true : undefined}
          aria-describedby={
            errors.objectType ? "lead-objectType-error" : undefined
          }
        >
          <legend className={labelClass}>
            Тип обʼєкта <span className="text-blue">*</span>
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              { value: "Квартира", label: "Квартира" },
              { value: "Приватний будинок", label: "Будинок" },
              {
                value: "Бізнес / комерційний обʼєкт",
                label: "Бізнес",
              },
            ].map((option) => {
              const selected = values.objectType === option.value;

              return (
                <label
                  key={option.value}
                  className={`flex min-h-13 cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-[border-color,background-color,color,box-shadow] duration-200 focus-within:ring-3 focus-within:ring-blue/15 ${
                    selected
                      ? "border-blue bg-blue/12 text-blue-soft shadow-[inset_0_0_0_1px_rgb(33_180_255/0.18)]"
                      : "border-silver/18 bg-navy-deep/70 text-silver-dim hover:border-silver/35 hover:bg-navy-deep hover:text-silver"
                  }`}
                >
                  <input
                    id={
                      option.value === "Квартира"
                        ? "lead-objectType"
                        : undefined
                    }
                    type="radio"
                    name="objectType"
                    value={option.value}
                    checked={selected}
                    onChange={(event) =>
                      setValue("objectType", event.currentTarget.value)
                    }
                    className="sr-only"
                    required
                  />
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`size-2 rounded-full transition-colors ${
                        selected ? "bg-blue" : "bg-silver/25"
                      }`}
                    />
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
          {errors.objectType && (
            <p id="lead-objectType-error" className="mt-2 text-sm text-red-200">
              {errors.objectType}
            </p>
          )}
        </fieldset>

        <div className="sm:col-span-2">
          <label htmlFor="lead-comment" className={labelClass}>
            Коротко про обʼєкт{" "}
            <span className="font-normal text-silver-dim">(необовʼязково)</span>
          </label>
          <textarea
            id="lead-comment"
            name="comment"
            rows={4}
            value={values.comment}
            onChange={(event) =>
              setValue("comment", event.currentTarget.value.slice(0, 2000))
            }
            className={`${inputClass()} resize-y`}
            placeholder="Наприклад: приватний будинок на етапі планування, потрібна електрика й резервне живлення"
          />
        </div>
      </div>

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
          <p className="rounded-button border border-red-300/40 bg-red-300/10 px-4 py-3 text-sm text-red-100">
            {serverMessage}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 inline-flex min-h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-button bg-blue px-8 text-base font-semibold text-navy-deep transition-[background-color,box-shadow,opacity] duration-200 hover:bg-blue-soft hover:shadow-glow-blue disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" && (
          <svg
            viewBox="0 0 20 20"
            className="size-5 animate-spin"
            aria-hidden="true"
            fill="none"
          >
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="2.5"
            />
            <path
              d="M18 10a8 8 0 0 0-8-8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        )}
        {status === "loading" ? "Надсилаємо…" : "Проконсультуватися"}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-silver-dim/75">
        Надсилаючи форму, ви погоджуєтеся з{" "}
        <Link
          href="/privacy"
          className="inline-flex min-h-11 items-center underline decoration-silver/30 underline-offset-4 hover:text-silver"
        >
          політикою конфіденційності
        </Link>
        . Дані використовуються лише для відповіді на ваш запит.
      </p>
    </form>
  );
}

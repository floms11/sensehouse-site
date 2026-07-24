const UKRAINIAN_MOBILE_CODES = new Set([
  "39",
  "50",
  "63",
  "66",
  "67",
  "68",
  "73",
  "75",
  "77",
  "89",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
]);

/**
 * Приймає український мобільний номер у локальному або міжнародному форматі.
 * Явний міжнародний номер іншої країни ніколи не перетворюється на український.
 */
export function isValidUkrainianMobilePhone(value: string): boolean {
  const trimmed = value.trim();
  if (!/^\+?[\d\s()-]+$/.test(trimmed)) return false;

  const hasExplicitCountryCode = trimmed.startsWith("+");
  const rawDigits = trimmed.replace(/\D/g, "");

  let digits: string;
  if (hasExplicitCountryCode) {
    if (!rawDigits.startsWith("380")) return false;
    digits = rawDigits;
  } else if (rawDigits.startsWith("380")) {
    digits = rawDigits;
  } else if (rawDigits.startsWith("0")) {
    digits = `38${rawDigits}`;
  } else {
    digits = `380${rawDigits}`;
  }

  return (
    digits.length === 12 &&
    digits.startsWith("380") &&
    UKRAINIAN_MOBILE_CODES.has(digits.slice(3, 5))
  );
}

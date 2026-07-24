"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { site } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

/**
 * Header: прозорий на першому екрані, після прокручування —
 * компактна напівпрозора панель із backdrop blur.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Блокуємо прокручування під відкритим мобільним меню
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        headerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const activeIndex = focusable.indexOf(document.activeElement as HTMLElement);
      const movingBackward = event.shiftKey;
      const shouldWrapBackward = movingBackward && activeIndex <= 0;
      const shouldWrapForward =
        !movingBackward && activeIndex === focusable.length - 1;

      if (shouldWrapBackward || shouldWrapForward) {
        event.preventDefault();
        focusable[shouldWrapBackward ? focusable.length - 1 : 0]?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled || menuOpen
          ? "bg-navy-deep/80 shadow-[0_1px_0_0_rgb(232_237_243/0.08)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/#top"
          aria-label="Sense House — на початок сторінки"
          onClick={close}
          className="inline-flex min-h-11 items-center"
        >
          <Logo />
        </Link>

        <nav aria-label="Основна навігація" className="hidden xl:block">
          <ul className="flex items-center gap-8">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[0.92rem] font-medium text-silver-dim transition-colors hover:text-silver"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-5 xl:flex">
          <a
            href={`tel:${site.phone.e164}`}
            className="text-[0.92rem] font-semibold text-silver transition-colors hover:text-blue-soft"
            onClick={() => trackEvent("phone_click", { placement: "header" })}
          >
            {site.phone.display}
          </a>
          <Link
            href="/#contact"
            onClick={() => trackEvent("header_cta_click")}
            className="inline-flex min-h-11 items-center rounded-button bg-blue px-5 py-2.5 text-[0.92rem] font-semibold text-navy-deep transition-[background-color,box-shadow] duration-300 hover:bg-blue-soft hover:shadow-glow-blue"
          >
            Обговорити проєкт
          </Link>
        </div>

        <div className="flex items-center gap-1 xl:hidden">
          <a
            href={`tel:${site.phone.e164}`}
            aria-label={`Зателефонувати: ${site.phone.display}`}
            onClick={() => trackEvent("phone_click", { placement: "mobile_header" })}
            className="inline-flex size-11 items-center justify-center rounded-button text-silver transition-colors hover:bg-silver/5 hover:text-blue-soft"
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
          <button
            type="button"
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-button text-silver transition-colors hover:bg-silver/5"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-silver/10 bg-navy-deep/96 backdrop-blur-md xl:hidden"
      >
        <nav aria-label="Мобільна навігація" className="px-5 py-6">
          <ul className="flex flex-col gap-1">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="block rounded-button px-3 py-3 text-lg font-medium text-silver transition-colors hover:bg-graphite"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 border-t border-silver/10 pt-6">
            <Link
              href="/#contact"
              onClick={() => {
                trackEvent("header_cta_click", { placement: "mobile_menu" });
                close();
              }}
              className="inline-flex min-h-12 items-center justify-center rounded-button bg-blue px-6 font-semibold text-navy-deep"
            >
              Обговорити проєкт
            </Link>
            <a
              href={`tel:${site.phone.e164}`}
              onClick={() => trackEvent("phone_click", { placement: "mobile_menu" })}
              className="inline-flex min-h-12 items-center justify-center rounded-button border border-silver/25 px-6 font-medium text-silver"
            >
              {site.phone.display}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

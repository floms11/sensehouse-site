"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Блокуємо прокручування під відкритим мобільним меню
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled || menuOpen
          ? "bg-navy-deep/80 shadow-[0_1px_0_0_rgb(232_237_243/0.08)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" aria-label="Sense House — на початок сторінки" onClick={close}>
          <Logo />
        </a>

        <nav aria-label="Основна навігація" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[0.92rem] font-medium text-silver-dim transition-colors hover:text-silver"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={`tel:${site.phone.e164}`}
            className="text-[0.92rem] font-semibold text-silver transition-colors hover:text-blue-soft"
            onClick={() => trackEvent("phone_click", { placement: "header" })}
          >
            {site.phone.display}
          </a>
          <a
            href="#contact"
            onClick={() => trackEvent("header_cta_click")}
            className="inline-flex min-h-11 items-center rounded-button bg-blue px-5 py-2.5 text-[0.92rem] font-semibold text-navy-deep transition-[background-color,box-shadow] duration-300 hover:bg-blue-soft hover:shadow-glow-blue"
          >
            Обговорити проєкт
          </a>
        </div>

        {/* Мобільний тригер меню */}
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-button text-silver lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
          onClick={() => setMenuOpen((v) => !v)}
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

      {/* Мобільне меню */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-silver/10 bg-navy-deep/95 backdrop-blur-md lg:hidden"
      >
        <nav aria-label="Мобільна навігація" className="px-5 py-6">
          <ul className="flex flex-col gap-1">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={close}
                  className="block rounded-button px-3 py-3 text-lg font-medium text-silver transition-colors hover:bg-graphite"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 border-t border-silver/10 pt-6">
            <a
              href="#contact"
              onClick={() => {
                trackEvent("header_cta_click", { placement: "mobile_menu" });
                close();
              }}
              className="inline-flex min-h-12 items-center justify-center rounded-button bg-blue px-6 font-semibold text-navy-deep"
            >
              Обговорити проєкт
            </a>
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

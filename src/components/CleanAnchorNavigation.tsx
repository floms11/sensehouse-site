"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const pendingTargetKey = "sense-house-scroll-target";

function targetIdFromHash(hash: string): string {
  try {
    return decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return "";
  }
}

function cleanCurrentUrl() {
  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${window.location.search}`,
  );
}

function scrollToTarget(targetId: string): boolean {
  const target = document.getElementById(targetId);
  if (!target) return false;

  const headerOffset =
    document.querySelector<HTMLElement>("header")?.getBoundingClientRect()
      .height ?? 0;
  const top = Math.max(
    0,
    window.scrollY + target.getBoundingClientRect().top - headerOffset - 16,
  );
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

  window.scrollTo({ top, behavior });

  if (targetId === "main") {
    const hadTabIndex = target.hasAttribute("tabindex");
    if (!hadTabIndex) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (!hadTabIndex) {
      target.addEventListener(
        "blur",
        () => target.removeAttribute("tabindex"),
        { once: true },
      );
    }
  }

  return true;
}

/**
 * Зберігає звичайні href з hash для семантики та доступності, але після
 * навігації очищає адресний рядок, щоб скопійований URL завжди був чистим.
 */
export default function CleanAnchorNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const pendingTarget = window.sessionStorage.getItem(pendingTargetKey);
    const targetId =
      pendingTarget ?? targetIdFromHash(window.location.hash);
    if (!targetId) return;

    window.sessionStorage.removeItem(pendingTargetKey);
    const frame = window.requestAnimationFrame(() => {
      if (scrollToTarget(targetId)) cleanCurrentUrl();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => {
      const targetId = targetIdFromHash(window.location.hash);
      if (!targetId) return;

      window.requestAnimationFrame(() => {
        if (scrollToTarget(targetId)) cleanCurrentUrl();
      });
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const clickedElement = event.target;
      if (!(clickedElement instanceof Element)) return;

      const anchor = clickedElement.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target !== "_self")
      ) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      const targetId = targetIdFromHash(url.hash);
      if (url.origin !== window.location.origin || !targetId) return;

      const samePage =
        url.pathname === window.location.pathname &&
        url.search === window.location.search;

      if (samePage) {
        if (!scrollToTarget(targetId)) return;
        event.preventDefault();
        cleanCurrentUrl();
        return;
      }

      event.preventDefault();
      window.sessionStorage.setItem(pendingTargetKey, targetId);
      router.push(`${url.pathname}${url.search}`);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}

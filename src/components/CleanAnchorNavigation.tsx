"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

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
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    if (!window.location.hash) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
      });
    }

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const targetId = targetIdFromHash(window.location.hash);
    if (!targetId) return;

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
    let pendingFrame = 0;

    const scheduleScroll = (targetId: string) => {
      window.cancelAnimationFrame(pendingFrame);
      pendingFrame = window.requestAnimationFrame(() => {
        pendingFrame = window.requestAnimationFrame(() => {
          scrollToTarget(targetId);
        });
      });
    };

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
        if (!document.getElementById(targetId)) return;
        event.preventDefault();
        cleanCurrentUrl();
        // React спершу закриває мобільне меню й знімає overflow: hidden,
        // після чого виконуємо точний скрол до секції.
        scheduleScroll(targetId);
        return;
      }

      event.preventDefault();
      router.push(`${url.pathname}${url.search}${url.hash}`);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      window.cancelAnimationFrame(pendingFrame);
      document.removeEventListener("click", onClick, true);
    };
  }, [router]);

  return null;
}

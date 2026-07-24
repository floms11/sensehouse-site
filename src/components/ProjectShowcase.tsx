"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Переглядач реального технічного проєкту «Власна оселя 001».
 * Дизайн: аркуш проєкту як фізичний обʼєкт (стос сторінок із мʼякою
 * тінню) на світлому фоні секції — без важкого білого контейнера.
 * Категорії — мінімальні текстові таби, навігація — тонкий тулбар.
 */

type Page = {
  src: string;
  title: string;
  note: string;
};

type Group = {
  id: string;
  label: string;
  pages: Page[];
};

const groups: Group[] = [
  {
    id: "plans",
    label: "Плани",
    pages: [
      {
        src: "/project/pasport.webp",
        title: "Паспорт обʼєкта",
        note: "Потужність, струм вводу та структура навантаження — розраховано, а не припущено.",
      },
      {
        src: "/project/plan-rozetky.webp",
        title: "План розеток і вимикачів",
        note: "Кожна точка з розмірними привʼязками — монтаж без здогадок.",
      },
      {
        src: "/project/plan-osvitlennia.webp",
        title: "План освітлення",
        note: "Групи світла, керування й розміщення світильників по приміщеннях.",
      },
      {
        src: "/project/kabelni-trasy.webp",
        title: "Кабельні траси будинку",
        note: "Усі лінії будинку на одному кресленні: силові, слаботочні, автоматика.",
      },
    ],
  },
  {
    id: "walls",
    label: "Розгортки",
    pages: [
      {
        src: "/project/rozgortka-rozmishchennia.webp",
        title: "Стіна — розміщення",
        note: "Розетки, вимикачі й обладнання на стіні з точними розмірами.",
      },
      {
        src: "/project/rozgortka-kabel.webp",
        title: "Стіна — кабельні лінії",
        note: "Кожна лінія в стіні підписана кодом і маркою кабелю.",
      },
    ],
  },
  {
    id: "boards",
    label: "Щити",
    pages: [
      {
        src: "/project/shchyt-zakrytyi.webp",
        title: "Щит із наліпками",
        note: "Кожен автомат підписаний — зрозуміло без електрика.",
      },
      {
        src: "/project/shchyt-shema.webp",
        title: "Принципова схема",
        note: "Повна схема зʼєднань: 44 пристрої, кожна клема простежується.",
      },
    ],
  },
  {
    id: "journal",
    label: "Журнал",
    pages: [
      {
        src: "/project/kabelnyi-zhurnal.webp",
        title: "Кабельний журнал",
        note: "Код, призначення, марка, довжина, гофра — по кожній лінії.",
      },
      {
        src: "/project/rozpinovka.webp",
        title: "Розпіновка ліній",
        note: "Пожильно: колір жили, функція, клема підключення.",
      },
    ],
  },
];

export default function ProjectShowcase() {
  const [groupIdx, setGroupIdx] = useState(0);
  const [pageIdx, setPageIdx] = useState(0);
  const baseId = useId();

  const group = groups[groupIdx];
  const page = group.pages[pageIdx];

  const selectGroup = (i: number) => {
    setGroupIdx(i);
    setPageIdx(0);
    trackEvent("project_page_change", { group: groups[i].id, page: 0 });
  };

  const selectPage = (i: number) => {
    setPageIdx(i);
    trackEvent("project_page_change", { group: group.id, page: i });
  };

  return (
    <div>
      {/* Категорії — мінімальні текстові таби */}
      <div
        role="tablist"
        aria-label="Розділи технічного проєкту"
        className="flex gap-6 overflow-x-auto border-b border-navy/10 sm:gap-8"
      >
        {groups.map((g, i) => (
          <button
            key={g.id}
            role="tab"
            id={`${baseId}-tab-${g.id}`}
            aria-selected={i === groupIdx}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === groupIdx ? 0 : -1}
            onClick={() => selectGroup(i)}
            className={`-mb-px shrink-0 border-b-2 pt-1 pb-3 text-[0.8rem] font-semibold tracking-[0.14em] uppercase transition-colors duration-300 ${
              i === groupIdx
                ? "border-blue text-navy"
                : "border-transparent text-navy/45 hover:text-navy/75"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Аркуш проєкту як фізичний обʼєкт */}
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${group.id}`}
        className="mt-8"
      >
        <div className="relative">
          {/* Стос сторінок позаду */}
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-2.5 translate-y-2.5 rotate-[0.8deg] rounded-lg bg-white/70 ring-1 ring-navy/5"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-1 translate-y-1 rotate-[-0.5deg] rounded-lg bg-white/90 ring-1 ring-navy/5"
          />

          {/* Активний аркуш */}
          <div className="relative overflow-hidden rounded-lg bg-white ring-1 ring-navy/10 shadow-[0_32px_64px_-32px_rgb(8_26_58/0.35)]">
            <Image
              key={page.src}
              src={page.src}
              alt={`Сторінка проєкту: ${page.title}`}
              width={1754}
              height={1241}
              sizes="(min-width: 1024px) 620px, 100vw"
              className="h-auto w-full animate-[intro-in_0.5s_var(--ease-smooth)_both]"
              loading="lazy"
            />
          </div>
        </div>

        {/* Тонкий тулбар */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div aria-live="polite" className="min-w-0">
            <p className="truncate text-[0.95rem] font-semibold text-navy">
              {page.title}
            </p>
            <p className="mt-0.5 truncate text-sm text-navy/55">{page.note}</p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {group.pages.length > 1 && (
              <>
                <span className="font-display mr-1.5 text-sm tabular-nums text-navy/45">
                  {pageIdx + 1}/{group.pages.length}
                </span>
                <button
                  type="button"
                  onClick={() => selectPage((pageIdx - 1 + group.pages.length) % group.pages.length)}
                  aria-label="Попередня сторінка"
                  className="flex size-10 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-colors hover:border-navy/35 hover:text-navy"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
                    <path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => selectPage((pageIdx + 1) % group.pages.length)}
                  aria-label="Наступна сторінка"
                  className="flex size-10 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-colors hover:border-navy/35 hover:text-navy"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
                    <path d="m10 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
            <a
              href={page.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Відкрити сторінку «${page.title}» повністю`}
              className="ml-1 flex size-10 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-colors hover:border-blue/60 hover:text-blue"
            >
              <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
                <path d="M8 4h8v8M16 4 8.5 11.5M11 16H4V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

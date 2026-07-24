"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Переглядач фрагментів робочої технічної документації.
 * Альбомні аркуші показуються повністю, вертикальні — збільшеним
 * фрагментом із можливістю відкрити повну сторінку. Розмір viewport
 * не змінюється між форматами.
 */

type Page = {
  src: string;
  title: string;
  note: string;
  portrait?: boolean;
};

type Group = {
  id: string;
  label: string;
  pages: Page[];
};

const groups: Group[] = [
  {
    id: "logic",
    label: "Логіка",
    pages: [
      {
        src: "/project/concept-system.webp",
        title: "Функціональна концепція будинку",
        note: "Світло, клімат, безпека, доступ і резервне живлення зведені в одну логіку.",
      },
      {
        src: "/project/concept-scenarios.webp",
        title: "Основні сценарії",
        note: "Зрозумілі режими для відсутності, повернення, ночі, ранку та щоденних звичок.",
      },
      {
        src: "/project/calculation-phases.webp",
        title: "Баланс фаз",
        note: "Навантаження розподілене між фазами й перевірене до комплектації щита.",
      },
    ],
  },
  {
    id: "plans",
    label: "Плани",
    pages: [
      {
        src: "/project/plan-sockets-new.webp",
        title: "План розеток і вимикачів",
        note: "Кожна точка має розмірну привʼязку до стін, меблів і проходів.",
        portrait: true,
      },
      {
        src: "/project/plan-lighting-new.webp",
        title: "План освітлення",
        note: "Світильники, групи керування й монтажні привʼязки по приміщеннях.",
        portrait: true,
      },
      {
        src: "/project/plan-cables-new.webp",
        title: "Кабельні лінії будинку",
        note: "Траси силових, слаботочних та автоматизаційних ліній на плані.",
        portrait: true,
      },
    ],
  },
  {
    id: "walls",
    label: "Розгортки",
    pages: [
      {
        src: "/project/wall-placement-new.webp",
        title: "Розміщення обладнання",
        note: "Привʼязки розеток, вимикачів та обладнання до готових поверхонь.",
      },
      {
        src: "/project/wall-routes-new.webp",
        title: "Маршрути кабельних трас",
        note: "Окремо показано, де проходять штроби та як кабелі підходять до точок.",
      },
      {
        src: "/project/wall-cables-new.webp",
        title: "Маркування кабельних ліній",
        note: "Кожна траса підписана кодом і маркою кабелю — від щита до споживача.",
      },
    ],
  },
  {
    id: "boards",
    label: "Щити",
    pages: [
      {
        src: "/project/board-closed-new.webp",
        title: "Компонування електрощита",
        note: "Розкладка пристроїв і зрозуміле маркування кожної групи.",
        portrait: true,
      },
      {
        src: "/project/board-schematic-new.webp",
        title: "Принципова схема щита",
        note: "Зʼєднання, захисти, клеми й підключення показані до початку збірки.",
        portrait: true,
      },
      {
        src: "/project/document-board-spec.webp",
        title: "Специфікація електрощита",
        note: "Позиція, тип пристрою, виробник, модель і місце на DIN-рейці.",
      },
    ],
  },
  {
    id: "documents",
    label: "Документи",
    pages: [
      {
        src: "/project/calculation-passport.webp",
        title: "Паспорт і структура навантажень",
        note: "Вхідні параметри, розрахункова потужність і розподіл споживання по системах.",
      },
      {
        src: "/project/document-cable-journal.webp",
        title: "Кабельний журнал приміщення",
        note: "Коди, призначення, довжини й типи гофри зведені в одну таблицю.",
      },
      {
        src: "/project/document-work-scope.webp",
        title: "Орієнтовний перелік робіт",
        note: "Обсяги робіт формуються з проєкту до початку монтажу.",
      },
      {
        src: "/project/document-pinout.webp",
        title: "Розпіновка кабельних ліній",
        note: "Колір жили, функція та клема підключення зафіксовані для кожної лінії.",
        portrait: true,
      },
      {
        src: "/project/document-room-cabling.webp",
        title: "Прокладання кабелю по приміщеннях",
        note: "Обсяги трас, гофри й штроблення зведені по кожному приміщенню.",
        portrait: true,
      },
    ],
  },
];

export default function ProjectShowcase() {
  const [groupIdx, setGroupIdx] = useState(0);
  const [pageIdx, setPageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lightboxTriggerRef = useRef<HTMLButtonElement>(null);

  const group = groups[groupIdx];
  const page = group.pages[pageIdx];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (lightboxOpen && !dialog.open) {
      dialog.showModal();
    } else if (!lightboxOpen && dialog.open) {
      dialog.close();
    }
  }, [lightboxOpen]);

  const selectGroup = (i: number, moveFocus = false) => {
    setGroupIdx(i);
    setPageIdx(0);
    trackEvent("project_page_change", { group: groups[i].id, page: 0 });
    if (moveFocus) tabRefs.current[i]?.focus();
  };

  const selectPage = (i: number) => {
    setPageIdx(i);
    trackEvent("project_page_change", { group: group.id, page: i });
  };

  const openLightbox = (event: MouseEvent<HTMLButtonElement>) => {
    lightboxTriggerRef.current = event.currentTarget;
    setLightboxOpen(true);
    trackEvent("project_sheet_open", {
      group: group.id,
      page: pageIdx,
    });
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let nextIndex = groupIdx;

    if (event.key === "ArrowRight") {
      nextIndex = (groupIdx + 1) % groups.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (groupIdx - 1 + groups.length) % groups.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = groups.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    selectGroup(nextIndex, true);
  };

  const onDialogKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (group.pages.length < 2) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectPage((pageIdx + 1) % group.pages.length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectPage((pageIdx - 1 + group.pages.length) % group.pages.length);
    }
  };

  return (
    <div data-testid="project-showcase">
      <div
        role="tablist"
        aria-label="Розділи технічного проєкту"
        onKeyDown={onTabKeyDown}
        className="grid grid-cols-2 border-b border-navy/10 sm:grid-cols-5"
      >
        {groups.map((g, i) => (
          <button
            key={g.id}
            ref={(element) => {
              tabRefs.current[i] = element;
            }}
            role="tab"
            id={`${baseId}-tab-${g.id}`}
            aria-selected={i === groupIdx}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === groupIdx ? 0 : -1}
            onClick={() => selectGroup(i)}
            className={`-mb-px flex min-h-12 min-w-0 cursor-pointer items-center justify-center border-b-2 px-2 py-2 text-center text-[0.72rem] font-semibold tracking-[0.06em] uppercase transition-[color,border-color,background-color] duration-200 last:col-span-2 sm:min-h-11 sm:px-1 sm:text-[0.7rem] sm:tracking-[0.08em] sm:last:col-span-1 ${
              i === groupIdx
                ? "border-blue text-navy"
                : "border-transparent text-navy/45 hover:bg-white/20 hover:text-navy/75"
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
        <div className="relative isolate">
          {/* Стос сторінок позаду */}
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-2.5 translate-y-2.5 rotate-[0.8deg] rounded-lg bg-white/70 ring-1 ring-navy/5"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-1 translate-y-1 rotate-[-0.5deg] rounded-lg bg-white/90 ring-1 ring-navy/5"
          />

          {/* Стабільний viewport для альбомних і вертикальних аркушів */}
          <button
            type="button"
            onClick={openLightbox}
            aria-label={`Збільшити сторінку «${page.title}»`}
            data-testid="project-sheet-preview"
            className="relative block aspect-[2000/1305] w-full cursor-pointer overflow-hidden rounded-lg bg-white text-left ring-1 ring-navy/10 shadow-[0_32px_64px_-32px_rgb(8_26_58/0.35)]"
          >
            {group.pages.map((item, i) => (
              <Image
                key={item.src}
                src={item.src}
                alt={i === pageIdx ? `Сторінка проєкту: ${item.title}` : ""}
                aria-hidden={i !== pageIdx}
                width={item.portrait ? 1320 : 1800}
                height={item.portrait ? 1800 : 1175}
                sizes="(min-width: 1024px) 620px, (min-width: 640px) 80vw, calc(100vw - 40px)"
                style={item.portrait ? { objectPosition: "50% top" } : undefined}
                className={`absolute inset-0 h-full w-full select-none transition-opacity duration-200 ease-out motion-reduce:transition-none ${
                  item.portrait ? "object-cover" : "object-contain"
                } ${
                  i === pageIdx ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                loading="lazy"
              />
            ))}
            {page.portrait && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 bottom-3 z-10 rounded-full bg-navy/85 px-3 py-1.5 text-[0.62rem] font-semibold tracking-[0.06em] text-white uppercase shadow-sm"
              >
                Фрагмент аркуша
              </span>
            )}
          </button>
        </div>

        {/* Підпис і керування мають окремі стабільні зони */}
        <div className="mt-5 grid gap-4 xs:grid-cols-[minmax(0,1fr)_auto] xs:items-start">
          <div aria-live="polite" aria-atomic="true" className="min-w-0 xs:min-h-[4.5rem]">
            <p className="text-[0.95rem] leading-snug font-semibold text-navy">
              {page.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-navy/55">
              {page.note}
            </p>
          </div>

          <div className="flex min-h-11 shrink-0 items-center gap-2 xs:justify-end">
            {group.pages.length > 1 && (
              <>
                <span
                  aria-label={`Сторінка ${pageIdx + 1} з ${group.pages.length}`}
                  className="font-display mr-1 min-w-[2.75rem] text-center text-sm tabular-nums text-navy/45"
                >
                  {pageIdx + 1}/{group.pages.length}
                </span>
                <button
                  type="button"
                  onClick={() => selectPage((pageIdx - 1 + group.pages.length) % group.pages.length)}
                  aria-label="Попередня сторінка"
                  className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-[color,border-color,background-color] duration-200 hover:border-navy/35 hover:bg-white/35 hover:text-navy active:bg-white/60 focus-visible:rounded-full"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
                    <path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => selectPage((pageIdx + 1) % group.pages.length)}
                  aria-label="Наступна сторінка"
                  className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-[color,border-color,background-color] duration-200 hover:border-navy/35 hover:bg-white/35 hover:text-navy active:bg-white/60 focus-visible:rounded-full"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
                    <path d="m10 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={openLightbox}
              aria-label={`Відкрити сторінку «${page.title}» повністю`}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-[color,border-color,background-color] duration-200 hover:border-blue/60 hover:bg-white/35 hover:text-blue active:bg-white/60 focus-visible:rounded-full"
            >
              <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
                <path d="M8 4h8v8M16 4 8.5 11.5M11 16H4V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${baseId}-lightbox-title`}
        onCancel={(event) => {
          event.preventDefault();
          closeLightbox();
        }}
        onClose={() => {
          setLightboxOpen(false);
          lightboxTriggerRef.current?.focus();
        }}
        onKeyDown={onDialogKeyDown}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeLightbox();
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-3 text-navy backdrop:bg-navy-deep/85 backdrop:backdrop-blur-sm open:flex open:items-center open:justify-center sm:p-6"
      >
        <div className="flex max-h-full w-full max-w-7xl flex-col overflow-hidden rounded-xl bg-silver shadow-[0_32px_96px_-24px_rgb(0_0_0/0.75)] ring-1 ring-white/25">
          <div className="flex min-h-16 items-center gap-4 border-b border-navy/10 px-4 py-3 sm:px-6">
            <div className="min-w-0 flex-1">
              <h3
                id={`${baseId}-lightbox-title`}
                className="truncate text-base font-bold tracking-tight text-navy sm:text-lg"
              >
                {page.title}
              </h3>
              <p className="mt-0.5 text-xs text-navy/50">
                Аркуш {pageIdx + 1} з {group.pages.length} · {group.label}
              </p>
            </div>
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Закрити перегляд аркуша"
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-colors duration-200 hover:border-navy/35 hover:bg-white/50 hover:text-navy"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="relative h-[min(72dvh,54rem)] min-h-0 bg-white">
            <Image
              src={page.src}
              alt={`Повний аркуш: ${page.title}`}
              fill
              sizes="calc(100vw - 48px)"
              className="object-contain object-top"
            />

            {group.pages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => selectPage((pageIdx - 1 + group.pages.length) % group.pages.length)}
                  aria-label="Попередній аркуш"
                  className="absolute top-1/2 left-2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-navy/85 text-white shadow-lg transition-colors duration-200 hover:bg-navy sm:left-4"
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
                    <path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => selectPage((pageIdx + 1) % group.pages.length)}
                  aria-label="Наступний аркуш"
                  className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-navy/85 text-white shadow-lg transition-colors duration-200 hover:bg-navy sm:right-4"
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
                    <path d="m10 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
          </div>

          <div className="flex min-h-14 items-center justify-between gap-4 border-t border-navy/10 px-4 py-3 sm:px-6">
            <p className="line-clamp-2 text-xs leading-relaxed text-navy/60 sm:text-sm">
              {page.note}
            </p>
            <span className="font-display shrink-0 text-sm font-medium tabular-nums text-navy/50">
              {pageIdx + 1}/{group.pages.length}
            </span>
          </div>
        </div>
      </dialog>
    </div>
  );
}

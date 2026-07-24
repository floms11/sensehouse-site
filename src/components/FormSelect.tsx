"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

export type FormSelectOption = {
  value: string;
  label: string;
};

type FormSelectProps = {
  id: string;
  name: string;
  value: string;
  options: FormSelectOption[];
  placeholder: string;
  ariaLabel: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
};

export default function FormSelect({
  id,
  name,
  value,
  options,
  placeholder,
  ariaLabel,
  onChange,
  invalid = false,
  describedBy,
}: FormSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openUpward, setOpenUpward] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = `${id}-listbox`;
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (!open) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const showMenu = (
    initialIndex = selectedIndex >= 0 ? selectedIndex : 0,
  ) => {
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const estimatedHeight = Math.min(options.length * 48 + 12, 288);
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < estimatedHeight && rect.top > spaceBelow);
    }
    setActiveIndex(initialIndex);
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  };

  const move = (direction: 1 | -1) => {
    if (!open) {
      const start = selectedIndex >= 0 ? selectedIndex : 0;
      showMenu((start + direction + options.length) % options.length);
      return;
    }

    setActiveIndex((current) => {
      return (current + direction + options.length) % options.length;
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Home" && open) {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End" && open) {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(activeIndex);
      else showMenu();
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Tab") {
      setOpen(false);
    } else if (open && event.key.length === 1) {
      const query = event.key.toLocaleLowerCase("uk");
      const matchIndex = options.findIndex(
        (option, index) =>
          index > activeIndex &&
          option.label.toLocaleLowerCase("uk").startsWith(query),
      );
      const wrappedIndex = options.findIndex((option) =>
        option.label.toLocaleLowerCase("uk").startsWith(query),
      );
      const nextIndex = matchIndex >= 0 ? matchIndex : wrappedIndex;
      if (nextIndex >= 0) {
        event.preventDefault();
        setActiveIndex(nextIndex);
      }
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={
          open ? `${listboxId}-option-${activeIndex}` : undefined
        }
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : showMenu())}
        onKeyDown={onKeyDown}
        className={`flex min-h-13 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border bg-navy-deep/65 py-3 pr-2.5 pl-4 text-left shadow-[inset_0_1px_0_rgb(255_255_255/0.025)] transition-[border-color,background-color,box-shadow] duration-200 hover:border-silver/35 focus:border-blue focus:bg-navy-deep/80 focus:shadow-[0_0_0_3px_rgb(33_180_255/0.12)] focus:outline-none ${
          invalid ? "border-red-400/70" : "border-silver/18"
        }`}
      >
        <span
          className={`min-w-0 truncate ${
            selectedOption?.value ? "text-silver" : "text-silver-dim/55"
          }`}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <span
          aria-hidden="true"
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg border bg-white/[0.04] transition-[color,border-color,rotate] duration-200 ${
            open
              ? "rotate-180 border-blue/35 text-blue"
              : "border-silver/10 text-silver-dim"
          }`}
        >
          <svg viewBox="0 0 20 20" className="size-4" fill="none">
            <path
              d="m5.5 7.5 4.5 4.5 4.5-4.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className={`absolute z-50 w-full overflow-hidden rounded-xl border border-blue/20 bg-navy-deep/98 p-1.5 shadow-[0_24px_64px_-18px_rgb(0_0_0/0.85)] backdrop-blur-xl ${
            openUpward ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <div className="max-h-72 overflow-y-auto overscroll-contain">
            {options.map((option, index) => {
              const selected = option.value === value;
              const active = index === activeIndex;

              return (
                <button
                  key={option.value || "__empty"}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  id={`${listboxId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onPointerMove={() => setActiveIndex(index)}
                  onClick={() => choose(index)}
                  className={`flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-blue/15 text-white"
                      : selected
                        ? "text-blue-soft"
                        : "text-silver/85 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span className="flex size-5 shrink-0 items-center justify-center text-blue">
                    {selected && (
                      <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
                        <path
                          d="m4.5 10 3.4 3.4 7.6-7.6"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

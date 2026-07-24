import Logo from "./Logo";
import ContactActions from "./ContactActions";
import { site } from "@/config/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-silver/10 bg-navy-deep py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo idPrefix="sh-ftr" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-silver-dim">
              Електрика та розумний дім під ключ: проєктування, монтаж,
              інтеграція та підтримка інженерних систем як однієї цілісної
              системи.
            </p>
            <p className="mt-4 text-sm text-silver-dim">
              {site.geo.primary} та {site.geo.region}. {site.geo.note}
            </p>
          </div>

          <nav aria-label="Навігація у футері">
            <h3 className="font-display text-[0.75rem] font-medium tracking-[0.2em] text-silver-dim uppercase">
              Розділи
            </h3>
            <ul className="mt-4 space-y-2.5">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-block py-0.5 text-sm text-silver/85 transition-colors hover:text-blue-soft"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-display text-[0.75rem] font-medium tracking-[0.2em] text-silver-dim uppercase">
              Контакти
            </h3>
            <div className="mt-4">
              <ContactActions layout="full" className="gap-3 text-sm" />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-silver/10 pt-6 text-xs text-silver-dim/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Sense House. Усі права захищено.</p>
          {/*
            Посилання на політику конфіденційності зʼявиться тут після
            надання документа або URL — див. README, «Відсутні матеріали».
          */}
        </div>
      </div>
    </footer>
  );
}

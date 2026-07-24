import ProjectShowcase from "./ProjectShowcase";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const documents = [
  {
    title: "Плани та розгортки",
    text: "Фіксують розташування точок, обладнання й трас, щоб монтаж відповідав плануванню та інтерʼєру.",
  },
  {
    title: "Кабельний журнал",
    text: "Повʼязує кожну лінію з її призначенням, маркою кабелю та місцем підключення.",
  },
  {
    title: "Схеми електрощитів",
    text: "Показують захист, компонування та звʼязки — щит можна перевірити до складання й обслуговувати після запуску.",
  },
  {
    title: "Маркування",
    text: "Коди на кресленнях, кабелях і в щитах збігаються, тому систему не потрібно вивчати заново під час сервісу.",
  },
  {
    title: "Фотофіксація",
    text: "Положення прихованих трас зберігається до закриття стін і доповнює комплект документації по обʼєкту.",
  },
];

export default function ApproachSection() {
  return (
    <section
      id="design"
      aria-labelledby="design-title"
      className="relative overflow-hidden bg-silver py-24 text-navy sm:py-32"
    >
      <div
        aria-hidden="true"
        className="blueprint-grid--light blueprint-grid pointer-events-none absolute inset-0"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:items-end lg:gap-20">
          <SectionHeading
            eyebrow="Проєктування"
            title={<span id="design-title">Документація, що працює і під час монтажу, і після нього</span>}
            onLight
          />
          <Reveal>
            <p className="max-w-2xl text-base leading-relaxed text-navy/70 sm:text-lg">
              Технічний проєкт переводить побажання у перевірювані рішення.
              Він узгоджує будівельні роботи, електрику та автоматику, зменшує
              кількість рішень “на місці” й залишається картою системи після
              запуску.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid items-start gap-14 lg:mt-18 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,.75fr)] lg:gap-20">
          <Reveal delay={80}>
            <ProjectShowcase />
            <p className="mt-4 text-xs leading-relaxed text-navy/55">
              Фрагменти робочої технічної документації Sense House. Вміст
              комплекту формується під конкретний обʼєкт і обсяг робіт.
            </p>
          </Reveal>

          <ol className="divide-y divide-navy/12 border-y border-navy/12">
            {documents.map((document, index) => (
              <Reveal
                as="li"
                key={document.title}
                delay={index * 60}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 py-5"
              >
                <span className="font-display text-xs font-semibold tracking-[0.16em] text-blue">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-bold tracking-tight text-navy">
                    {document.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/68">
                    {document.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

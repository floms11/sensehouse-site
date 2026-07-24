import ProjectShowcase from "./ProjectShowcase";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const proofs = [
  {
    title: "Детальний технічний проєкт",
    text: "Плани розеток і освітлення, кабельні траси, щитова та логіка системи — усе визначено до початку монтажу.",
  },
  {
    title: "Кабельний журнал і маркування",
    text: "Кожна лінія має код, призначення та місце в щиті. Через роки будь-який фахівець розбереться в системі.",
  },
  {
    title: "Фіксація прихованих робіт",
    text: "Фото- та відеофіксація трас до закриття стін. Ви завжди знаєте, що і де прокладено.",
  },
  {
    title: "Налаштування під ваші звички",
    text: "Сценарії та документація передаються після запуску, а система налаштовується під те, як ви живете.",
  },
];

/** Факти з реального проєкту «Власна оселя 001» */
const facts = [
  ["92", "м² обʼєкта"],
  ["83", "кабельні лінії"],
  ["3", "електрощити"],
  ["147", "аркушів"],
];

export default function ApproachSection() {
  return (
    <section id="approach" className="scroll-mt-24 bg-silver py-24 text-navy sm:py-32">
      <div className="blueprint-grid--light blueprint-grid mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Підхід"
          title="Спочатку проєктуємо логіку. Потім монтуємо."
          onLight
          description={
            <>
              Ми дивимося на будинок як на єдину систему. До початку монтажу
              визначаємо функціонал, сценарії, розміщення обладнання, кабельні
              траси, щити, мережу та майбутні інтеграції. Ви заздалегідь
              розумієте склад системи, матеріали й логіку реалізації.
            </>
          }
        />

        <div className="mt-14 grid items-start gap-14 lg:mt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          {/* Реальний проєкт — стриманий обʼєкт, не банер */}
          <Reveal delay={100}>
            <ProjectShowcase />

            {/* Факти проєкту — тонкий статистичний ряд */}
            <dl className="mt-10 grid grid-cols-4 divide-x divide-navy/10 border-y border-navy/10 py-5">
              {facts.map(([value, label]) => (
                <div key={label} className="px-3 text-center first:pl-0 last:pr-0 sm:px-5">
                  <dt className="order-2 mt-1 block text-[0.72rem] leading-tight text-navy/55 sm:text-[0.78rem]">
                    {label}
                  </dt>
                  <dd className="font-display text-xl font-semibold tracking-tight text-navy sm:text-2xl">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-navy/45">
              Сторінки реального технічного проєкту Sense House «Власна оселя 001».
            </p>
          </Reveal>

          {/* Підтвердження системного підходу */}
          <div className="flex flex-col gap-9 lg:pt-2">
            {proofs.map((proof, i) => (
              <Reveal key={proof.title} delay={i * 100}>
                <div className="flex gap-4">
                  <div aria-hidden="true" className="mt-2 h-px w-8 shrink-0 bg-blue" />
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-navy">
                      {proof.title}
                    </h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-navy/70">
                      {proof.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={400}>
              <p className="border-t border-navy/10 pt-6 text-sm leading-relaxed text-navy/60">
                Працюємо з перевіреними платформами автоматизації — зокрема
                Svit та i3, а також Loxone і Home Assistant — і підбираємо
                рішення під задачі конкретного будинку, а не навпаки.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

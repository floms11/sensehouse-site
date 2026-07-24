import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SmartLine from "./SmartLine";

const foundation = {
  label: "01 — Основа",
  title: "Електрика, спроєктована наперед",
  intro:
    "Правильна інженерна база: розрахована, задокументована й готова до розвитку системи.",
  items: [
    "Технічний проєкт електрики",
    "Розетки, освітлення, кабельні траси",
    "Електрощити та захист",
    "Слаботочні системи й локальна мережа",
    "Резервне живлення: інвертори, акумулятори",
    "Документація по обʼєкту",
  ],
};

const intelligence = {
  label: "02 — Логіка",
  title: "Будинок, який думає",
  intro:
    "На готовій основі будується логіка комфорту: будинок реагує на події та підлаштовується під вас.",
  items: [
    "Сценарії освітлення",
    "Клімат і тепла підлога по кімнатах",
    "Безпека, відеоспостереження, захист від протікання",
    "Штори, ворота, доступ",
    "Керування енергією та резервом",
    "Один застосунок для всієї системи",
  ],
};

function Column({
  data,
  accent,
  delay,
}: {
  data: typeof foundation;
  accent: "silver" | "blue";
  delay: number;
}) {
  return (
    <Reveal
      delay={delay}
      className="relative rounded-card border border-silver/10 bg-graphite/60 p-8 sm:p-10"
    >
      <p
        className={`font-display text-[0.78rem] font-medium tracking-[0.2em] uppercase ${
          accent === "blue" ? "text-blue" : "text-silver-dim"
        }`}
      >
        {data.label}
      </p>
      <h3 className="mt-3 text-2xl font-bold tracking-tight text-silver">
        {data.title}
      </h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-silver-dim">
        {data.intro}
      </p>
      <ul className="mt-7 space-y-3">
        {data.items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[0.95rem] text-silver/90">
            <svg
              viewBox="0 0 16 16"
              className={`mt-1.5 size-2.5 shrink-0 ${
                accent === "blue" ? "text-blue" : "text-silver-dim"
              }`}
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="3" fill="currentColor" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

/**
 * Секція «Рішення»: електрика та інтелект — не дві послуги,
 * а дві частини одного результату, зʼєднані Smart Line.
 */
export default function SystemsSection() {
  return (
    <section id="solutions" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Рішення"
          title="Одна інженерна основа. Один комфортний будинок."
          description="Ми не продаємо окремі послуги. Спочатку створюємо правильну електричну основу, а потім будуємо на ній логіку комфорту — тому все працює узгоджено."
        />

        <div className="relative mt-14 grid gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-24">
          <Column data={foundation} accent="silver" delay={0} />

          {/* Лінія-звʼязок між основою та логікою (desktop) */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 hidden w-40 -translate-x-1/2 -translate-y-1/2 lg:block"
          >
            <SmartLine
              viewBox="0 0 160 40"
              d="M0 20h64l8-10 8 20 8-10h72"
              dots={[
                [4, 20],
                [156, 20, "gold"],
              ]}
              className="h-10 w-full"
            />
          </div>
          {/* Вертикальна лінія-звʼязок (mobile) */}
          <div
            aria-hidden="true"
            className="mx-auto -my-4 h-14 w-px bg-gradient-to-b from-blue/0 via-blue/60 to-blue/0 lg:hidden"
          />

          <Column data={intelligence} accent="blue" delay={150} />
        </div>

        <Reveal delay={200} className="mt-12 max-w-2xl lg:mt-14">
          <p className="text-[0.95rem] leading-relaxed text-silver-dim">
            Тому кабельні траси враховують майбутні сценарії, щитова готова до
            автоматики, а мережа — до камер і серверного обладнання. Нічого не
            доводиться переробляти.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const solutions = [
  {
    id: "01",
    title: "Електрика під ключ",
    text: "Від проєкту й кабельних трас до підключення та перевірки — узгоджена електрична система без рішень “на місці”.",
  },
  {
    id: "02",
    title: "Технічне проєктування",
    text: "Креслення, розрахунки й специфікації, за якими зрозуміло, що монтувати, де прокладати та як обслуговувати.",
  },
  {
    id: "03",
    title: "Електрощити",
    text: "Логічне компонування, захист і маркування кожної групи — для безпечної експлуатації та зрозумілого сервісу.",
  },
  {
    id: "04",
    title: "Розумний дім і сценарії",
    text: "Освітлення, клімат і безпека працюють за спільною логікою: будинок змінює стан за сценаріями, а керування залишається простим.",
  },
  {
    id: "05",
    title: "Резервне живлення",
    text: "Критичні системи будинку продовжують працювати під час перебоїв, а перемикання не потребує зайвих дій.",
  },
  {
    id: "06",
    title: "Мережа та відеоспостереження",
    text: "Стабільний Wi‑Fi, дротова мережа й контроль території проєктуються разом із будинком, а не додаються після ремонту.",
  },
];

export default function SystemsSection() {
  return (
    <section id="solutions" aria-labelledby="solutions-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Рішення"
              title={<span id="solutions-title">Весь комплекс або окремий інженерний етап</span>}
              description="Можемо взяти відповідальність за систему від технічного завдання до запуску або підключитися до конкретної частини проєкту."
            />

            <Reveal delay={100} className="mt-8 border-l border-gold/70 pl-5">
              <p className="max-w-md text-sm leading-relaxed text-silver-dim">
                У комплексній реалізації рішення узгоджуються між собою
                заздалегідь: електрика враховує сценарії розумного дому, мережа
                — камери й точки доступу, а щити — резерв і майбутнє
                обслуговування.
              </p>
            </Reveal>
          </div>

          <ol className="divide-y divide-silver/10 border-y border-silver/10">
            {solutions.map((solution, index) => (
              <Reveal
                as="li"
                key={solution.id}
                delay={(index % 3) * 70}
                className="group grid gap-3 py-6 sm:grid-cols-[3.5rem_minmax(12rem,.72fr)_minmax(0,1fr)] sm:items-start sm:gap-6"
              >
                <span className="font-display text-xs font-medium tracking-[0.16em] text-blue">
                  {solution.id}
                </span>
                <h3 className="text-lg font-bold tracking-tight text-silver transition-colors duration-200 group-hover:text-blue-soft">
                  {solution.title}
                </h3>
                <p className="text-[0.94rem] leading-relaxed text-silver-dim">
                  {solution.text}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

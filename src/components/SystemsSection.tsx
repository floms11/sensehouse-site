import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const solutions = [
  {
    id: "01",
    title: "Електрика під ключ",
    text: "Від проєкту й кабельних трас до підключення та перевірки — узгоджена електрична система без рішень “на місці”.",
    href: "/posluhy/elektromontazh-kropyvnytskyi",
  },
  {
    id: "02",
    title: "Технічне проєктування",
    text: "Креслення, розрахунки й специфікації, за якими зрозуміло, що монтувати, де прокладати та як обслуговувати.",
    href: "/posluhy/proektuvannia-elektryky-kropyvnytskyi",
  },
  {
    id: "03",
    title: "Електрощити",
    text: "Логічне компонування, захист і маркування кожної групи — для безпечної експлуатації та зрозумілого сервісу.",
    href: "/posluhy/elektroshchyty-kropyvnytskyi",
  },
  {
    id: "04",
    title: "Розумний дім і сценарії",
    text: "Автоматизація обʼєднує освітлення, клімат і безпеку в спільну логіку, а керування залишається простим.",
    href: "/posluhy/rozumnyi-dim-kropyvnytskyi",
  },
  {
    id: "05",
    title: "Резервне живлення",
    text: "Критичні системи обʼєкта отримують живлення під час перебоїв — за схемою, спроєктованою під його навантаження та задачі.",
    href: "/posluhy/rezervne-zhyvlennia-kropyvnytskyi",
  },
  {
    id: "06",
    title: "Мережа та відеоспостереження",
    text: "Стабільний Wi‑Fi, дротова мережа й контроль території проєктуються разом з обʼєктом, а не додаються після ремонту.",
    href: "/posluhy/merezha-ta-videosposterezhennia-kropyvnytskyi",
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
                заздалегідь: електрика враховує майбутню автоматизацію, мережа
                — камери й точки доступу, а щити — резерв і подальше
                обслуговування.
              </p>
            </Reveal>
          </div>

          <ol className="divide-y divide-silver/10 border-y border-silver/10">
            {solutions.map((solution, index) => (
              <Reveal as="li" key={solution.id} delay={(index % 3) * 70}>
                <Link
                  href={solution.href}
                  className="group -mx-3 grid gap-3 rounded-card px-3 py-6 transition-colors duration-200 hover:bg-silver/[0.04] sm:grid-cols-[3.5rem_minmax(12rem,.72fr)_minmax(0,1fr)] sm:items-start sm:gap-6"
                >
                  <span className="font-display text-xs font-medium tracking-[0.16em] text-blue">
                    {solution.id}
                  </span>
                  <h3 className="text-lg font-bold tracking-tight text-silver transition-colors duration-200 group-hover:text-blue-soft">
                    {solution.title}
                  </h3>
                  <div>
                    <p className="text-[0.94rem] leading-relaxed text-silver-dim">
                      {solution.text}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue transition-colors duration-200 group-hover:text-blue-soft">
                      Детальніше
                      <svg
                        viewBox="0 0 20 20"
                        className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 10h12m-5-5 5 5-5 5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

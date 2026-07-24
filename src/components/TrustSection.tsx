import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const principles = [
  {
    title: "Повний цикл в одній команді",
    text: "Від консультації та проєкту до монтажу, запуску й підтримки — без передавання відповідальності між підрядниками.",
  },
  {
    title: "Проєкт перед монтажем",
    text: "Жодного кабелю до затвердженого технічного проєкту. Рішення ухвалюються на папері, а не в стіні.",
  },
  {
    title: "Прозорий перелік матеріалів",
    text: "Ви бачите, що саме закладається у ваш будинок: специфікація обладнання та матеріалів — частина проєкту.",
  },
  {
    title: "Документування прихованих робіт",
    text: "Траси, зʼєднання та маркування зафіксовані до закриття стін і передаються вам разом із документацією.",
  },
  {
    title: "Навчання та підтримка",
    text: "Після запуску ми навчаємо вас керувати системою й залишаємося на звʼязку після здачі обʼєкта.",
  },
  {
    title: "Гарантія на роботи та обладнання",
    text: "Умови гарантії фіксуються в договорі — на роботи й на встановлене обладнання.",
  },
];

/**
 * Секція довіри: реальні принципи роботи замість вигаданих метрик.
 */
export default function TrustSection() {
  return (
    <section className="relative bg-graphite/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Принципи"
          title="Інженерія, яку можна перевірити."
          description="Ми не рахуємо себе в цифрах. Замість метрик — принципи, які можна побачити в проєкті, документації та в тому, як зроблена робота."
        />

        <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 100}>
              <div className="border-t border-silver/15 pt-5">
                <h3 className="text-lg font-bold tracking-tight text-silver">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-silver-dim">
                  {p.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

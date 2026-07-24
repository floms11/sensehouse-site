import ScenarioSwitcher from "./ScenarioSwitcher";
import SectionHeading from "./SectionHeading";

export default function ScenariosSection() {
  return (
    <section id="scenarios" className="relative bg-navy-deep/60 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Можливості"
          title="Як це відчувається в житті"
          description="Не список функцій, а чотири звичні моменти дня. Оберіть сценарій — і подивіться, як реагує будинок."
        />
        <ScenarioSwitcher />
      </div>
    </section>
  );
}

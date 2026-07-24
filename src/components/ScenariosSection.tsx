import ScenarioSwitcher from "./ScenarioSwitcher";
import SectionHeading from "./SectionHeading";

export default function ScenariosSection() {
  return (
    <section id="scenarios" aria-labelledby="scenarios-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Сценарії"
          title={<span id="scenarios-title">Одна дія змінює стан усього будинку</span>}
          description="Оберіть сценарій і подивіться, як узгоджено реагують світло, клімат, безпека та інші системи."
        />
        <ScenarioSwitcher />
      </div>
    </section>
  );
}

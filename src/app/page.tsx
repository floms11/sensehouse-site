import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SystemsSection from "@/components/SystemsSection";
import ScenariosSection from "@/components/ScenariosSection";
import ApproachSection from "@/components/ApproachSection";
import ProcessTimeline from "@/components/ProcessTimeline";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import MobileContactBar from "@/components/MobileContactBar";

export default function Home() {
  return (
    <>
      <Header />

      <main id="main" className="flex-1">
        <Hero />
        <SystemsSection />
        <ProcessTimeline />
        <ScenariosSection />
        <ApproachSection />
        <FinalCTA />
      </main>

      <Footer />
      <MobileContactBar />
    </>
  );
}

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SystemsSection from "@/components/SystemsSection";
import ScenariosSection from "@/components/ScenariosSection";
import ApproachSection from "@/components/ApproachSection";
import ProcessTimeline from "@/components/ProcessTimeline";
import TrustSection from "@/components/TrustSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import MobileContactBar from "@/components/MobileContactBar";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-button focus:bg-blue focus:px-5 focus:py-3 focus:font-semibold focus:text-navy-deep"
      >
        Перейти до змісту
      </a>

      <Header />

      <main id="main" className="flex-1">
        <Hero />
        <SystemsSection />
        <ScenariosSection />
        <ApproachSection />
        <ProcessTimeline />
        <TrustSection />
        <FinalCTA />
      </main>

      <Footer />
      <MobileContactBar />
    </>
  );
}

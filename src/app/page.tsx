import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SystemsSection from "@/components/SystemsSection";
import BusinessCallout from "@/components/BusinessCallout";
import EngineeringLayersSection from "@/components/EngineeringLayersSection";
import ApproachSection from "@/components/ApproachSection";
import ProcessTimeline from "@/components/ProcessTimeline";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import MobileContactBar from "@/components/MobileContactBar";
import { homeStructuredData } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <Header />

      <main id="main" className="flex-1">
        <Hero />
        <SystemsSection />
        <BusinessCallout />
        <EngineeringLayersSection />
        <ProcessTimeline />
        <ApproachSection />
        <FinalCTA />
      </main>

      <Footer />
      <MobileContactBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />
    </>
  );
}

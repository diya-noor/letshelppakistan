import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { IntroStrip } from "@/components/intro-strip";
import { StatsBand } from "@/components/stats-band";
import { VisionMission } from "@/components/vision-mission";
import { ProgramsGrid } from "@/components/programs-grid";
import { FeaturedInitiatives } from "@/components/featured-initiatives";
import { CoreValues } from "@/components/core-values";
import { GetInvolved } from "@/components/get-involved";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <IntroStrip />
      <StatsBand />
      <VisionMission />
      <ProgramsGrid />
      <FeaturedInitiatives />
      <CoreValues />
      <GetInvolved />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}

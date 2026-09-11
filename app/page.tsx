import { Header } from "@/components/header";
import { HeroSection } from "@/components/public/hero-section";
import { AboutSection } from "@/components/public/about-section";
import { SubClubsSection } from "@/components/public/sub-clubs-section";
import { EventsSection } from "@/components/public/events-section";
import { ProjectsSection } from "@/components/public/projects-section";
import { GallerySection } from "@/components/public/gallery-section";
import { NewsSection } from "@/components/public/news-section";
import { SponsorsSection } from "@/components/public/sponsors-section";
import { RecruitmentSection } from "@/components/public/recruitment-section";
import { ContactSection } from "@/components/public/contact-section";
import { Footer } from "@/components/public/footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col selection:bg-[#5B50E5]/20 selection:text-[#5B50E5]">
      <Header />
      <HeroSection />
      <AboutSection />
      <SubClubsSection />
      <EventsSection />
      <ProjectsSection />
      <GallerySection />
      <NewsSection />
      <SponsorsSection />
      <RecruitmentSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

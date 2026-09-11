import { Header } from "@/components/header";
import { AboutSection } from "@/components/public/about-section";
import { SubClubsSection } from "@/components/public/sub-clubs-section";
import { Footer } from "@/components/public/footer";

export const metadata = {
  title: "About Vistara — Vistara Student Club",
  description: "Learn about the mission, history, 7 specialized sub-clubs, and executive leadership council of Vistara Student Club.",
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col pt-16">
      <Header />
      <div className="pt-10">
        <AboutSection />
        <SubClubsSection />
      </div>
      <Footer />
    </main>
  );
}

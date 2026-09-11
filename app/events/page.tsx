import { Header } from "@/components/header";
import { EventsSection } from "@/components/public/events-section";
import { Footer } from "@/components/public/footer";

export const metadata = {
  title: "Events & Workshops — Vistara Student Club",
  description: "Browse upcoming college fests, 24-hour hackathons, acoustic music nights, and register online for On-Duty verification.",
};

export default function EventsPage() {
  return (
    <main className="flex min-h-screen flex-col pt-16">
      <Header />
      <div className="pt-10">
        <EventsSection />
      </div>
      <Footer />
    </main>
  );
}

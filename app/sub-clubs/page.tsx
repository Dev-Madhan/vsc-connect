import { Header } from "@/components/header";
import { SubClubsSection } from "@/components/public/sub-clubs-section";
import { Footer } from "@/components/public/footer";
import Link from "next/link";
import { ArrowRight, Sparkles, Users, Award, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Sub-Clubs & Specialized Wings — Vistara Student Club",
  description: "Explore the 7 specialized wings of Vistara: Dance, Music, Media, Tech, Compering, Fashion, and Art. Learn about coordinators, activities, and join.",
};

export default function SubClubsPage() {
  return (
    <main className="flex min-h-screen flex-col pt-12">
      <Header />

      {/* Hero Banner for Sub-Clubs */}
      <section className="pt-16 pb-6 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>7 Specialized Wings</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          Where Passion Finds Its Platform
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Every student brings unique creativity. Vistara unites 7 specialized sub-clubs under one official digital ecosystem for events, training, and leadership.
        </p>
      </section>

      {/* Sub-Clubs Section */}
      <SubClubsSection />

      {/* Join Banner */}
      <section className="py-16 bg-[#5B50E5]/5 border-t border-b border-[#5B50E5]/15">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
            Ready to Represent Your Sub-Club?
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Annual recruitment for core teams, performers, and technical coordinators is currently open. Submit your application through our portal.
          </p>
          <div className="pt-2">
            <Link
              href="/recruitment"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5B50E5] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4C40D4] shadow-md shadow-[#5B50E5]/20 transition-all"
            >
              <span>Apply for Sub-Club Recruitment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

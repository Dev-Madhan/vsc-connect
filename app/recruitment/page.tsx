import { Header } from "@/components/header";
import { RecruitmentSection } from "@/components/public/recruitment-section";
import { SubClubsSection } from "@/components/public/sub-clubs-section";
import { Footer } from "@/components/public/footer";

export const metadata = {
  title: "Join Vistara Club — 2026 Recruitments",
  description: "Apply for auditions and technical interviews across all 7 wings of Vistara Student Club.",
};

export default function RecruitmentPage() {
  return (
    <main className="flex min-h-screen flex-col pt-16">
      <Header />
      <div className="pt-10">
        <RecruitmentSection />
        <SubClubsSection />
      </div>
      <Footer />
    </main>
  );
}

import { Header } from "@/components/header";
import { ProjectsSection } from "@/components/public/projects-section";
import { Footer } from "@/components/public/footer";

export const metadata = {
  title: "Student Projects & Innovations — Vistara Student Club",
  description: "Explore open-source platforms, apps, and stage installations built by student developers and designers at Vistara.",
};

export default function ProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col pt-16">
      <Header />
      <div className="pt-10">
        <ProjectsSection />
      </div>
      <Footer />
    </main>
  );
}

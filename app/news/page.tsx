import { Header } from "@/components/header";
import { NewsSection } from "@/components/public/news-section";
import { Footer } from "@/components/public/footer";

export const metadata = {
  title: "News & Bulletins — Vistara Student Club",
  description: "Official updates, championship results, and notices from the Vistara Student Club Executive Board.",
};

export default function NewsPage() {
  return (
    <main className="flex min-h-screen flex-col pt-16">
      <Header />
      <div className="pt-10">
        <NewsSection />
      </div>
      <Footer />
    </main>
  );
}

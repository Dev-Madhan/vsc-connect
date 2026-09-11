import { Header } from "@/components/header";
import { GallerySection } from "@/components/public/gallery-section";
import { Footer } from "@/components/public/footer";

export const metadata = {
  title: "Media Gallery — Vistara Student Club",
  description: "Explore the photographic and visual archives of Vistara cultural competitions, backstage preparation, and technical conferences.",
};

export default function GalleryPage() {
  return (
    <main className="flex min-h-screen flex-col pt-16">
      <Header />
      <div className="pt-10">
        <GallerySection />
      </div>
      <Footer />
    </main>
  );
}

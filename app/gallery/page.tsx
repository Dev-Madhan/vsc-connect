import { Header } from "@/components/header";
import { GalleryArchiveView } from "@/components/public/gallery-archive-view";
import { Footer } from "@/components/public/footer";

export const metadata = {
  title: "Media Gallery & Archives — VSC Connect",
  description: "Explore the photographic and visual archives of Vistara cultural competitions, hackathons, and backstage moments in our interactive folder vault.",
};

export default function GalleryPage() {
  return (
    <main className="flex min-h-screen flex-col pt-[52px]">
      <Header />
      <GalleryArchiveView />
      <Footer />
    </main>
  );
}


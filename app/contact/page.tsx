import { Header } from "@/components/header";
import { ContactSection } from "@/components/public/contact-section";
import { Footer } from "@/components/public/footer";

export const metadata = {
  title: "Contact Us — Vistara Student Club",
  description: "Reach out to the Vistara Student Club Executive Board for event partnerships, guest performances, or queries.",
};

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col pt-16">
      <Header />
      <div className="pt-10">
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 md:pb-16">
        <div className="container-padding max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">About Us</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Motojojo is India's premier platform for discovering and booking curated entertainment events. We bring together unique experiences, talented artists, and vibrant communities to create unforgettable memories. Whether you're looking for music, art, workshops, or local gatherings, Motojojo is your go-to destination for all things events.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
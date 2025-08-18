// /*
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ArtistsSection from "@/components/home/ArtistsSection";

export default function Artists() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 md:pb-16">
        <div className="container-padding">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Artists</h1>
          <ArtistsSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
// */ 
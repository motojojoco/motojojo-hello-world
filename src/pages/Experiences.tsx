import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ExperiencesSection from "@/components/home/ExperiencesSection";

export default function Experiences() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 md:pb-16">
        <div className="container-padding">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Experiences</h1>
          <ExperiencesSection />
        </div>
      </main>
      <Footer />
    </div>
  );
} 
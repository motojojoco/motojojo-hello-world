
import { useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/home/HeroSection";
import CityStrip from "@/components/home/CityStrip";
import ExperiencesSection from "@/components/home/ExperiencesSection";
import EventsSection from "@/components/home/EventsSection";
import ArtistsSection from "@/components/home/ArtistsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import PremiumPopup from "@/components/shared/PremiumPopup";

const Index = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <CityStrip />
        <ExperiencesSection />
        <EventsSection />
        <ArtistsSection />
        <CategoriesSection />
      </main>
      <Footer />
      <PremiumPopup />
    </div>
  );
};

export default Index;

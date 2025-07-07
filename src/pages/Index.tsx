import { useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/home/HeroSection";
import CityStrip from "@/components/home/CityStrip";
import EventsSection from "@/components/home/EventsSection";
import ArtistsSection from "@/components/home/ArtistsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import PremiumPopup from "@/components/shared/PremiumPopup";
import EventTypesSection from "@/components/home/EventTypesSection";
import CityExperiencesSection from "@/components/home/CityExperiencesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";

const Index = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pb-20 md:pb-0">
        <HeroSection />
        <CityStrip />
        <EventTypesSection />
        <CityExperiencesSection />
        <EventsSection />
        <ArtistsSection />
        <TestimonialsSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

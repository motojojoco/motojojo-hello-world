
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { banners } from "@/data/mockData";
import { FadeIn } from "@/components/ui/motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const [activeBanner, setActiveBanner] = useState(0);
  
  useEffect(() => {
    // Auto-scroll through banners
    const interval = setInterval(() => {
      setActiveBanner((current) => (current + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="w-full h-[80vh] md:h-[90vh] relative overflow-hidden mt-16">
      {/* Banner Images with Fade Transition */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === activeBanner ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Content */}
      <div className="container-padding relative z-10 h-full flex flex-col justify-center">
        <FadeIn delay={200}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-3xl">
            <span className="text-gradient">Experience</span> the Best Events in {" "}
            <span className="text-yellow">Your City</span>
          </h1>
        </FadeIn>
        
        <FadeIn delay={300}>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
            Discover and book curated experiences, from concerts to workshops, all in one place.
          </p>
        </FadeIn>
        
        <FadeIn delay={400}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-violet hover:bg-violet-700 transition-colors">
              <Link to="/events" className="flex items-center">
                Explore Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-violet text-violet hover:bg-violet/10 transition-colors">
              <Link to={banners[activeBanner].link} className="flex items-center">
                Featured Event
              </Link>
            </Button>
          </div>
        </FadeIn>
        
        {/* Banner Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveBanner(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeBanner
                  ? "bg-violet w-6"
                  : "bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { cities } from "@/data/mockData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getEventsByCity } from "@/services/eventService";

const CityStrip = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 300;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const handleCityClick = async (cityName: string) => {
    const events = await getEventsByCity(cityName);
    if (events && events.length > 0) {
      navigate(`/events?city=${encodeURIComponent(cityName)}`);
    } else {
      navigate("/membership");
    }
  };

  return (
    <section className="py-6 relative">
      <div className="container-padding">
        {/* City Scroll Controls */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full shadow-md"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full shadow-md"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Cities Horizontal Scroll */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide scroll-smooth"
        >
          {cities.map((city) => (
            <Button
              key={city.id}
              variant="outline"
              className="rounded-full whitespace-nowrap border-muted hover:border-violet hover:text-violet transition-colors"
              onClick={() => handleCityClick(city.name)}
            >
              {city.name}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityStrip;

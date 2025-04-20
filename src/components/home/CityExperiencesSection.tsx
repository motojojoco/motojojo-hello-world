
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { getEventCities, getEventsByCity } from "@/services/eventService";

const CityExperiencesSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: cities = [] } = useQuery({
    queryKey: ['event-cities'],
    queryFn: getEventCities
  });

  // We'll just use Mumbai for the sample implementation
  const { data: mumbaiEvents = [] } = useQuery({
    queryKey: ['events-mumbai'],
    queryFn: () => getEventsByCity('Mumbai'),
    enabled: cities.includes('Mumbai')
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 400;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container-padding">
        <FadeIn>
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Unique Experiences in Mumbai</h2>
            <div className="hidden md:flex space-x-2">
              <Button 
                size="icon" 
                variant="outline" 
                className="rounded-full"
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="rounded-full"
                onClick={() => scroll("right")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </FadeIn>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {mumbaiEvents.slice(0, 5).map((event, index) => (
            <FadeIn key={event.id} delay={100 * index}>
              <Card className="w-[300px] md:w-[400px] hover-scale overflow-hidden border-none shadow-soft">
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow hover:bg-yellow-600">Experience</Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-red" />
                    <span className="text-muted-foreground">{event.venue}, {event.city}</span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
                  <Button asChild>
                    <Link to={`/event/${event.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
        
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          {cities.slice(0, 6).map((city) => (
            <Button 
              key={city}
              variant={city === 'Mumbai' ? "default" : "outline"} 
              className={city === 'Mumbai' ? "rounded-full px-6" : "rounded-full px-6 border-violet text-violet hover:bg-violet/10"}
              asChild
            >
              <Link to={`/events?city=${city}`}>{city}</Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityExperiencesSection;

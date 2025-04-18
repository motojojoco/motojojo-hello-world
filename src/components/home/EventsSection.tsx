
import { useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { events } from "@/data/mockData";
import { FadeIn } from "@/components/ui/motion";
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const EventsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className="py-16">
      <div className="container-padding">
        <FadeIn>
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Upcoming Events</h2>
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
        
        {/* Events Carousel */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {events.map((event, index) => (
            <FadeIn key={event.id} delay={100 * index}>
              <Card className="w-[300px] md:w-[350px] hover-scale overflow-hidden border-none shadow-soft">
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-violet hover:bg-violet-700">{event.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold mb-1 line-clamp-1">{event.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.subtitle}</p>
                  
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red" />
                      <span>{event.city}, {event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-violet" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow" />
                      <span>{event.time} • {event.duration}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-5 pb-5 pt-0 flex justify-between items-center">
                  <div className="text-lg font-bold">₹{event.price}</div>
                  <Button asChild>
                    <Link to={`/event/${event.id}`}>Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            </FadeIn>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            className="border-violet text-violet hover:bg-violet/10 rounded-full px-8"
            asChild
          >
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;

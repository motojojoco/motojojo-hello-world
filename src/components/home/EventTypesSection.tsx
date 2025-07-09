import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getEventTypes } from "@/services/eventTypeService";

const EventTypesSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: eventTypes = [], isLoading } = useQuery({
    queryKey: ['event-types'],
    queryFn: getEventTypes
  });

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

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container-padding">
          <h2 className="section-title">Event Types</h2>
          <div className="flex justify-center py-8">
            <div className="animate-pulse flex space-x-4">
              <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
              <div className="space-y-4 flex-1">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container-padding">
        <FadeIn>
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Event Types</h2>
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
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth justify-center"
        >
          {eventTypes.map((type, index) => (
            <FadeIn key={type.id} delay={100 * index}>
              <Link to={`/events?type=${type.id}`}>
                <div className="w-full max-w-[170px] md:w-[170px] flex flex-col items-center justify-center text-center h-full">
                  {type.image_url ? (
                    <div className="w-32 h-44 md:w-48 md:h-64 mb-3">
                      <img
                        src={type.image_url}
                        alt={type.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-2xl">${type.icon || "🎭"}</div>`;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="rounded-full p-4 bg-violet/10 text-violet mb-3 text-2xl"
                    >
                      {type.icon || "🎭"}
                    </div>
                  )}
                  <h3 className="font-semibold text-lg">{type.name}</h3>
                  {type.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {type.description}
                    </p>
                  )}
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            className="border-violet text-white hover:bg-violet/10 rounded-full px-8"
            asChild
          >
            <Link to="/events">View All Event Types</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventTypesSection;

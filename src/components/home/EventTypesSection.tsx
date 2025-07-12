import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getEventTypes } from "@/services/eventTypeService";

const EventTypesSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
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
      <div>
        <FadeIn>
          <div className="flex justify-between items-center mb-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
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
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth justify-start px-4 md:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          {eventTypes.map((type, index) => {
            const isLocalGathering = type.name?.toLowerCase() === 'local gathering';
            return (
              <FadeIn key={type.id} delay={100 * index}>
                {isLocalGathering ? (
                  <button
                    type="button"
                    onClick={() => navigate('/local-gathering')}
                    className="focus:outline-none"
                  >
                    <Card className="w-[300px] md:w-[350px] hover-scale overflow-hidden border-none shadow-soft flex flex-col items-center justify-between">
                      <div className="relative h-80 overflow-hidden w-full bg-transparent">
                        {type.image_url ? (
                          <img
                            src={type.image_url}
                            alt={type.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class='w-full h-full flex items-center justify-center text-2xl'>${type.icon || "🎭"}</div>`;
                              }
                            }}
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center text-2xl bg-violet/10 text-violet"
                          >
                            {type.icon || "🎭"}
                          </div>
                        )}
                      </div>
                    </Card>
                  </button>
                ) : (
                  <Link to={`/events?type=${type.id}`}>
                    <Card className="w-[300px] md:w-[350px] hover-scale overflow-hidden border-none shadow-soft flex flex-col items-center justify-between">
                      <div className="relative h-80 overflow-hidden w-full bg-transparent">
                        {type.image_url ? (
                          <img
                            src={type.image_url}
                            alt={type.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class='w-full h-full flex items-center justify-center text-2xl'>${type.icon || "🎭"}</div>`;
                              }
                            }}
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center text-2xl bg-violet/10 text-violet"
                          >
                            {type.icon || "🎭"}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                )}
              </FadeIn>
            );
          })}
        </div>
        
        <div className="mt-8 text-center px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
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

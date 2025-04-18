
import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/motion";
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getEvents, Event } from "@/services/eventService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EventsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await getEvents();
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error",
          description: "Failed to load events. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Set up real-time subscription
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        async (payload) => {
          console.log('Real-time update received:', payload);
          // Refresh the events list when changes occur
          const refreshedEvents = await getEvents();
          setEvents(refreshedEvents);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

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

  if (loading) {
    return (
      <section className="py-16">
        <div className="container-padding">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="flex justify-center py-16">
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

  if (events.length === 0) {
    return (
      <section className="py-16">
        <div className="container-padding">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="flex justify-center py-16">
            <p className="text-muted-foreground">No events available at this time. Please check back later.</p>
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
                      <span>{event.time} • {event.duration || "2 hours"}</span>
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

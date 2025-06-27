import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Calendar,
  MapPin,
  Clock,
  Filter
} from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import { getEvents, getEventCities, Event } from "@/services/eventService";
import { getEventTypes, EventType } from "@/services/eventTypeService";
import { Separator } from "@/components/ui/separator";

const Events = () => {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedEventType, setSelectedEventType] = useState<string>("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  
  // Fetch all events
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents()
  });

  // Fetch cities
  const { data: cities = [] } = useQuery({
    queryKey: ['event-cities'],
    queryFn: getEventCities
  });

  // Fetch event types
  const { data: eventTypes = [] } = useQuery({
    queryKey: ['event-types'],
    queryFn: getEventTypes
  });

  // Apply filters
  useEffect(() => {
    const applyFilters = async () => {
      let filtered = events;
      
      if (selectedCity) {
        filtered = filtered.filter(event => event.city === selectedCity);
      }
      
      if (selectedEventType) {
        filtered = filtered.filter(event => event.event_type === selectedEventType);
      }
      
      setFilteredEvents(filtered);
    };
    
    applyFilters();
  }, [events, selectedCity, selectedEventType]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCity("");
    setSelectedEventType("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-20 md:pb-0">
        <div className="container-padding py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Explore All Events</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover and book the best events happening in your city. Filter by location, 
              type, and more to find the perfect experience for you.
            </p>
          </div>
          
          {/* Filters Section */}
          <div className="bg-card border rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Filters</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow max-w-2xl">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
          
          {/* Events Grid */}
          {eventsLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-pulse flex space-x-4">
                <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
                <div className="space-y-4 flex-1">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later for new events.
              </p>
              {(selectedCity || selectedEventType) && (
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredEvents.map((event, index) => (
                <FadeIn key={event.id} delay={100 * index}>
                  <Card className="hover-scale overflow-hidden border-none shadow-soft">
                    <div className="h-48 relative">
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
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;

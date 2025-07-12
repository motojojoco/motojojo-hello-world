import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Calendar,
  MapPin,
  Clock,
  Filter,
  Search,
  AlertCircle,
  History,
  Eye,
  ShoppingCart
} from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import { getEvents, getEventCities, Event } from "@/services/eventService";
import { getEventTypes, EventType } from "@/services/eventTypeService";
import { Separator } from "@/components/ui/separator";
import { getEventStatus, formatEventStatus } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedEventType, setSelectedEventType] = useState<string>("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [showAllPreviousEvents, setShowAllPreviousEvents] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { toast } = useToast();
  
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

  // Read city from query string and set filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const city = params.get('city');
    if (city) {
      setSelectedCity(city);
    }
  }, [location.search]);

  // If no events for selected city, show coming soon and redirect
  useEffect(() => {
    if (selectedCity && events.length > 0) {
      const cityEvents = events.filter(event => event.city === selectedCity);
      if (cityEvents.length === 0) {
        alert('We are coming soon in your city!');
        navigate('/membership');
      }
    }
  }, [selectedCity, events, navigate]);

  // Get all previous events
  const allPreviousEvents = events.filter(event => {
    const status = getEventStatus(event.date, event.time);
    return status === 'completed';
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group previous events by date
  const groupPreviousEventsByDate = (events: Event[]) => {
    const grouped: { [key: string]: Event[] } = {};
    
    events.forEach(event => {
      const dateKey = event.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    // Sort dates (most recent first)
    return Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).reduce((acc, date) => {
      acc[date] = grouped[date];
      return acc;
    }, {} as { [key: string]: Event[] });
  };

  const groupedPreviousEvents = groupPreviousEventsByDate(allPreviousEvents);

  // Apply filters and filter out completed events
  useEffect(() => {
    const applyFilters = async () => {
      let filtered = events.filter(event => {
        const status = getEventStatus(event.date, event.time);
        return status !== 'completed'; // Only show upcoming and ongoing events
      });
      
      if (selectedCity) {
        filtered = filtered.filter(event => event.city === selectedCity);
      }
      
      if (selectedEventType) {
        filtered = filtered.filter(event => event.event_type === selectedEventType);
      }
      
      // Sort by date (earliest first)
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setFilteredEvents(filtered);
    };
    
    applyFilters();
  }, [events, selectedCity, selectedEventType]);

  // Group events by date
  const groupEventsByDate = (events: Event[]) => {
    const grouped: { [key: string]: Event[] } = {};
    
    events.forEach(event => {
      const dateKey = event.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    // Sort dates
    return Object.keys(grouped).sort().reduce((acc, date) => {
      acc[date] = grouped[date];
      return acc;
    }, {} as { [key: string]: Event[] });
  };

  // Add to cart function
  const handleAddToCart = (event: Event) => {
    const cartItem = {
      id: `cart-${event.id}-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      eventImage: event.image,
      quantity: 1,
      price: event.has_discount && event.discounted_price ? event.discounted_price : event.price,
      date: event.date,
      venue: event.venue,
      city: event.city,
    };
    
    addItem(cartItem);
    toast({
      title: "Added to Cart",
      description: `${event.title} has been added to your cart.`,
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      weekday: 'long'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format date for grouping header
  const formatDateHeader = (dateString: string) => {
    if (!dateString) return '';
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const eventDate = new Date(dateString);
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      weekday: 'long'
    };
    
    if (eventDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return new Date(dateString).toLocaleDateString('en-US', options);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCity("");
    setSelectedEventType("");
  };

  const groupedEvents = groupEventsByDate(filteredEvents);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-20 md:pb-0">
        <div className="container-padding py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover and book the best upcoming events happening in your city. 
              All events are organized by date for easy browsing.
            </p>
            <div className="mt-6">
              <Button variant="outline" asChild>
                <Link to="/previousevents" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  View Past Events
                </Link>
              </Button>
              <Dialog open={showAllPreviousEvents} onOpenChange={setShowAllPreviousEvents}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="ml-4 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View All Previous Events
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      All Previous Events
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    {allPreviousEvents.length === 0 ? (
                      <div className="text-center py-8">
                        <h3 className="text-lg font-medium mb-2">No previous events found</h3>
                        <p className="text-muted-foreground">
                          There are no completed events to display.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {Object.entries(groupedPreviousEvents).map(([date, dateEvents]) => (
                          <div key={date}>
                            <div className="mb-4">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {formatDateHeader(date)}
                              </h3>
                              <p className="text-muted-foreground">
                                {formatDate(date)}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {dateEvents.map((event, index) => (
                                <Card key={event.id} className="hover-scale border-none shadow-soft overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
                                  <div className="h-32 relative">
                                    <img 
                                      src={event.image} 
                                      alt={event.title} 
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                                      <Badge className="bg-violet hover:bg-violet-700 text-xs">{event.category}</Badge>
                                      <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Event Over
                                      </Badge>
                                    </div>
                                  </div>
                                  <CardContent className="p-3">
                                    <h4 className="text-sm font-bold mb-1 line-clamp-1">{event.title}</h4>
                                    <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{event.subtitle}</p>
                                    
                                    <div className="flex items-center gap-1 text-xs mb-1">
                                      <MapPin className="h-3 w-3 text-red" />
                                      <span>{event.city}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                      <Clock className="h-3 w-3 text-violet" />
                                      <span>{event.time}</span>
                                    </div>
                                  </CardContent>
                                  <CardFooter className="px-3 pb-3 pt-0 flex justify-between items-center">
                                    <div className="text-sm font-bold">₹{event.price}</div>
                                    <Button variant="outline" size="sm" disabled className="text-gray-500 text-xs">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      Event Over
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
          
          {/* Events by Date */}
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
          ) : Object.entries(groupedEvents).length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No events found for the selected filters.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedEvents).map(([date, dateEvents]) => (
                <div key={date}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {formatDateHeader(date)}
                    </h2>
                  </div>
                  {/* Event cards grid with yellow padding */}
                  <div className="bg-sandstorm rounded-3xl px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dateEvents.map((event, index) => (
                        <FadeIn key={event.id} delay={index * 100}>
                          <Card className="hover-scale border-none shadow-soft overflow-hidden">
                            <div className="h-48 relative">
                              <img 
                                src={event.image} 
                                alt={event.title} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 right-3 flex flex-col gap-2">
                                <Badge className="bg-violet hover:bg-violet-700">{event.category}</Badge>
                                {(() => {
                                  const status = getEventStatus(event.date, event.time);
                                  const statusInfo = formatEventStatus(status);
                                  return (
                                    <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
                                      {statusInfo.text}
                                    </Badge>
                                  );
                                })()}
                              </div>
                            </div>
                            <CardContent className="p-5 text-black">
                              <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                              <p className="text-sm mb-4 line-clamp-2">{event.subtitle}</p>
                              <div className="flex items-center gap-2 text-sm mb-2">
                                <MapPin className="h-4 w-4" />
                                <span>{event.city}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4" />
                                <span>{event.time}</span>
                              </div>
                            </CardContent>
                            <CardFooter className="px-5 pb-5 pt-0 flex justify-between items-center text-black">
                              {event.has_discount && event.real_price && event.discounted_price ? (
                                <div className="flex flex-col items-start">
                                  <span className="text-base opacity-60 line-through decoration-2 decoration-red-500">₹{event.real_price}</span>
                                  <span className="text-lg font-bold text-red-600">₹{event.discounted_price}</span>
                                </div>
                              ) : (
                                <div className="text-lg font-bold">₹{event.price}</div>
                              )}
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleAddToCart(event)}
                                  className="flex items-center gap-1 bg-[#2d014d] text-white border-none hover:bg-[#3a0166]"
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                  Add to Cart
                                </Button>
                                <Button asChild size="sm">
                                  <Link to={`/event/${event.id}`}>Book Now</Link>
                                </Button>
                              </div>
                            </CardFooter>
                          </Card>
                        </FadeIn>
                      ))}
                    </div>
                  </div>
                </div>
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

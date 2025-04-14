
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import RazorpayButton from "@/components/ui/RazorpayButton";
import { FadeIn } from "@/components/ui/motion";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Tag, 
  Users, 
  DollarSign,
  Star 
} from "lucide-react";
import { events, artists } from "@/data/mockData";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [eventArtists, setEventArtists] = useState<any[]>([]);
  const [similarEvents, setSimilarEvents] = useState<any[]>([]);
  
  // Fetch event details
  useEffect(() => {
    if (id) {
      // Simulate API call with setTimeout
      setTimeout(() => {
        const eventId = parseInt(id);
        const foundEvent = events.find(e => e.id === eventId);
        
        if (foundEvent) {
          setEvent(foundEvent);
          
          // Get event artists
          if (foundEvent.artistIds && foundEvent.artistIds.length > 0) {
            const relatedArtists = artists.filter(artist => 
              foundEvent.artistIds.includes(artist.id)
            );
            setEventArtists(relatedArtists);
          }
          
          // Get similar events (same category)
          const related = events
            .filter(e => e.categoryId === foundEvent.categoryId && e.id !== foundEvent.id)
            .slice(0, 3);
          setSimilarEvents(related);
        }
        
        setLoading(false);
      }, 500);
    }
  }, [id]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Handle successful booking
  const handleBookingSuccess = () => {
    console.log("Booking successful for event:", id);
    // In a real app, you would update the user's bookings in the database
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading event details...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground">The event you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Event Banner */}
        <div className="w-full h-[50vh] md:h-[60vh] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/60 to-background" />
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container-padding mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details */}
            <div className="lg:col-span-2">
              <FadeIn>
                <Badge className="mb-4 bg-violet hover:bg-violet-700">{event.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                <h2 className="text-xl text-muted-foreground mb-6">{event.subtitle}</h2>
                
                <div className="prose text-foreground max-w-none mb-8">
                  <p>{event.description}</p>
                </div>
              </FadeIn>

              {/* Artists Section - If there are artists */}
              {eventArtists.length > 0 && (
                <FadeIn delay={100}>
                  <h3 className="text-2xl font-bold mb-4">Featured Artists</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {eventArtists.map(artist => (
                      <Card key={artist.id} className="border-none shadow-soft">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <Avatar className="h-16 w-16 mr-4 border-2 border-violet">
                              <AvatarImage src={artist.image} alt={artist.name} />
                              <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="text-lg font-bold">{artist.name}</h4>
                              <p className="text-muted-foreground">{artist.genre}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3">{artist.bio}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </FadeIn>
              )}

              {/* Reviews Section */}
              <FadeIn delay={200}>
                <h3 className="text-2xl font-bold mb-4">Community Reviews</h3>
                <div className="space-y-4 mb-12">
                  {event.reviews.map((review: any) => (
                    <Card key={review.id} className="border-none shadow-soft">
                      <CardContent className="p-6">
                        <div className="flex justify-between mb-2">
                          <div className="font-semibold">{review.name}</div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow text-yellow mr-1" />
                            <span>{review.rating}/5</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-1">{review.comment}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </FadeIn>
              
              {/* FAQ Section */}
              <FadeIn delay={300}>
                <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="mb-12">
                  {event.faq.map((item: any, index: number) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </FadeIn>
            </div>
            
            {/* Booking Card */}
            <div className="lg:col-span-1">
              <FadeIn delay={400}>
                <div className="sticky top-24">
                  <Card className="border-none shadow-soft overflow-hidden">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Event Details</h3>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-red mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium">Venue</div>
                            <div className="text-muted-foreground">{event.venue}, {event.city}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-violet mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium">Date</div>
                            <div className="text-muted-foreground">{formatDate(event.date)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-yellow mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium">Time & Duration</div>
                            <div className="text-muted-foreground">{event.time} • {event.duration}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <User className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium">Host</div>
                            <div className="text-muted-foreground">{event.host}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Tag className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium">Category</div>
                            <div className="text-muted-foreground">{event.category}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Users className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium">Availability</div>
                            <div className="text-muted-foreground">{event.seatsAvailable} seats available</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <DollarSign className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium">Price</div>
                            <div className="text-xl font-bold">₹{event.price.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="px-6 pb-6 pt-0">
                      <RazorpayButton 
                        eventId={event.id} 
                        eventName={event.title}
                        amount={event.price}
                        onSuccess={handleBookingSuccess}
                      />
                    </CardFooter>
                  </Card>
                </div>
              </FadeIn>
            </div>
          </div>
          
          {/* Similar Events */}
          {similarEvents.length > 0 && (
            <FadeIn delay={500}>
              <h3 className="text-2xl font-bold mt-12 mb-6">Similar Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {similarEvents.map(event => (
                  <Card key={event.id} className="hover-scale border-none shadow-soft overflow-hidden">
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
                      <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.subtitle}</p>
                      
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <MapPin className="h-4 w-4 text-red" />
                        <span>{event.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-violet" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="px-5 pb-5 pt-0 flex justify-between items-center">
                      <div className="text-lg font-bold">₹{event.price}</div>
                      <RazorpayButton 
                        eventId={event.id} 
                        eventName={event.title}
                        amount={event.price}
                      />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventDetail;

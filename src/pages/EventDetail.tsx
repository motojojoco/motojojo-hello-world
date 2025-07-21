import React from 'react';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import RazorpayButton from "@/components/ui/RazorpayButton";
import { Button } from "@/components/ui/button";
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
  Star,
  AlertCircle,
  ShoppingCart
} from "lucide-react";
import { getEvent, getEventsByCategory, Event } from "@/services/eventService";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isEventOver, getEventStatus, formatEventStatus } from "@/lib/utils";
import MovingPartyBackground from "@/components/ui/MovingPartyBackground";
import { useCartStore } from "@/store/cart-store";
import { getEventTypes } from "@/services/eventTypeService";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCartStore();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [isLocalGathering, setIsLocalGathering] = useState(false);
  
  // Fetch event details
  const { 
    data: event, 
    isLoading: eventLoading, 
    error: eventError 
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id || ''),
    enabled: !!id
  });
  
  // Fetch similar events
  const { 
    data: similarEvents = [], 
    isLoading: similarEventsLoading 
  } = useQuery({
    queryKey: ['similarEvents', event?.category],
    queryFn: () => getEventsByCategory(event?.category || ''),
    enabled: !!event?.category,
    select: (data) => data.filter(e => e.id !== event?.id).slice(0, 3)
  });

  // Fetch event types to check if this is a Local Gathering event
  const { data: eventTypes = [] } = useQuery({
    queryKey: ["event-types"],
    queryFn: getEventTypes,
  });

  // Check if this is a Local Gathering event
  useEffect(() => {
    if (event && eventTypes.length > 0) {
      const localGatheringType = eventTypes.find(
        (et) => et.name.toLowerCase() === "local gathering"
      );
      if (localGatheringType && event.event_type === localGatheringType.id) {
        setIsLocalGathering(true);
      }
    }
  }, [event, eventTypes]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-IN');
  };
  
  // Get event status
  const eventStatus = event ? getEventStatus(event.date, event.time) : 'upcoming';
  const statusInfo = formatEventStatus(eventStatus);
  const isCompleted = eventStatus === 'completed';
  
  // Handle successful booking
  const handleBookingSuccess = () => {
    console.log("Booking successful for event:", id);
  };

  // Remove the Add to Cart button and its handler from the event detail page.

  if (eventLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading event details...</div>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
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

  // Mock data for FAQ and reviews until they are added to the database
  const faq = [
    { question: "What should I bring?", answer: "Just yourself and a valid ID. If you have a printed ticket, please bring it along." },
    { question: "Is there parking available?", answer: "Yes, there is ample parking available at the venue." },
    { question: "Can I get a refund if I can't attend?", answer: "Refunds are available up to 48 hours before the event. Please contact our support team." }
  ];
  
  const reviews = [
    { id: 1, name: "Raj Kumar", rating: 5, comment: "Amazing experience! Will definitely come back again.", date: "2 weeks ago" },
    { id: 2, name: "Priya Sharma", rating: 4, comment: "Very good event, just a bit crowded.", date: "1 month ago" }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isLocalGathering ? '' : ''}`} style={isLocalGathering ? { backgroundColor: '#0CA678' } : {}}>
      <Navbar 
        selectedCity={selectedCity} 
        setSelectedCity={setSelectedCity} 
        bgColor={isLocalGathering ? "#0CA678" : undefined}
        logoSrc={isLocalGathering ? "/gatherings/local%20gat%20logo.png" : undefined}
      />
      {!isLocalGathering && <MovingPartyBackground />}
      
      <main className="flex-grow pt-16 pb-20 md:pb-0">
        {/* Event Banner */}
        <div className="w-full h-[50vh] md:h-[60vh] relative overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-contain object-center bg-black"
          />
        </div>
        
        <div className="container-padding mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details */}
            <div className="lg:col-span-2">
              <FadeIn>
                <Badge className={`mb-4 ${isLocalGathering ? 'bg-[#F7E1B5] text-[#0CA678] hover:bg-[#e6d7a8]' : 'bg-violet hover:bg-violet-700'}`}>{event.category}</Badge>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
                    {statusInfo.text}
                  </Badge>
                  {isCompleted && (
                    <Badge variant="outline" className="text-gray-600 border-gray-300">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Booki
                      ng Closed
                    </Badge>
                  )}
                </div>
                <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isLocalGathering ? 'text-mapcream' : ''}`}>{event.title}</h1>
                <h2 className={`text-xl mb-6 ${isLocalGathering ? 'text-mapcream' : 'text-muted-foreground'}`}>{event.subtitle}</h2>
                
                <div className={`whitespace-pre-line max-w-none mb-8 ${isLocalGathering ? 'text-mapcream' : 'text-foreground'}`}>
                  {event.description}
                  {event.long_description && <p>{event.long_description}</p>}
                </div>
              </FadeIn>

              {/* Reviews Section 
              <FadeIn delay={200}>
                <h3 className="text-2xl font-bold mb-4">Community Reviews</h3>
                <div className="space-y-4 mb-12">
                  {reviews.map((review) => (
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
              </FadeIn> */}
              
              {/* FAQ Section 
              <FadeIn delay={300}>
                <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="mb-12">
                  {faq.map((item, index) => (
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
              </FadeIn> */}
            </div>
            
            {/* Booking Card */}
            <div className="lg:col-span-1">
              <FadeIn delay={400}>
                <div className="sticky top-24">
                  <Card className={`border-none shadow-soft overflow-hidden ${isLocalGathering ? 'bg-[#F7E1B5]' : ''}`}>
                    <CardContent className="p-6">
                      <h3 className={`text-xl font-bold mb-4 ${isLocalGathering ? 'text-[#0CA678]' : 'text-black'}`}>Event Details</h3>
                      
                                              <div className="space-y-4 mb-6">
                          <div className="flex items-start">
                            <MapPin className={`h-5 w-5 mr-3 mt-0.5 ${isLocalGathering ? 'text-[#0CA678]' : 'text-raspberry'}`} />
                            <div>
                              <div className={`font-semibold ${isLocalGathering ? 'text-[#0CA678]' : 'text-black'}`}>Venue</div>
                              <div className={isLocalGathering ? 'text-[#0CA678]' : 'text-black'}>{event.venue}, {event.city}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Calendar className={`h-5 w-5 mr-3 mt-0.5 ${isLocalGathering ? 'text-[#0CA678]' : 'text-violet'}`} />
                            <div>
                              <div className={`font-semibold ${isLocalGathering ? 'text-[#0CA678]' : 'text-black'}`}>Date</div>
                              <div className={isLocalGathering ? 'text-[#0CA678]' : 'text-black'}>{formatDate(event.date)}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Clock className={`h-5 w-5 mr-3 mt-0.5 ${isLocalGathering ? 'text-[#0CA678]' : 'text-yellow'}`} />
                            <div>
                              <div className={`font-semibold ${isLocalGathering ? 'text-[#0CA678]' : 'text-black'}`}>Time & Duration</div>
                              <div className={isLocalGathering ? 'text-[#0CA678]' : 'text-black'}>{event.time} • {event.duration || 'TBD'}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <User className={`h-5 w-5 mr-3 mt-0.5 ${isLocalGathering ? 'text-[#0CA678]' : 'text-green-500'}`} />
                            <div>
                              <div className={`font-semibold ${isLocalGathering ? 'text-[#0CA678]' : 'text-black'}`}>Host</div>
                              <div className={isLocalGathering ? 'text-[#0CA678]' : 'text-black'}>{event.host || 'Motojojo'}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Tag className={`h-5 w-5 mr-3 mt-0.5 ${isLocalGathering ? 'text-[#0CA678]' : 'text-blue-500'}`} />
                            <div>
                              <div className={`font-semibold ${isLocalGathering ? 'text-[#0CA678]' : 'text-black'}`}>Category</div>
                              <div className={isLocalGathering ? 'text-[#0CA678]' : 'text-black'}>{event.category}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <DollarSign className={`h-5 w-5 mr-3 mt-0.5 ${isLocalGathering ? 'text-[#0CA678]' : 'text-purple-500'}`} />
                            <div>
                              <div className={`font-semibold ${isLocalGathering ? 'text-[#0CA678]' : 'text-black'}`}>Price</div>
                              {event.has_discount && event.real_price && event.discounted_price ? (
                                <div className="flex flex-col items-start">
                                  <span className={`text-base opacity-60 line-through decoration-2 decoration-red-500 ${isLocalGathering ? 'text-[#0CA678]' : 'text-black'}`}>₹{formatPrice(event.real_price)}</span>
                                  <span className="text-xl font-bold text-red-600">₹{formatPrice(event.discounted_price)}</span>
                                </div>
                              ) : (
                                <div className={`text-xl font-bold ${isLocalGathering ? 'text-[#0CA678]' : 'text-black'}`}>₹{formatPrice(event.price)}</div>
                              )}
                            </div>
                          </div>
                        </div>
                    </CardContent>
                    <CardFooter className="px-6 pb-6 pt-0">
                      {isCompleted ? (
                        <div className="w-full text-center">
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-1">Event Has Ended</h3>
                            <p className="text-sm text-gray-600">
                              This event took place on {formatDate(event.date)}. 
                              Thank you to everyone who attended!
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => navigate("/events")}
                          >
                            Browse Other Events
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full space-y-3">
                          <Button 
                            className={isLocalGathering ? 'bg-[#0CA678] hover:bg-[#0a8a6a] text-white' : ''}
                            onClick={() => navigate(`/book/${event.id}`)}
                            size="lg"
                          >
                            Book Now
                          </Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              </FadeIn>
            </div>
          </div>
          
          {/* Similar Events */}
          {!similarEventsLoading && similarEvents.length > 0 && (
            <FadeIn delay={500}>
              <h3 className={`text-2xl font-bold mt-12 mb-6 ${isLocalGathering ? 'text-mapcream' : ''}`}>Similar Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {similarEvents.map((event: Event) => (
                  <Card key={event.id} className={`hover-scale border-none shadow-soft overflow-hidden ${isLocalGathering ? 'bg-[#0CA678]' : ''}`}>
                    <div className="h-48 relative">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className={isLocalGathering ? 'bg-[#F7E1B5] text-[#0CA678] hover:bg-[#e6d7a8]' : 'bg-violet hover:bg-violet-700'}>{event.category}</Badge>
                      </div>
                    </div>
                    <CardContent className={`p-5 ${isLocalGathering ? 'text-mapcream' : 'text-black'}`}>
                      <h3 className={`text-lg font-bold mb-1 ${isLocalGathering ? 'text-mapcream' : ''}`}>{event.title}</h3>
                      <p className={`text-sm mb-4 line-clamp-2 ${isLocalGathering ? 'text-mapcream' : ''}`}>{event.subtitle}</p>
                      
                      <div className={`flex items-center gap-2 text-sm mb-2 ${isLocalGathering ? 'text-mapcream' : ''}`}>
                        <MapPin className={`h-4 w-4 ${isLocalGathering ? 'text-mapcream' : ''}`} />
                        <span className={isLocalGathering ? 'text-mapcream' : ''}>{event.city}</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${isLocalGathering ? 'text-mapcream' : ''}`}>
                        <Calendar className={`h-4 w-4 ${isLocalGathering ? 'text-mapcream' : ''}`} />
                        <span className={isLocalGathering ? 'text-mapcream' : ''}>{formatDate(event.date)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className={`px-5 pb-5 pt-0 flex justify-between items-center ${isLocalGathering ? 'text-mapcream' : 'text-black'}`}>
                      <div className={`text-lg font-bold ${isLocalGathering ? 'text-mapcream' : ''}`}>₹{formatPrice(event.price)}</div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/event/${event.id}`)}
                          className={isLocalGathering ? 'bg-[#F7E1B5] text-[#0CA678] border-[#0CA678] hover:bg-[#e6d7a8]' : ''}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </main>
      
      {isLocalGathering ? (
        <div style={{ backgroundColor: '#0CA678' }}>
          <Footer />
        </div>
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default EventDetail;

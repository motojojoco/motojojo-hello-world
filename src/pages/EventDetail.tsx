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
  AlertCircle
} from "lucide-react";
import { getEvent, getEventsByCategory, Event } from "@/services/eventService";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isEventOver, getEventStatus, formatEventStatus } from "@/lib/utils";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  if (eventLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading event details...</div>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
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
                <Badge className="mb-4 bg-violet hover:bg-violet-700">{event.category}</Badge>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
                    {statusInfo.text}
                  </Badge>
                  {isCompleted && (
                    <Badge variant="outline" className="text-gray-600 border-gray-300">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Booking Closed
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                <h2 className="text-xl text-muted-foreground mb-6">{event.subtitle}</h2>
                
                <div className="whitespace-pre-line text-foreground max-w-none mb-8">
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
                            <div className="text-muted-foreground">{event.time} • {event.duration || 'TBD'}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <User className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium">Host</div>
                            <div className="text-muted-foreground">{event.host || 'Motojojo'}</div>
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
                          <DollarSign className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium">Price</div>
                            {event.has_discount && event.real_price && event.discounted_price ? (
                              <div className="flex flex-col items-start">
                                <span className="text-base text-muted-foreground opacity-60 line-through decoration-2 decoration-red-500">₹{formatPrice(event.real_price)}</span>
                                <span className="text-xl font-bold text-red-600">₹{formatPrice(event.discounted_price)}</span>
                              </div>
                            ) : (
                              <div className="text-xl font-bold">₹{formatPrice(event.price)}</div>
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
                        <RazorpayButton 
                          eventId={event.id} 
                          eventName={event.title}
                          amount={event.has_discount && event.discounted_price ? event.discounted_price : event.price}
                          onSuccess={handleBookingSuccess}
                        />
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
              <h3 className="text-2xl font-bold mt-12 mb-6">Similar Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {similarEvents.map((event: Event) => (
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
                      <div className="text-lg font-bold">₹{formatPrice(event.price)}</div>
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/event/${event.id}`)}
                      >
                        View Details
                      </Button>
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


import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShoppingCart, Ticket } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { addToCart, Event, getEvent } from "@/services/eventService";

interface SeatInfo {
  seat_number: number;
  booking?: {
    name: string;
  } | null;
}

interface SeatAvailabilityProps {
  eventId: string;
}

const SeatAvailability = ({ eventId }: SeatAvailabilityProps) => {
  const [seats, setSeats] = useState<SeatInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [eventDetails, setEventDetails] = useState<Event | null>(null);
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const addItemToCart = useCartStore(state => state.addItem);

  useEffect(() => {
    // Fetch event details
    const fetchEventDetails = async () => {
      try {
        const data = await getEvent(eventId);
        if (data) {
          setEventDetails(data);
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    const fetchSeats = async () => {
      const { data, error } = await supabase
        .from('event_seats')
        .select(`
          seat_number,
          booking:bookings (
            name
          )
        `)
        .eq('event_id', eventId)
        .order('seat_number');

      if (error) {
        console.error('Error fetching seats:', error);
        return;
      }

      setSeats(data || []);
      setLoading(false);
    };

    fetchSeats();

    // Set up real-time subscription
    const channel = supabase
      .channel('event-seats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_seats',
          filter: `event_id=eq.${eventId}`
        },
        (payload) => {
          console.log('Seats updated:', payload);
          fetchSeats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const handleSeatClick = (seat: SeatInfo) => {
    if (seat.booking) {
      return; // Can't select already booked seats
    }

    setSelectedSeats(prev => {
      if (prev.includes(seat.seat_number)) {
        return prev.filter(s => s !== seat.seat_number);
      } else {
        if (prev.length < 10) { // Limit to 10 seats per transaction
          return [...prev, seat.seat_number];
        }
        return prev;
      }
    });
  };

  const handleAddToCart = () => {
    if (!isSignedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book tickets",
      });
      return;
    }

    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to continue",
        variant: "destructive"
      });
      return;
    }

    if (!eventDetails) {
      toast({
        title: "Error",
        description: "Unable to add tickets to cart. Event details not available.",
        variant: "destructive"
      });
      return;
    }

    // Add to cart
    const cartItem = addToCart(eventDetails, selectedSeats.length);
    addItemToCart(cartItem);

    toast({
      title: "Added to cart",
      description: `${selectedSeats.length} ticket(s) added to your cart.`,
    });

    // Reset selection
    setSelectedSeats([]);
  };

  const handleBookNow = () => {
    if (!isSignedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book tickets",
      });
      return;
    }

    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to continue",
        variant: "destructive"
      });
      return;
    }

    // Add to cart and redirect to cart page
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return <div className="animate-pulse">Loading seat information...</div>;
  }

  const chunkArray = (arr: SeatInfo[], size: number) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const seatRows = chunkArray(seats, 10);

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Seat Availability</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 10 }, (_, i) => (
                <TableHead key={i} className="text-center w-20">
                  Seat {i + 1}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {seatRows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((seat) => (
                  <TableCell key={seat.seat_number} className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge 
                            variant={
                              selectedSeats.includes(seat.seat_number) 
                                ? "default" 
                                : (seat.booking ? "secondary" : "outline")
                            }
                            className={`cursor-${seat.booking ? 'help' : 'pointer'}`}
                            onClick={() => handleSeatClick(seat)}
                          >
                            {seat.seat_number}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          {seat.booking 
                            ? `Booked by ${seat.booking.name}`
                            : selectedSeats.includes(seat.seat_number)
                              ? 'Selected'
                              : 'Available - Click to select'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex gap-4 mt-4 justify-between items-center">
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="outline">123</Badge>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">123</Badge>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default">123</Badge>
            <span>Selected</span>
          </div>
        </div>
        
        {selectedSeats.length > 0 && (
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart ({selectedSeats.length})
            </Button>
            
            <Button 
              className="flex items-center gap-2"
              onClick={handleBookNow}
            >
              <Ticket className="h-4 w-4" />
              Book Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatAvailability;

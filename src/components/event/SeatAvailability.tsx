
import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
                            variant={seat.booking ? "secondary" : "outline"}
                            className="cursor-help"
                          >
                            {seat.seat_number}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          {seat.booking 
                            ? `Booked by ${seat.booking.name}`
                            : 'Available'}
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
      <div className="flex gap-4 mt-4 justify-end text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="outline">123</Badge>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">123</Badge>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatAvailability;

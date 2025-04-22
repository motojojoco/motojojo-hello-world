
import { supabase } from "@/integrations/supabase/client";

export interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  tickets: number;
  amount: number;
  status: string;
  payment_id?: string;
  order_id?: string;
  booking_date: string;
  event?: any;
  ticket_items?: Ticket[]; // Renamed from tickets to ticket_items to avoid conflict
}

export interface Ticket {
  id: string;
  booking_id: string;
  ticket_number: string;
  qr_code?: string;
  created_at: string;
}

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      event:event_id (*),
      ticket_items:tickets (*)
    `)
    .eq('user_id', userId)
    .order('booking_date', { ascending: false });
    
  if (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
  
  return data || [];
};

export const getBookingTickets = async (bookingId: string): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error(`Error fetching tickets for booking ${bookingId}:`, error);
    return [];
  }
  
  return data || [];
};

export const subscribeToBookingUpdates = (
  bookingId: string, 
  onUpdate: (tickets: Ticket[]) => void
) => {
  const channel = supabase
    .channel(`booking-${bookingId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tickets',
        filter: `booking_id=eq.${bookingId}`
      },
      async (payload) => {
        console.log('Ticket update received:', payload);
        // Fetch latest tickets after any change
        const tickets = await getBookingTickets(bookingId);
        onUpdate(tickets);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const createBookingFromCart = async (
  userId: string, 
  eventId: string, 
  name: string, 
  email: string, 
  phone: string, 
  tickets: number, 
  amount: number
): Promise<Booking | null> => {
  try {
    // Create the booking first
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        event_id: eventId,
        name,
        email,
        phone,
        tickets,
        amount,
        status: 'confirmed',
        booking_date: new Date().toISOString()
      })
      .select()
      .single();
      
    if (bookingError) {
      console.error("Error creating booking:", bookingError);
      return null;
    }

    // Generate tickets for the booking
    for (let i = 0; i < tickets; i++) {
      const ticketNumber = `MJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketNumber}`;
      
      const { error: ticketError } = await supabase
        .from('tickets')
        .insert({
          booking_id: booking.id,
          ticket_number: ticketNumber,
          qr_code: qrCode,
          username: name
        });

      if (ticketError) {
        console.error("Error creating ticket:", ticketError);
      }
    }
    
    return booking;
  } catch (err) {
    console.error("Error in createBookingFromCart:", err);
    return null;
  }
};


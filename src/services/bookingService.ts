
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
  tickets?: Ticket[]; // Added to support tickets in the booking response
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
      tickets (*)
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
    const { data, error } = await supabase
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
      
    if (error) {
      console.error("Error creating booking:", error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error("Error in createBookingFromCart:", err);
    return null;
  }
};

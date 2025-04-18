
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
      event:event_id (*)
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

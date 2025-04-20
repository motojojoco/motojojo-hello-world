
import { supabase } from "@/integrations/supabase/client";

export interface Event {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  date: string;
  time: string;
  category: number;
  venue: string;
  city: string;
  address: string;
  price: number;
  image: string;
  gallery?: string[];
  featured: boolean;
  created_by: string;
  seats_available: number;
  is_published: boolean;
  created_at: string;
  [key: string]: any;
}

export const getFeaturedEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('featured', true)
    .eq('is_published', true)
    .order('date', { ascending: true });
    
  if (error) console.error("Error fetching featured events:", error);
  return data || [];
};

export const getEventsByCategory = async (categoryId: number): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('category', categoryId)
    .eq('is_published', true)
    .order('date', { ascending: true });
    
  if (error) console.error(`Error fetching events for category ${categoryId}:`, error);
  return data || [];
};

export const getEvent = async (id: string): Promise<Event | null> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching event ${id}:`, error);
    return null;
  }
  
  return data;
};

export const addToCart = (event: Event, quantity: number = 1) => {
  // This function will be imported in other components
  // Implementation will be handled by the cart store
  return {
    id: crypto.randomUUID(),
    eventId: event.id,
    eventTitle: event.title,
    eventImage: event.image,
    quantity,
    price: event.price,
    date: event.date,
    venue: event.venue,
    city: event.city
  };
};

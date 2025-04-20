
import { supabase } from "@/integrations/supabase/client";

export interface Event {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  date: string;
  time: string;
  category: string;
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
  event_type: string;
  host?: string;
  duration?: string;
  long_description?: string;
}

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('date', { ascending: true });
    
  if (error) console.error("Error fetching events:", error);
  
  // Make sure all required fields are present
  const events = data || [];
  return events.map(event => ({
    id: event.id,
    title: event.title,
    subtitle: event.subtitle,
    description: event.description,
    date: event.date,
    time: event.time,
    category: event.category,
    venue: event.venue,
    city: event.city,
    address: event.address || '',
    price: event.price,
    image: event.image,
    gallery: event.gallery,
    featured: event.featured || false,
    created_by: event.created_by || '',
    seats_available: event.seats_available,
    is_published: event.is_published || true,
    created_at: event.created_at,
    event_type: event.event_type,
    host: event.host,
    duration: event.duration,
    long_description: event.long_description
  })) as Event[];
};

export const getFeaturedEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('featured', true)
    .eq('is_published', true)
    .order('date', { ascending: true });
    
  if (error) console.error("Error fetching featured events:", error);
  
  const events = data || [];
  return events.map(event => ({
    id: event.id,
    title: event.title,
    subtitle: event.subtitle,
    description: event.description,
    date: event.date,
    time: event.time,
    category: event.category,
    venue: event.venue,
    city: event.city,
    address: event.address || '',
    price: event.price,
    image: event.image,
    gallery: event.gallery,
    featured: event.featured || false,
    created_by: event.created_by || '',
    seats_available: event.seats_available,
    is_published: event.is_published || true,
    created_at: event.created_at,
    event_type: event.event_type,
    host: event.host,
    duration: event.duration,
    long_description: event.long_description
  })) as Event[];
};

export const getEventsByCategory = async (categoryId: string): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('category', categoryId)
    .eq('is_published', true)
    .order('date', { ascending: true });
    
  if (error) console.error(`Error fetching events for category ${categoryId}:`, error);
  
  const events = data || [];
  return events.map(event => ({
    id: event.id,
    title: event.title,
    subtitle: event.subtitle,
    description: event.description,
    date: event.date,
    time: event.time,
    category: event.category,
    venue: event.venue,
    city: event.city,
    address: event.address || '',
    price: event.price,
    image: event.image,
    gallery: event.gallery,
    featured: event.featured || false,
    created_by: event.created_by || '',
    seats_available: event.seats_available,
    is_published: event.is_published || true,
    created_at: event.created_at,
    event_type: event.event_type,
    host: event.host,
    duration: event.duration,
    long_description: event.long_description
  })) as Event[];
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
  
  if (!data) return null;
  
  return {
    id: data.id,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    date: data.date,
    time: data.time,
    category: data.category,
    venue: data.venue,
    city: data.city,
    address: data.address || '',
    price: data.price,
    image: data.image,
    gallery: data.gallery,
    featured: data.featured || false,
    created_by: data.created_by || '',
    seats_available: data.seats_available,
    is_published: data.is_published || true,
    created_at: data.created_at,
    event_type: data.event_type,
    host: data.host,
    duration: data.duration,
    long_description: data.long_description
  } as Event;
};

// Alias for getEvent to maintain backwards compatibility
export const getEventById = getEvent;

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


import { supabase } from "@/integrations/supabase/client";

export interface Event {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  long_description?: string;
  image: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  duration?: string;
  host?: string;
  category: string;
  event_type: string;
  price: number;
  seats_available: number;
  created_at: string;
  updated_at: string;
}

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
    
  if (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
  
  return data || [];
};

export const getEventById = async (id: string | number): Promise<Event | null> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    return null;
  }
  
  return data;
};

export const getEventsByCategory = async (category: string): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('category', category)
    .order('date', { ascending: true });
    
  if (error) {
    console.error(`Error fetching events in category ${category}:`, error);
    return [];
  }
  
  return data || [];
};

export const getEventsByCity = async (city: string): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('city', city)
    .order('date', { ascending: true });
    
  if (error) {
    console.error(`Error fetching events in city ${city}:`, error);
    return [];
  }
  
  return data || [];
};

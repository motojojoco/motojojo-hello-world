
import { supabase } from "@/integrations/supabase/client";
import { Event } from "./eventService";

// Interface to create an event (matches database fields)
export interface CreateEventInput {
  title: string;
  subtitle?: string;
  description: string;
  long_description?: string;
  date: string;
  time: string;
  category: string;
  venue: string;
  city: string;
  address?: string;
  price: number;
  image: string;
  gallery?: string[];
  featured?: boolean;
  created_by?: string;
  seats_available: number;
  is_published?: boolean;
  host?: string;
  duration?: string;
  event_type: string;
}

export const createEvent = async (eventData: CreateEventInput) => {
  try {
    // First create the event
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select('*')
      .single();

    if (error) {
      console.error("Error creating event:", error);
      throw new Error(error.message);
    }

    // Wait a moment to allow the database trigger to create seats
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify seats were created
    const { data: seats, error: seatsError } = await supabase
      .from('event_seats')
      .select('*')
      .eq('event_id', data.id)
      .limit(1);

    if (seatsError) {
      console.error("Error verifying seats:", seatsError);
      // Don't throw here - the event was created successfully
    }

    // Log verification result
    if (!seats || seats.length === 0) {
      console.warn("Seats may not have been created for event:", data.id);
    } else {
      console.log("Seats created successfully for event:", data.id);
    }

    return data;
  } catch (error) {
    console.error("Error in createEvent:", error);
    throw error;
  }
};

export const updateEvent = async (id: string, eventData: Partial<CreateEventInput>) => {
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error("Error updating event:", error);
    throw error;
  }

  return data;
};

export const deleteEvent = async (id: string) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const subscribeToEvents = (callback: (event: Event) => void) => {
  const channel = supabase
    .channel('events-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'events'
      },
      (payload) => {
        // Transform the payload to match the Event interface
        const newEvent = payload.new as any;
        const transformedEvent: Event = {
          id: newEvent.id,
          title: newEvent.title,
          subtitle: newEvent.subtitle || undefined,
          description: newEvent.description,
          date: newEvent.date,
          time: newEvent.time,
          category: newEvent.category,
          venue: newEvent.venue,
          city: newEvent.city,
          address: '', // Default value
          price: newEvent.price,
          image: newEvent.image,
          gallery: [], // Default value
          featured: false, // Default value
          created_by: '', // Default value
          seats_available: newEvent.seats_available,
          is_published: true, // Default value
          created_at: newEvent.created_at,
          event_type: newEvent.event_type,
          host: newEvent.host || undefined,
          duration: newEvent.duration || undefined,
          long_description: newEvent.long_description || null,
          updated_at: newEvent.updated_at
        };
        callback(transformedEvent);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

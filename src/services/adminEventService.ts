
import { supabase } from "@/integrations/supabase/client";
import { Event } from "./eventService";

export const createEvent = async (eventData: Omit<Event, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select('*')
    .single();

  if (error) {
    console.error("Error creating event:", error);
    throw error;
  }

  return data;
};

export const updateEvent = async (id: string, eventData: Partial<Event>) => {
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
        callback(payload.new as Event);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

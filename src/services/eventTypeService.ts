import { supabase } from "@/integrations/supabase/client";

export interface EventType {
  id: string;
  name: string;
  icon: string | null;
  image_url: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  deletable: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEventTypeInput {
  name: string;
  icon?: string;
  image_url?: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
  deletable?: boolean;
}

export interface UpdateEventTypeInput {
  name?: string;
  icon?: string;
  image_url?: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
  deletable?: boolean;
}

export const getEventTypes = async (): Promise<EventType[]> => {
  const { data, error } = await supabase
    .from('event_types')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });
    
  if (error) {
    console.error("Error fetching event types:", error);
    return [];
  }
  
  return data || [];
};

export const getAllEventTypes = async (): Promise<EventType[]> => {
  const { data, error } = await supabase
    .from('event_types')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });
    
  if (error) {
    console.error("Error fetching all event types:", error);
    return [];
  }
  
  return data || [];
};

export const createEventType = async (eventTypeData: CreateEventTypeInput): Promise<EventType> => {
  const { data, error } = await supabase
    .from('event_types')
    .insert(eventTypeData)
    .select('*')
    .single();

  if (error) {
    console.error("Error creating event type:", error);
    throw new Error(error.message);
  }

  return data;
};

export const updateEventType = async (id: string, eventTypeData: UpdateEventTypeInput): Promise<EventType> => {
  const { data, error } = await supabase
    .from('event_types')
    .update(eventTypeData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error("Error updating event type:", error);
    throw new Error(error.message);
  }

  return data;
};

export const deleteEventType = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('event_types')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting event type:", error);
    throw new Error(error.message);
  }
};

export const getEventType = async (id: string): Promise<EventType | null> => {
  const { data, error } = await supabase
    .from('event_types')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching event type:", error);
    return null;
  }

  return data;
};


import { supabase } from "@/integrations/supabase/client";

export interface EventType {
  id: string;
  name: string;
  icon: string | null;
  deletable: boolean;
  created_at: string;
}

export const getEventTypes = async (): Promise<EventType[]> => {
  const { data, error } = await supabase
    .from('event_types')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) {
    console.error("Error fetching event types:", error);
    return [];
  }
  
  return data || [];
};

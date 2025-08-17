import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/services/eventService";

/**
 * Checks if the current user can view a private event
 * @param event The event to check access for
 * @returns Promise<boolean> True if the user can view the event, false otherwise
 */
export const canViewPrivateEvent = async (event: Event): Promise<boolean> => {
  // Public events are always viewable
  if (!event.is_private) {
    return true;
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  // If no user is logged in, they can't view private events
  if (!user) {
    return false;
  }

  // The event creator can always view their own private events
  if (event.created_by === user.id) {
    return true;
  }

  // TODO: Add additional checks here for other authorized users (e.g., event hosts, admins, etc.)
  
  return false;
};

/**
 * Filters out private events that the current user doesn't have access to
 * @param events Array of events to filter
 * @returns Promise<Event[]> Filtered array of events
 */
export const filterPrivateEvents = async (events: Event[]): Promise<Event[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  return events.filter(event => {
    // Show public events and private events where the user is the creator
    return !event.is_private || (user?.id && event.created_by === user.id);
  });
};

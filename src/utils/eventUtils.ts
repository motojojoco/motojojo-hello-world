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

  // Check if user is invited to the private event
  const { data: invitation } = await supabase
    .from('event_invitations')
    .select('*')
    .eq('event_id', event.id)
    .eq('user_email', user.email)
    .eq('status', 'accepted')
    .maybeSingle();

  if (invitation) {
    return true;
  }

  // Check if user is an admin
  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (userProfile?.role === 'admin') {
    return true;
  }
  
  return false;
};

/**
 * Filters out private events that the current user doesn't have access to
 * @param events Array of events to filter
 * @returns Promise<Event[]> Filtered array of events
 */
export const filterPrivateEvents = async (events: Event[]): Promise<Event[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return events.filter(event => !event.is_private);
  }

  // Get user's accepted invitations
  const { data: invitations } = await supabase
    .from('event_invitations')
    .select('event_id')
    .eq('user_email', user.email)
    .eq('status', 'accepted');

  const invitedEventIds = new Set(invitations?.map(inv => inv.event_id) || []);

  // Get user role
  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin = userProfile?.role === 'admin';

  return events.filter(event => {
    // Show public events
    if (!event.is_private) {
      return true;
    }

    // Show private events if user is admin
    if (isAdmin) {
      return true;
    }

    // Show private events if user is the creator
    if (event.created_by === user.id) {
      return true;
    }

    // Show private events if user is invited and accepted
    if (invitedEventIds.has(event.id)) {
      return true;
    }

    return false;
  });
};

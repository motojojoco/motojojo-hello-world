import { supabase } from "@/integrations/supabase/client";

export interface EventInvitation {
  id: string;
  event_id: string;
  user_email: string;
  invited_by: string;
  status: 'pending' | 'accepted' | 'declined';
  invited_at: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
}

export const createEventInvitation = async (
  eventId: string,
  userEmail: string,
  invitedBy: string
): Promise<{ data: EventInvitation | null; error: any }> => {
  const { data, error } = await supabase
    .from('event_invitations')
    .insert({
      event_id: eventId,
      user_email: userEmail,
      invited_by: invitedBy,
      status: 'pending'
    })
    .select()
    .single();

  return { data, error };
};

export const getEventInvitations = async (eventId: string): Promise<EventInvitation[]> => {
  const { data, error } = await supabase
    .from('event_invitations')
    .select('*')
    .eq('event_id', eventId)
    .order('invited_at', { ascending: false });

  if (error) {
    console.error('Error fetching event invitations:', error);
    return [];
  }

  return data || [];
};

export const getUserInvitations = async (userEmail: string): Promise<EventInvitation[]> => {
  const { data, error } = await supabase
    .from('event_invitations')
    .select('*')
    .eq('user_email', userEmail)
    .order('invited_at', { ascending: false });

  if (error) {
    console.error('Error fetching user invitations:', error);
    return [];
  }

  return data || [];
};

export const updateInvitationStatus = async (
  invitationId: string,
  status: 'accepted' | 'declined'
): Promise<{ data: EventInvitation | null; error: any }> => {
  const { data, error } = await supabase
    .from('event_invitations')
    .update({
      status,
      responded_at: new Date().toISOString()
    })
    .eq('id', invitationId)
    .select()
    .single();

  return { data, error };
};

export const deleteEventInvitation = async (invitationId: string): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('event_invitations')
    .delete()
    .eq('id', invitationId);

  return { error };
};

export const bulkInviteUsers = async (
  eventId: string,
  emails: string[],
  invitedBy: string
): Promise<{ success: string[]; failed: string[] }> => {
  const success: string[] = [];
  const failed: string[] = [];

  for (const email of emails) {
    const { error } = await createEventInvitation(eventId, email, invitedBy);
    if (error) {
      failed.push(email);
    } else {
      success.push(email);
    }
  }

  return { success, failed };
};
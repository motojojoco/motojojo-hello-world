import { supabase } from "@/integrations/supabase/client";

export interface EventInvitation {
  id: string;
  event_id: string;
  user_email: string;
  invited_by: string;
  status: "pending" | "accepted" | "declined";
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
    .from("event_invitations")
    .insert({
      event_id: eventId,
      user_email: userEmail,
      invited_by: invitedBy,
      status: "pending",
    })
    .select()
    .single();
  const normalized = data ? normalizeInvitation(data) : null;
  return { data: normalized, error };
};

export const getEventInvitations = async (
  eventId: string
): Promise<EventInvitation[]> => {
  const { data, error } = await supabase
    .from("event_invitations")
    .select("*")
    .eq("event_id", eventId)
    .order("invited_at", { ascending: false });

  if (error) {
    console.error("Error fetching event invitations:", error);
    return [];
  }
  return (data || []).map(normalizeInvitation);
};

export const getUserInvitations = async (
  userEmail: string
): Promise<EventInvitation[]> => {
  const { data, error } = await supabase
    .from("event_invitations")
    .select("*")
    .eq("user_email", userEmail)
    .order("invited_at", { ascending: false });

  if (error) {
    console.error("Error fetching user invitations:", error);
    return [];
  }
  return (data || []).map(normalizeInvitation);
};

export const updateInvitationStatus = async (
  invitationId: string,
  status: "accepted" | "declined"
): Promise<{ data: EventInvitation | null; error: any }> => {
  const { data, error } = await supabase
    .from("event_invitations")
    .update({
      status,
      responded_at: new Date().toISOString(),
    })
    .eq("id", invitationId)
    .select()
    .single();
  const normalized = data ? normalizeInvitation(data) : null;
  return { data: normalized, error };
};

export const deleteEventInvitation = async (
  invitationId: string
): Promise<{ error: any }> => {
  const { error } = await supabase
    .from("event_invitations")
    .delete()
    .eq("id", invitationId);

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

// Create or re-open a join request for the currently signed-in user
export const createJoinRequest = async (
  eventId: string
): Promise<{ data: EventInvitation | null; error: any }> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user || !user.email) {
    return { data: null, error: userError || new Error("Not authenticated") };
  }

  // Check if a request already exists
  const { data: existing } = await supabase
    .from("event_invitations")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_email", user.email)
    .maybeSingle();

  if (existing) {
    // If already pending, do nothing; if declined, move back to pending
    if (existing.status === "pending") {
      return { data: normalizeInvitation(existing), error: null };
    }
    const { data, error } = await supabase
      .from("event_invitations")
      .update({ status: "pending", responded_at: null })
      .eq("id", existing.id)
      .select()
      .single();
    return { data: data ? normalizeInvitation(data) : null, error };
  }

  // Create a fresh pending request
  const { data, error } = await supabase
    .from("event_invitations")
    .insert({
      event_id: eventId,
      user_email: user.email,
      invited_by: user.id,
      status: "pending",
    })
    .select()
    .single();
  return { data: data ? normalizeInvitation(data) : null, error };
};

export const getMyInvitationStatusForEvent = async (
  eventId: string
): Promise<"pending" | "accepted" | "declined" | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return null;

  const { data } = await supabase
    .from("event_invitations")
    .select("status")
    .eq("event_id", eventId)
    .eq("user_email", user.email)
    .maybeSingle();

  return (data?.status as any) ?? null;
};

export interface PendingJoinRequest {
  id: string;
  event_id: string;
  event_title: string;
  event_date: string;
  event_city: string;
  user_email: string;
  requested_at: string;
};

// List all pending requests for private, published events (admin view)
export const getPendingJoinRequests = async (): Promise<PendingJoinRequest[]> => {
  const { data, error } = await supabase
    .from("event_invitations")
    .select(
      `
      id,
      event_id,
      user_email,
      created_at,
      event:events(
        id,
        title,
        city,
        date
      )
    `
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending join requests:", error);
    throw error;
  }

  return (data || []).map((invite) => ({
    id: invite.id,
    event_id: invite.event_id,
    event_title: invite.event?.title || "",
    event_city: invite.event?.city || "",
    event_date: invite.event?.date || "",
    user_email: invite.user_email,
    requested_at: invite.created_at
  }));
};

// Helper to normalize DB row into EventInvitation with strict status type
const normalizeInvitation = (row: any): EventInvitation => ({
  id: row.id,
  event_id: row.event_id,
  user_email: row.user_email,
  invited_by: row.invited_by,
  status: row.status as "pending" | "accepted" | "declined",
  invited_at: row.invited_at,
  responded_at: row.responded_at,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  city?: string | null;
  phone?: string | null;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data || [];
}; 
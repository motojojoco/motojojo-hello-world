import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const { user, isSignedIn, isLoaded: isClerkLoaded } = useUser();
  const { signOut } = useClerk();
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const syncUserWithSupabase = async () => {
      try {
        if (!user?.id) return;

        // Gather latest user info from Clerk
        const newUserProfile = {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          full_name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          avatar_url: user.imageUrl,
          created_at: new Date().toISOString(),
        };

        // Try fetching user from Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error checking user:", error);
          if (isMounted) {
            setError(error);
            setIsProfileLoaded(true);
          }
          return;
        }

        if (!data && isMounted && user) {
          // User not in DB: Insert from Clerk info
          const { data: insertedProfile, error: insertError } = await supabase
            .from('users')
            .insert(newUserProfile)
            .select()
            .single();

          if (insertError) {
            console.error("Error creating user profile:", insertError);
            setError(insertError);
          } else {
            setProfile(insertedProfile);
          }
        } else if (isMounted && user) {
          // Found, but possibly outdated
          let needsUpdate = false;
          const currentName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
          
          if (
            data.email !== user.primaryEmailAddress?.emailAddress ||
            data.full_name !== currentName ||
            data.avatar_url !== user.imageUrl
          ) {
            needsUpdate = true;
          }
          
          if (needsUpdate) {
            const { data: updated, error: updateError } = await supabase
              .from('users')
              .update({
                email: user.primaryEmailAddress?.emailAddress,
                full_name: currentName,
                avatar_url: user.imageUrl,
              })
              .eq('id', user.id)
              .select()
              .single();
              
            if (updateError) {
              setError(updateError);
            } else {
              setProfile(updated);
            }
          } else {
            setProfile(data);
          }
        }
      } catch (err) {
        console.error("Error syncing user:", err);
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setIsProfileLoaded(true);
        }
      }
    };

    if (isClerkLoaded) {
      if (isSignedIn && user) {
        syncUserWithSupabase();
      } else {
        setProfile(null);
        setIsProfileLoaded(true);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [isClerkLoaded, isSignedIn, user]);

  // Real-time subscription for profile updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`user-profile-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          console.log('Profile update received:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setProfile(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const logout = async () => {
    await signOut();
  };

  const updateProfile = async (updatedProfile: any) => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      // Ensure preferences is properly formatted as JSONB
      if (updatedProfile.preferences && typeof updatedProfile.preferences === 'string') {
        try {
          updatedProfile.preferences = JSON.parse(updatedProfile.preferences);
        } catch (e) {
          console.error("Invalid preferences format:", e);
          updatedProfile.preferences = [];
        }
      }
      
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updatedProfile,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
      
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Error in updateProfile:", err);
      throw err;
    }
  };

  return {
    user,
    profile,
    isLoaded: isClerkLoaded && isProfileLoaded,
    isSignedIn,
    logout,
    updateProfile,
    error
  };
};

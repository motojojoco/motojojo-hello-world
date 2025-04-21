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
        // Gather latest user info from Clerk
        const newUserProfile = {
          id: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          full_name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
          created_at: new Date().toISOString(),
        };

        // Try fetching user from Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user?.id)
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
          if (
            data.email !== user.primaryEmailAddress?.emailAddress ||
            data.full_name !== `${user.firstName || ""} ${user.lastName || ""}`.trim()
          ) {
            needsUpdate = true;
          }
          if (needsUpdate) {
            const { data: updated, error: updateError } = await supabase
              .from('users')
              .update({
                email: user.primaryEmailAddress?.emailAddress,
                full_name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
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

  const logout = async () => {
    await signOut();
  };

  const updateProfile = async (updatedProfile: any) => {
    try {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('users')
        .update(updatedProfile)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating profile:", error);
        return null;
      }
      
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Error in updateProfile:", err);
      return null;
    }
  };

  return {
    user,
    profile,
    isLoaded: isClerkLoaded && isProfileLoaded,
    isSignedIn,
    logout,
    updateProfile
  };
};

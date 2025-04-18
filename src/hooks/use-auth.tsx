
import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // Sync Clerk user with Supabase
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const syncUserWithSupabase = async () => {
        try {
          // Check if user exists in our database
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error("Error checking user:", error);
            return;
          }

          if (!data) {
            // Create new user profile in our database
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                full_name: `${user.firstName} ${user.lastName}`,
                created_at: new Date().toISOString()
              });

            if (insertError) {
              console.error("Error creating user profile:", insertError);
            }
          } else {
            // User exists, set profile
            setProfile(data);
          }
          
          setIsProfileLoaded(true);
        } catch (err) {
          console.error("Error syncing user:", err);
        }
      };

      syncUserWithSupabase();
    } else if (isLoaded && !isSignedIn) {
      setProfile(null);
      setIsProfileLoaded(true);
    }
  }, [isLoaded, isSignedIn, user]);

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
    isLoaded: isLoaded && isProfileLoaded,
    isSignedIn,
    logout,
    updateProfile
  };
};

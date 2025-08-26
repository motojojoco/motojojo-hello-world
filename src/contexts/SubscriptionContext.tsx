import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getUserSubscription, UserSubscription } from '@/services/subscriptionService';

type SubscriptionContextType = {
  isPremium: boolean;
  subscription: UserSubscription | null;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSubscriptionStatus = async () => {
    if (!user) {
      setIsPremium(false);
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const sub = await getUserSubscription(user.id);
      
      if (sub) {
        const endDate = new Date(sub.end_date);
        const isActive = endDate > new Date() && sub.payment_status === 'completed';
        
        setIsPremium(isActive);
        setSubscription(sub);
      } else {
        setIsPremium(false);
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsPremium(false);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user]);

  return (
    <SubscriptionContext.Provider 
      value={{ 
        isPremium, 
        subscription, 
        isLoading,
        refreshSubscription: checkSubscriptionStatus 
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

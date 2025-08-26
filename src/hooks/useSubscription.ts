import { useSubscription } from "@/contexts/SubscriptionContext";

export const useSubscriptionStatus = () => {
  return useSubscription();
};

import { supabase } from "@/integrations/supabase/client";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  duration_months: number;
  price: number;
  discount_percentage: number;
  is_active: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  payment_id: string | null;
  payment_status: string;
  amount_paid: number;
  plan?: SubscriptionPlan;
}

export const getActivePlans = async (): Promise<SubscriptionPlan[]> => {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('duration_months', { ascending: true });

  if (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }

  return data || [];
};

export const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*, plan:subscription_plans(*)')
    .eq('user_id', userId)
    .order('end_date', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching user subscription:', error);
    throw error;
  }

  return data;
};

export const createSubscription = async (
  userId: string, 
  planId: string, 
  paymentId: string,
  amount: number
): Promise<UserSubscription> => {
  // Get plan details
  const { data: plan, error: planError } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('id', planId)
    .single();

  if (planError || !plan) {
    throw new Error('Invalid subscription plan');
  }

  // Calculate subscription dates
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + plan.duration_months);

  // Create subscription record
  const { data: subscription, error: subError } = await supabase
    .from('user_subscriptions')
    .insert([{
      user_id: userId,
      plan_id: planId,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      payment_id: paymentId,
      payment_status: 'completed',
      amount_paid: amount,
    }])
    .select('*, plan:subscription_plans(*)')
    .single();

  if (subError) {
    console.error('Error creating subscription:', subError);
    throw subError;
  }

  return subscription;
};

export const isUserPremium = async (userId: string): Promise<boolean> => {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return false;
  
  const now = new Date();
  const endDate = new Date(subscription.end_date);
  return endDate > now && subscription.payment_status === 'completed';
};

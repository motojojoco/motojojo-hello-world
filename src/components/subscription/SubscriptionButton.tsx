import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getActivePlans, createSubscription, UserSubscription } from "@/services/subscriptionService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const SubscriptionButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, subscriptionData] = await Promise.all([
          getActivePlans(),
          user ? getCurrentSubscription() : Promise.resolve(null),
        ]);
        setPlans(plansData);
        setCurrentSubscription(subscriptionData);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load subscription information.',
          variant: 'destructive',
        });
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, user]);

  const getCurrentSubscription = async () => {
    if (!user) return null;
    try {
      const subscription = await supabase
        .from('user_subscriptions')
        .select('*, plan:subscription_plans(*)')
        .eq('user_id', user.id)
        .order('end_date', { ascending: false })
        .limit(1)
        .single();

      return subscription.data as UserSubscription;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  };

  const handlePurchase = async (planId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to purchase a subscription.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedPlan(planId);
    setIsLoading(true);

    try {
      // Create a payment intent with Razorpay
      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error('Invalid plan selected');

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: plan.price * 100, // Razorpay uses paise (1/100th of a rupee)
        currency: 'INR',
        name: 'Motojojo',
        description: plan.name,
        image: '/logo.png',
        handler: async function (response: any) {
          try {
            // Verify payment with your backend
            await createSubscription(user.id, planId, response.razorpay_payment_id, plan.price);
            
            // Refresh subscription data
            const subscription = await getCurrentSubscription();
            setCurrentSubscription(subscription);
            
            toast({
              title: 'Success!',
              description: 'Your subscription has been activated successfully!',
            });
          } catch (error) {
            console.error('Error processing subscription:', error);
            toast({
              title: 'Error',
              description: 'There was an error processing your subscription. Please contact support.',
              variant: 'destructive',
            });
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
          contact: user.phone || '',
        },
        theme: {
          color: '#4F46E5',
        },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', function (response: any) {
        toast({
          title: 'Payment Failed',
          description: response.error.description || 'Payment was not completed successfully.',
          variant: 'destructive',
        });
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const getSubscriptionStatus = () => {
    if (!currentSubscription) return null;
    
    const endDate = new Date(currentSubscription.end_date);
    const isActive = endDate > new Date();
    
    return (
      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h3 className="font-medium text-green-800 dark:text-green-200">
          {isActive ? (
            <span>Active Subscription</span>
          ) : (
            <span>Subscription Expired</span>
          )}
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          {isActive 
            ? (
              <span>
                Your {currentSubscription.plan?.name} is active until {format(endDate, 'PPP')}
              </span>
            ) 
            : (
              <span>
                Your subscription expired on {format(endDate, 'PPP')}
              </span>
            )
          }
        </p>
        {isActive && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            Enjoy your premium benefits!
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        {currentSubscription && new Date(currentSubscription.end_date) > new Date() ? (
          <>
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Premium Member
          </>
        ) : (
          'Go Premium'
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
            <DialogDescription>
              Get access to exclusive features and discounts with our premium plans.
            </DialogDescription>
          </DialogHeader>

          {getSubscriptionStatus()}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const isCurrentPlan = currentSubscription?.plan_id === plan.id && 
                                 new Date(currentSubscription.end_date) > new Date();
              const isSelected = selectedPlan === plan.id;
              const discountedPrice = plan.price * (1 - (plan.discount_percentage / 100));
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative overflow-hidden transition-all ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  } ${
                    isCurrentPlan ? 'border-green-500' : ''
                  }`}
                >
                  {isCurrentPlan && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-md">
                      Current Plan
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      ₹{discountedPrice.toFixed(2)}
                      {plan.discount_percentage > 0 && (
                        <span className="ml-2 text-sm text-muted-foreground line-through">
                          ₹{plan.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {plan.discount_percentage > 0 && (
                      <Badge className="w-fit" variant="outline">
                        Save {plan.discount_percentage}%
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {plan.description}
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Access to all premium events</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Exclusive member discounts</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Priority customer support</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      disabled={isCurrentPlan || isLoading}
                      onClick={() => handlePurchase(plan.id)}
                    >
                      {isCurrentPlan 
                        ? 'Current Plan' 
                        : `Get ${plan.name.split(' ')[0]}`}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const CheckCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

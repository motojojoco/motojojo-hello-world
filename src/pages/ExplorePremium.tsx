
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import RazorpayButton from "@/components/ui/RazorpayButton";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const premiumPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 499,
    description: "Perfect for getting started",
    features: [
      "1 Free Event Every Month",
      "Up to 15% off on all events",
      "Priority Support",
      "Early Access to select events"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 999,
    description: "Most Popular",
    features: [
      "2 Free Events Every Month",
      "Up to 25% off on all events",
      "24/7 Priority Support",
      "Early Access to all events",
      "Exclusive Artist Meet & Greets",
      "Free Event Merchandise"
    ]
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: 1999,
    description: "For true event enthusiasts",
    features: [
      "4 Free Events Every Month",
      "Up to 35% off on all events",
      "24/7 VIP Support",
      "Earliest Access to all events",
      "VIP Artist Meet & Greets",
      "Premium Event Merchandise",
      "Backstage Access at select events",
      "Partner Benefits & Exclusive Deals"
    ]
  }
];

const ExplorePremium = () => {
  const [selectedPlan, setSelectedPlan] = useState(premiumPlans[1].id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container-padding py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Upgrade Your Event Experience
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get exclusive access to premium features, discounts, and VIP experiences
            with our Premium membership plans.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {premiumPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative hover:shadow-glow transition-shadow ${
                plan.id === "pro" ? "border-violet/50 shadow-glow" : ""
              }`}
            >
              {plan.id === "pro" && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet to-red text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {selectedPlan === plan.id ? (
                  <RazorpayButton
                    eventId="premium_subscription"
                    eventName={`Premium ${plan.name} Subscription`}
                    amount={plan.price}
                  />
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    Select Plan
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Premium Benefits
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-violet" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Monthly Events</h3>
              <p className="text-muted-foreground">
                Get complimentary tickets to select events every month
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-violet" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exclusive Discounts</h3>
              <p className="text-muted-foreground">
                Save up to 35% on all event tickets
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-violet" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Priority Access</h3>
              <p className="text-muted-foreground">
                Book tickets before they're available to the public
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExplorePremium;

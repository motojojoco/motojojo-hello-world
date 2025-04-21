
import { useState } from "react";
import RazorpayButton from "@/components/ui/RazorpayButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PricingPage() {
  // Demo data: could be refactored to fetch in real app
  const plans = [
    {
      name: "Premium Pass",
      amount: 499,
      description: "Full access to all premium events, VIP support, and more.",
      perks: ["All-access Events", "VIP Customer Support", "Early-bird Offers"],
    },
    {
      name: "Elite Pass",
      amount: 999,
      description: "Everything in Premium plus backstage and artist meet-ups!",
      perks: ["+ Backstage Entry", "+ Meet & Greet artists"],
    }
  ];
  const [selected, setSelected] = useState(plans[0]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-raspberry p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-sandstorm text-center mb-6">Choose Your Premium Plan</h1>
        <div className="flex flex-col gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`transition-all duration-200 ${selected.name === plan.name ? "border-sandstorm ring-4 ring-sandstorm/60" : "border-gray-200 hover:scale-105"} bg-sandstorm/90`}
              onClick={() => setSelected(plan)}
              tabIndex={0}
              role="button"
            >
              <CardHeader>
                <CardTitle className="text-2xl text-violet font-extrabold">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-black">₹{plan.amount}</div>
                <div className="text-base text-violet mt-2">{plan.description}</div>
                <ul className="list-disc text-sm mt-2 ml-5 text-black">
                  {plan.perks.map((perk) => <li key={perk}>{perk}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <RazorpayButton
            eventId="premium-subscription"
            eventName={selected.name}
            amount={selected.amount}
            className="bg-violet text-sandstorm font-bold px-8 py-3 rounded-xl text-lg shadow-glow"
          />
        </div>
      </div>
    </div>
  );
}

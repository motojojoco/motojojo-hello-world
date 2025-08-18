import { useState } from "react";
import RazorpayButton from "@/components/ui/RazorpayButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Gift, Users, Calendar, Lock, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const premiumFeatures = [
  {
    icon: <Star className="h-5 w-5 text-yellow" />, 
    title: "Priority Access to Events",
    description: "Book tickets before anyone else and never miss out on your favorite experiences."
  },
  {
    icon: <Gift className="h-5 w-5 text-pink-500" />,
    title: "Exclusive Member-Only Events",
    description: "Attend special events curated just for Motojojo Premium members."
  },
  {
    icon: <Users className="h-5 w-5 text-blue-500" />,
    title: "VIP Community Access",
    description: "Join a premium community of event lovers, artists, and organizers."
  },
  {
    icon: <Calendar className="h-5 w-5 text-violet" />,
    title: "Personalized Event Recommendations",
    description: "Get tailored suggestions based on your interests and past bookings."
  },
  {
    icon: <Lock className="h-5 w-5 text-gray-500" />,
    title: "Ad-Free Experience",
    description: "Enjoy browsing and booking events without any interruptions."
  },
  {
    icon: <Clock className="h-5 w-5 text-green-500" />,
    title: "24/7 Premium Support",
    description: "Get priority customer support whenever you need help."
  },
  {
    icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
    title: "Special Discounts & Offers",
    description: "Unlock exclusive deals and discounts on select events."
  },
];

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
      <div className="w-full max-w-2xl mb-10">
        <h1 className="text-4xl font-bold text-sandstorm text-center mb-2">Motojojo Premium</h1>
        <div className="flex flex-col items-center mb-4">
          <Badge className="bg-yellow text-black text-base px-4 py-2 rounded-full mb-2">Coming Soon</Badge>
          <p className="text-lg text-white/90 text-center max-w-xl">
            Unlock the best of Motojojo with exclusive features, early access, and a premium community experience. <br/>
            <span className="text-sandstorm font-semibold">Premium is launching soon—here's what's coming:</span>
          </p>
        </div>
      </div>

      <div className="w-full max-w-2xl mb-12">
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
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl text-violet font-extrabold">{plan.name}</CardTitle>
                  <Badge className="bg-yellow text-black text-xs px-2 py-1 rounded-full">Coming Soon</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-black">₹{plan.amount}</div>
                <div className="text-base text-violet mt-2">{plan.description}</div>
                <ul className="list-disc text-sm mt-2 ml-5 text-black">
                  {plan.perks.map((perk) => <li key={perk}>{perk}</li>)}
                </ul>
                <Button disabled className="w-full mt-4 bg-gradient-to-r from-yellow to-orange-400 text-black font-bold text-lg py-2 opacity-80 cursor-not-allowed">
                  Subscribe (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl mb-12">
        <h2 className="text-2xl font-bold text-sandstorm text-center mb-6">Premium Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {premiumFeatures.map((feature) => (
            <Card key={feature.title} className="bg-white/90 border-0 shadow-md flex flex-row items-center gap-4 p-4">
              {feature.icon}
              <div>
                <div className="font-semibold text-lg mb-1">{feature.title}</div>
                <div className="text-muted-foreground text-base">{feature.description}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center mt-8 mb-8">
        <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
        <h3 className="text-xl font-bold text-sandstorm mb-2">Motojojo Premium is launching soon!</h3>
        <p className="text-base text-white/80 mb-4 text-center max-w-lg">
          Stay tuned for updates and be the first to experience the next level of events and entertainment. <br/>
          <span className="text-yellow font-semibold">Coming Soon</span>
        </p>
        <Button disabled className="bg-gradient-to-r from-yellow to-orange-400 text-black font-bold text-lg px-8 py-3 opacity-80 cursor-not-allowed">
          Coming Soon
        </Button>
      </div>
    </div>
  );
}

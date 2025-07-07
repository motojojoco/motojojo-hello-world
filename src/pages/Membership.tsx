import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion";
import { 
  Crown, 
  Users, 
  Star, 
  Gift, 
  Calendar, 
  MapPin, 
  Zap, 
  Shield,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const MembershipPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const membershipPlans = [
    {
      id: "member",
      name: "Motojojo Member",
      icon: <Users className="h-8 w-8 text-violet" />,
      price: "₹299",
      period: "per month",
      description: "",
      features: [
        "For the curious, the kind, and the creative souls who want to be part of something bigger than just events.",
        "If you love warm lights, deep conversations, and art that brings people closer, this is your tribe.",
        "We’re not just selling tickets—we’re building a family of misfits, dreamers, and doers who want to host, volunteer, or simply show up with their whole heart.",
        "Tell us your story, your vibe, and what you seek. Let’s create magic together, one gathering at a time."
      ],
      badge: "Most Popular",
      color: "violet"
    },
    {
      id: "gang",
      name: "Motojojo Gang",
      icon: <Crown className="h-8 w-8 text-yellow" />,
      price: "₹599",
      period: "per month",
      description: "",
      features: [
        "Ready to take the lead and help shape the future of independent art gatherings in India?",
        "The JoJo Gang is for those who want to do more—host, curate, create, and inspire.",
        "Whether you’re an artist, a connector, a storyteller, a chef, or someone who just loves bringing people together, we want to know what excites you!",
        "Share your passions, your city, and how you’d like to contribute. Let’s build a safe, vibrant space for artists and art lovers, together."
      ],
      badge: "Premium",
      color: "yellow"
    }
  ];

  const benefits = [
    {
      icon: <Star className="h-6 w-6 text-yellow" />,
      title: "Be the First to Know",
      description: "Get early access to every new gathering, before the world hears about it."
    },
    {
      icon: <Gift className="h-6 w-6 text-raspberry" />,
      title: "Your Story, Our Spotlight",
      description: "Share your art, music, or poetry and get featured in our community stories."
    },
    {
      icon: <Calendar className="h-6 w-6 text-violet" />,
      title: "Curate & Co-Create",
      description: "Step up to host, volunteer, or co-create magical experiences with us."
    },
    {
      icon: <MapPin className="h-6 w-6 text-sandstorm" />,
      title: "Find Your Tribe",
      description: "Join intimate WhatsApp/Instagram groups and connect with like-hearted souls near you."
    },
    {
      icon: <Zap className="h-6 w-6 text-raspberry" />,
      title: "No Booking Fees, Just Vibes",
      description: "Enjoy seamless access to events—no extra charges, just bring your energy!"
    },
    {
      icon: <Shield className="h-6 w-6 text-violet" />,
      title: "Always Supported",
      description: "Get priority help and 24/7 support from the Motojojo team."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-raspberry via-violet to-raspberry">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <FadeIn delay={200}>
            <h1 className="text-5xl md:text-6xl font-bold text-sandstorm mb-4">
              Join the <span className="text-yellow">Motojojo</span> Family
            </h1>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Choose your membership level and unlock exclusive access to the best events, 
              experiences, and community in your city.
            </p>
          </FadeIn>
        </div>

        {/* Membership Plans */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {membershipPlans.map((plan, index) => (
              <FadeIn key={plan.id} delay={400 + index * 100}>
                <Card 
                  className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedPlan === plan.id 
                      ? plan.color === 'violet' 
                        ? 'border-violet ring-4 ring-violet/60 bg-white/95'
                        : 'border-yellow ring-4 ring-yellow/60 bg-white/95'
                      : 'border-white/20 bg-white/90 hover:bg-white/95'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.badge && (
                    <Badge className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${plan.color === 'violet' ? 'bg-violet' : 'bg-yellow'} text-black font-bold px-4 py-1`}>
                      {plan.badge}
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      {plan.icon}
                    </div>
                    <CardTitle className="text-3xl font-bold text-violet mb-2">
                      {plan.name}
                    </CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-bold text-raspberry">Join the Community</span>
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${plan.color === 'violet' 
                        ? 'bg-gradient-to-r from-violet to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white' 
                        : 'bg-gradient-to-r from-yellow to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black'
                      } font-bold text-lg py-3 transition-all duration-300`}
                      size="lg"
                    >
                      <Link to={plan.id === 'member' ? '/mjmember' : plan.id === 'gang' ? '/jojogang' : '#'} className="flex items-center justify-center w-full">
                        {plan.id === 'member' ? 'Join Now' : plan.id === 'gang' ? 'Join Now' : 'Coming Soon'}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <FadeIn delay={600}>
            <h2 className="text-3xl font-bold text-sandstorm text-center mb-12">
              Why Choose Motojojo Membership?
            </h2>
          </FadeIn>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <FadeIn key={index} delay={700 + index * 100}>
                <Card className="bg-white/90 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-bold text-violet mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <FadeIn delay={800}>
            <div className="bg-white/90 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-violet mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of event lovers who are already part of the Motojojo community. 
                Start exploring amazing experiences today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-gradient-to-r from-violet to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-bold"
                  size="lg"
                >
                  <Link to="/events" className="flex items-center">
                    Explore Events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-violet text-violet hover:bg-violet/10 font-bold"
                  size="lg"
                >
                  <Link to="/" className="flex items-center">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage; 
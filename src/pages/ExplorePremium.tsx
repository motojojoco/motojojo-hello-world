
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

export default function ExplorePremium() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-raspberry">
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-16 shadow-xl max-w-2xl w-full border-4 border-sandstorm">
        <div className="flex flex-col items-center text-center space-y-6">
          <Ticket size={48} className="text-sandstorm animate-pulse" />
          <h1 className="text-4xl font-bold text-white tracking-tight">Go Premium</h1>
          <p className="text-lg text-white/90">
            Unlock exclusive events and premium perks—only for our Elite Members.<br/>
            <span className="text-sandstorm font-semibold"> Enjoy the best experiences!</span>
          </p>
          <Button
            size="lg"
            className="bg-sandstorm text-violet font-bold text-lg hover:scale-105 hover:bg-sandstorm/90 transition-all shadow-glow-yellow px-10 py-4 rounded-xl uppercase mt-2"
            onClick={() => navigate("/pricing")}
          >
            Explore Pricing
          </Button>
        </div>
      </div>
    </div>
  );
}

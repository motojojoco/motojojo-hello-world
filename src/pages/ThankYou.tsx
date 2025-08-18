import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-raspberry">
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-grow px-4 pt-16 pb-8">
        <div className="bg-[#D32F55] rounded-xl shadow-lg p-8 max-w-lg w-full flex flex-col items-center mt-8">
          <h1 className="text-3xl font-bold text-yellow-300 mb-4 text-center">Thank You for Your Booking!</h1>
          <p className="text-lg text-white mb-6 text-center">
            Your ticket has been booked successfully.<br />
            You will receive a confirmation email and WhatsApp message shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button
              className="bg-yellow-300 text-black font-bold w-full sm:w-auto hover:bg-yellow-400"
              onClick={() => navigate("/profile?tab=bookings")}
            >
              View My Tickets
            </Button>
            <Button
              variant="outline"
              className="border-yellow-300 text-yellow-300 font-bold w-full sm:w-auto hover:bg-yellow-400 hover:text-black"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYou; 
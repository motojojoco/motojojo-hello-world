import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react"; // Added import for the Check icon

interface RazorpayButtonProps {
  eventId: number;
  eventName: string;
  amount: number;
  onSuccess?: () => void;
}

// Mock function to load Razorpay script
const loadRazorpayScript = (callback: () => void) => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
};

const RazorpayButton = ({ eventId, eventName, amount, onSuccess }: RazorpayButtonProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Load Razorpay script and open payment
    loadRazorpayScript(() => {
      const options = {
        key: "rzp_test_kXdvIUTOdIictY", // Test key from prompt
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "Motojojo",
        description: `Ticket for ${eventName}`,
        image: "https://your-logo-url.png", // Replace with your logo
        handler: function() {
          // On successful payment
          setIsFormOpen(false);
          setIsSuccessOpen(true);
          if (onSuccess) onSuccess();
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#6A0DAD"
        }
      };
      
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    });
  };

  return (
    <>
      <Button 
        className="bg-gradient-to-r from-violet to-red hover:opacity-90 transition-opacity"
        onClick={() => setIsFormOpen(true)}
      >
        Book Now
      </Button>
      
      {/* Booking Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              Please provide your details to book tickets for {eventName}.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone">WhatsApp Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your WhatsApp number"
                  required
                />
              </div>
              
              <div className="mt-2 text-right font-semibold">
                Amount: ₹{amount.toLocaleString()}
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Proceed to Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center text-green-500">Booking Confirmed!</DialogTitle>
          </DialogHeader>
          
          <div className="py-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-lg mb-2">Your seat is booked!</p>
            <p className="text-muted-foreground">Can't wait to see you there!</p>
          </div>
          
          <DialogFooter>
            <Button 
              className="w-full"
              onClick={() => setIsSuccessOpen(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RazorpayButton;

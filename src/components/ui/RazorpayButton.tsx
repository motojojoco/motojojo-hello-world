import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogScrollArea
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface RazorpayButtonProps {
  eventId: string;
  eventName: string;
  amount: number;
  onSuccess?: () => void;
  className?: string;
}

interface TicketHolder {
  name: string;
}

// Mock function to load Razorpay script
const loadRazorpayScript = (callback: () => void) => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
};

const RazorpayButton = ({ eventId, eventName, amount, onSuccess, className }: RazorpayButtonProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tickets: 1
  });
  const [ticketHolders, setTicketHolders] = useState<TicketHolder[]>([{ name: "" }]);
  const { toast } = useToast();
  const { user, isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Subscribe to real-time booking updates
  useEffect(() => {
    const channel = supabase
      .channel('bookings-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `event_id=eq.${eventId}`
        },
        (payload) => {
          console.log('New booking:', payload);
          // Refresh event details if needed
          if (onSuccess) onSuccess();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, onSuccess]);

  const upsertUserIfNeeded = async (formData: any) => {
    if (!user?.id) return;
    const { data: existing, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const newUserProfile = {
      id: user.id,
      email: formData.email,
      full_name: formData.name,
      phone: formData.phone,
      created_at: new Date().toISOString()
    };

    if (!existing) {
      // Insert user if doesn't exist
      await supabase.from('users').insert(newUserProfile);
    } else {
      // Update only if changed
      if (
        existing.email !== formData.email ||
        existing.full_name !== formData.name ||
        existing.phone !== formData.phone
      ) {
        await supabase.from('users').update({
          email: formData.email,
          full_name: formData.name,
          phone: formData.phone,
        }).eq('id', user.id);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'tickets') {
        const ticketCount = parseInt(value) || 1;
        const newCount = Math.max(1, Math.min(10, ticketCount));
        
        // Update ticket holders array based on new ticket count
        setTicketHolders(prevHolders => {
          const newHolders = [...prevHolders];
          if (newCount > prevHolders.length) {
            // Add new holders
            for (let i = prevHolders.length; i < newCount; i++) {
              newHolders.push({ name: "" });
            }
          } else if (newCount < prevHolders.length) {
            // Remove excess holders
            newHolders.splice(newCount);
          }
          return newHolders;
        });
        
        return { ...prev, [name]: newCount };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleTicketHolderChange = (index: number, value: string) => {
    setTicketHolders(prev => {
      const newHolders = [...prev];
      newHolders[index] = { name: value };
      return newHolders;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book tickets.",
        variant: "destructive"
      });
      setIsFormOpen(false);
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate all ticket holder names
    if (ticketHolders.some(holder => !holder.name.trim())) {
      toast({
        title: "Missing Names",
        description: "Please provide names for all ticket holders.",
        variant: "destructive"
      });
      return;
    }

    await upsertUserIfNeeded(formData);

    loadRazorpayScript(() => {
      const totalAmount = amount * formData.tickets;

      const options = {
        key: "rzp_test_kXdvIUTOdIictY",
        amount: totalAmount * 100,
        currency: "INR",
        name: "Motojojo",
        description: `${formData.tickets} Ticket(s) for ${eventName}`,
        image: "https://your-logo-url.png",
        handler: async function(response: any) {
          try {
            // Save booking to Supabase
            const { data: booking, error: bookingError } = await supabase
              .from('bookings')
              .insert({
                user_id: user?.id,
                event_id: eventId,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                tickets: formData.tickets,
                amount: totalAmount,
                status: 'confirmed',
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id || null,
                booking_date: new Date().toISOString()
              })
              .select('id')
              .single();

            if (bookingError) {
              console.error("Error saving booking:", bookingError);
              toast({
                title: "Booking Error",
                description: "There was an error saving your booking. Please contact support.",
                variant: "destructive"
              });
              return;
            }

            // Generate tickets for each holder
            for (let i = 0; i < ticketHolders.length; i++) {
              const ticketNumber = `MJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
              const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketNumber}`;
              
              await supabase
                .from('tickets')
                .insert({
                  booking_id: booking.id,
                  ticket_number: ticketNumber,
                  qr_code: qrCode,
                  username: ticketHolders[i].name,
                });
            }

            // After creating tickets, send email and WhatsApp message
            const { data: eventData } = await supabase
              .from('events')
              .select('*')
              .eq('id', eventId)
              .single();

            if (eventData) {
              // Send email with tickets
              await supabase.functions.invoke('send-ticket', {
                body: {
                  email: formData.email,
                  name: formData.name,
                  eventTitle: eventData.title,
                  eventDate: eventData.date,
                  eventTime: eventData.time,
                  eventVenue: `${eventData.venue}, ${eventData.city}`,
                  ticketNumbers: [], // No ticket numbers needed
                  qrCodes: [] // No QR codes needed
                }
              });

              // Send WhatsApp message with ticket details
              try {
                await supabase.functions.invoke('send-whatsapp', {
                  body: {
                    to: formData.phone,
                    eventTitle: eventName,
                    ticketCount: formData.tickets,
                    date: eventData.date,
                    time: eventData.time,
                    venue: `${eventData.venue}, ${eventData.city}`
                  }
                });
              } catch (whatsappError) {
                console.error('Error sending WhatsApp message:', whatsappError);
                // Don't throw error here as booking was successful
              }
            }

            setIsFormOpen(false);
            setIsSuccessOpen(true);
            if (onSuccess) onSuccess();
          } catch (err) {
            console.error("Error processing payment:", err);
            toast({
              title: "Payment Error",
              description: "There was an error processing your payment. Please try again.",
              variant: "destructive"
            });
          }
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

  const handleButtonClick = () => {
    if (!isSignedIn) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book tickets.",
      });
      return;
    }
    setIsFormOpen(true);
  };
  
  return (
    <>
      <Button 
        className={className || "bg-gradient-to-r from-sandstorm to-sandstorm hover:opacity-90 transition-opacity"}
        onClick={handleButtonClick}
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
            <DialogScrollArea className="max-h-[80vh]">
              <div className="grid gap-4 py-4 px-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Your Full Name</Label>
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
                
                <div className="grid gap-2">
                  <Label htmlFor="tickets">Number of Tickets</Label>
                  <Input
                    id="tickets"
                    name="tickets"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.tickets}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Ticket Holder Names */}
                {ticketHolders.map((holder, index) => (
                  <div key={index} className="grid gap-2">
                    <Label htmlFor={`ticket-holder-${index}`}>
                      {index === 0 ? "Primary Ticket Holder" : `Additional Ticket Holder ${index + 1}`}
                    </Label>
                    <Input
                      id={`ticket-holder-${index}`}
                      value={holder.name}
                      onChange={(e) => handleTicketHolderChange(index, e.target.value)}
                      placeholder={`Enter ticket holder ${index + 1}'s name`}
                      required
                    />
                  </div>
                ))}
                
                <div className="mt-2 text-right font-semibold">
                  <div>Price: ₹{amount.toLocaleString()} x {formData.tickets}</div>
                  <div className="text-lg">Total: ₹{(amount * formData.tickets).toLocaleString()}</div>
                </div>
              </div>
            </DialogScrollArea>
            
            <DialogFooter className="mt-4">
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
            <p className="text-lg mb-2">Your seats are booked!</p>
            <p className="text-muted-foreground">Can't wait to see you there!</p>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              className="w-full"
              onClick={() => {
                setIsSuccessOpen(false);
                navigate("/profile");
              }}
            >
              View My Tickets
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => setIsSuccessOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RazorpayButton;

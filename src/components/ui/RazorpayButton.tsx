import { useState, useEffect } from "react";
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
import { Check, Eye } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ScrollableNumberInput } from "@/components/ui/scrollable-number-input";
import BookingTicket from "@/components/tickets/BookingTicket";

interface RazorpayButtonProps {
  eventId: string; // Changed to string only since we're using UUIDs
  eventName: string;
  amount: number;
  onSuccess?: () => void;
  className?: string; // Added className prop to the interface
}

// Load Razorpay script
const loadRazorpayScript = (callback: () => void) => {
  if (typeof window !== 'undefined' && (window as any).Razorpay) {
    callback();
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = callback;
  document.head.appendChild(script);
};

const RazorpayButton = ({ eventId, eventName, amount, onSuccess, className }: RazorpayButtonProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tickets: 1
  });
  const [ticketNames, setTicketNames] = useState<string[]>([""]);
  const [lastBookingId, setLastBookingId] = useState<string | null>(null);
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

  // Update ticket names when ticket count changes
  useEffect(() => {
    if (formData.tickets > ticketNames.length) {
      // Add more name fields
      setTicketNames(prev => [...prev, ...Array(formData.tickets - prev.length).fill("")]);
    } else if (formData.tickets < ticketNames.length) {
      // Remove extra name fields
      setTicketNames(prev => prev.slice(0, formData.tickets));
    }
  }, [formData.tickets, ticketNames.length]);

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
        return { ...prev, [name]: Math.max(1, Math.min(15, ticketCount)) };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleTicketCountChange = (value: number) => {
    setFormData(prev => ({ ...prev, tickets: value }));
  };

  const handleTicketNameChange = (index: number, value: string) => {
    setTicketNames(prev => {
      const newNames = [...prev];
      newNames[index] = value;
      return newNames;
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

    // Validate ticket names if multiple tickets
    if (formData.tickets > 1) {
      const emptyNames = ticketNames.slice(0, formData.tickets).filter(name => !name.trim());
      if (emptyNames.length > 0) {
        toast({
          title: "Missing Names",
          description: "Please provide names for all ticket holders.",
          variant: "destructive"
        });
        return;
      }
    }

    await upsertUserIfNeeded(formData);

    loadRazorpayScript(() => {
      const totalAmount = amount * formData.tickets;

      const options = {
        key: "rzp_live_yAyC4YmewB4VQG", // Live key
        amount: totalAmount * 100,
        currency: "INR",
        name: "Motojojo",
        description: `${formData.tickets} Ticket(s) for ${eventName}`,
        image: "/motojojo-logo.png", // Updated to use new logo
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
                booking_date: new Date().toISOString(),
                ticket_names: formData.tickets > 1 ? ticketNames : [formData.name],
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

            // Store the booking ID for the success dialog
            setLastBookingId(booking.id);

            // Generate tickets for the booking
            const ticketNumbers: string[] = [];
            const qrCodes: string[] = [];

            for (let i = 0; i < formData.tickets; i++) {
              const ticketNumber = `MJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
              const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketNumber}`;
              
              // Use individual name if multiple tickets, otherwise use main name
              const ticketHolderName = formData.tickets > 1 ? ticketNames[i] : formData.name;
              
              const { data: ticketData, error: ticketError } = await supabase
                .from('tickets')
                .insert({
                  booking_id: booking.id,
                  ticket_number: ticketNumber,
                  qr_code: qrCode,
                  username: ticketHolderName,
                })
                .select()
                .single();

              if (ticketError) {
                console.error("Error creating ticket:", ticketError);
                continue;
              }

              if (ticketData) {
                ticketNumbers.push(ticketData.ticket_number);
                qrCodes.push(ticketData.qr_code || '');
              }
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
                  ticketNumbers,
                  qrCodes,
                  ticketHolderNames: formData.tickets > 1 ? ticketNames : undefined
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
              
              <div className="grid gap-2">
                <Label htmlFor="tickets">Number of Tickets</Label>
                <ScrollableNumberInput
                  id="tickets"
                  name="tickets"
                  value={formData.tickets}
                  onChange={handleTicketCountChange}
                  min={1}
                  max={15}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
              </div>

              {/* Individual ticket holder names */}
              {formData.tickets > 1 && (
                <div className="grid gap-3">
                  <Label className="text-sm font-medium">Ticket Holder Names</Label>
                  <div className="text-xs text-muted-foreground mb-2">
                    Please provide the name for each person attending
                  </div>
                  {ticketNames.slice(0, formData.tickets).map((name, index) => (
                    <div key={index} className="grid gap-2">
                      <Label htmlFor={`ticket-name-${index}`} className="text-sm">
                        Ticket {index + 1} - Attendee Name
                      </Label>
                      <Input
                        id={`ticket-name-${index}`}
                        value={name}
                        onChange={(e) => handleTicketNameChange(index, e.target.value)}
                        placeholder={`Enter name for ticket ${index + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-2 text-right font-semibold">
                <div>Price: ₹{amount.toLocaleString()} x {formData.tickets}</div>
                <div className="text-lg">Total: ₹{(amount * formData.tickets).toLocaleString()}</div>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsPreviewOpen(true)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview Ticket
              </Button>
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
            <p className="text-lg mb-2">Your tickets are booked!</p>
            <p className="text-muted-foreground mb-4">Check your email for your tickets and QR codes.</p>
            <p className="text-sm text-muted-foreground">Can't wait to see you there!</p>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              className="w-full"
              onClick={() => {
                setIsSuccessOpen(false);
                navigate(`/ticket-preview/${lastBookingId}`);
              }}
            >
              View Ticket Preview
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsSuccessOpen(false);
                navigate("/profile");
              }}
            >
              View My Bookings
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

      {/* Ticket Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ticket Preview</DialogTitle>
            <DialogDescription>
              Preview how your ticket will look before booking
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <BookingTicket
              eventName={eventName}
              eventDescription="Event description will be loaded from the event details"
              eventDate="2024-06-15"
              eventTime="7:00 PM"
              eventVenue="Event Venue"
              eventCity="Event City"
              eventPrice={amount}
              bookerName={formData.name}
              bookerEmail={formData.email}
              bookerPhone={formData.phone}
              numberOfTickets={formData.tickets}
              totalAmount={amount * formData.tickets}
              isBooking={false}
              ticketHolderNames={ticketNames}
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPreviewOpen(false)}
            >
              Back to Form
            </Button>
            <Button 
              onClick={() => {
                setIsPreviewOpen(false);
                // Trigger form submission
                const form = document.querySelector('form');
                if (form) {
                  form.dispatchEvent(new Event('submit', { bubbles: true }));
                }
              }}
            >
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RazorpayButton;

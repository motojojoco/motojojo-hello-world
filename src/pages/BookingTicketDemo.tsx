import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import BookingTicket from "@/components/tickets/BookingTicket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Mail, Phone, Ticket } from "lucide-react";
import MovingPartyBackground from "@/components/ui/MovingPartyBackground";

export default function BookingTicketDemo() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isBooking, setIsBooking] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    tickets: 2
  });

  // Sample event data
  const eventData = {
    name: "Summer Music Festival 2024",
    description: "Join us for an unforgettable evening of live music, food, and entertainment under the stars.",
    date: "2024-06-15",
    time: "7:00 PM",
    venue: "Central Park Amphitheater",
    city: "Mumbai",
    price: 1500
  };

  // Calculate price breakdown
  const basePrice = eventData.price * formData.tickets;
  const gst = Math.round(basePrice * 0.18);
  const convenienceFee = 30 * formData.tickets;
  const subtotal = basePrice + gst + convenienceFee;

  const totalAmount = subtotal;

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookNow = async () => {
    setIsBooking(true);
    
    // Simulate booking process
    setTimeout(() => {
      setIsBooking(false);
      toast({
        title: "Booking Successful!",
        description: "Your tickets have been booked successfully.",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <MovingPartyBackground />
      
      <main className="flex-grow bg-gradient-to-br from-raspberry/10 to-purple-600/10 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Ticket UI Demo</h1>
            <p className="text-gray-600">See how the booking ticket looks with the booker's information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Form Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Booker Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tickets">Number of Tickets</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('tickets', Math.max(1, formData.tickets - 1))}
                        disabled={formData.tickets <= 1}
                      >
                        -
                      </Button>
                      <Input
                        id="tickets"
                        type="number"
                        min="1"
                        value={formData.tickets}
                        onChange={(e) => handleInputChange('tickets', parseInt(e.target.value) || 1)}
                        className="text-center w-20"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('tickets', formData.tickets + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event:</span>
                      <span className="font-medium">{eventData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(eventData.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tickets:</span>
                      <span className="font-medium">{formData.tickets} x ₹{eventData.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Fee:</span>
                      <span className="font-medium">₹0</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ticket Preview Section */}
            <div className="flex flex-col items-center justify-center">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Live Ticket Preview</h2>
                <p className="text-gray-600">See how your ticket will look</p>
              </div>
              
              <BookingTicket
                eventName={eventData.name}
                eventDescription={eventData.description}
                eventDate={eventData.date}
                eventTime={eventData.time}
                eventVenue={eventData.venue}
                eventCity={eventData.city}
                eventPrice={eventData.price}
                bookerName={formData.name}
                bookerEmail={formData.email}
                bookerPhone={formData.phone}
                numberOfTickets={formData.tickets}
                totalAmount={subtotal}
                onBookNow={handleBookNow}
                isBooking={isBooking}
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Ticket UI Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <User className="h-8 w-8 text-raspberry mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Booker Information</h3>
                    <p className="text-sm text-gray-600">Displays the name, email, and phone number of the person booking the ticket</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Ticket className="h-8 w-8 text-raspberry mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Ticket Details</h3>
                    <p className="text-sm text-gray-600">Shows number of tickets, price breakdown, and total amount</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Mail className="h-8 w-8 text-raspberry mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Real-time Preview</h3>
                    <p className="text-sm text-gray-600">Live preview updates as you change the booking information</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 
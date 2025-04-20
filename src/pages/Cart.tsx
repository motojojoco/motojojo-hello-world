
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { FadeIn } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Minus, Plus, Ticket } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCartStore, CartItem } from "@/store/cart-store";
import { createBookingFromCart } from "@/services/bookingService";

const Cart = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useAuth();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form validation
  const isFormValid = name && email && phone && items.length > 0;
  
  const handleQuantityChange = (item: CartItem, newQty: number) => {
    if (newQty >= 1 && newQty <= 10) {
      updateQuantity(item.id, newQty);
    }
  };
  
  const handleCheckout = async () => {
    if (!isSignedIn || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to complete your booking.",
      });
      navigate("/");
      return;
    }
    
    if (!isFormValid) {
      toast({
        title: "Incomplete Information",
        description: "Please fill all required fields to proceed.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process each item in cart
      for (const item of items) {
        const booking = await createBookingFromCart(
          user.id,
          item.eventId,
          name,
          email,
          phone,
          item.quantity,
          item.price * item.quantity
        );
        
        if (!booking) {
          throw new Error(`Failed to create booking for ${item.eventTitle}`);
        }
      }
      
      toast({
        title: "Booking Successful!",
        description: "Your tickets have been booked successfully.",
      });
      
      // Clear cart after successful checkout
      clearCart();
      
      // Redirect to bookings page
      navigate("/profile?tab=bookings");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  if (isLoaded && !isSignedIn) {
    toast({
      title: "Authentication Required",
      description: "Please sign in to view your cart.",
    });
    navigate("/");
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-padding">
          <FadeIn>
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Cart</h1>
          </FadeIn>
          
          {items.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-xl font-medium mb-2">Your Cart is Empty</h3>
                <p className="text-muted-foreground mb-6">Browse our events and add tickets to your cart.</p>
                <Button onClick={() => navigate("/")}>
                  Explore Events
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="md:col-span-2">
                <div className="space-y-4">
                  {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/4 h-40 md:h-auto">
                          <img 
                            src={item.eventImage} 
                            alt={item.eventTitle} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 md:p-6 md:w-3/4 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{item.eventTitle}</h3>
                            <p className="text-muted-foreground text-sm mb-2">
                              {item.venue}, {item.city} • {new Date(item.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                disabled={item.quantity >= 10}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Checkout Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Checkout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </form>
                    
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatCurrency(getTotalPrice())}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Booking Fee</span>
                        <span>₹0</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t border-border">
                        <span>Total</span>
                        <span>{formatCurrency(getTotalPrice())}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full flex items-center gap-2" 
                      onClick={handleCheckout}
                      disabled={!isFormValid || isProcessing}
                    >
                      {isProcessing ? (
                        <>Loading...</>
                      ) : (
                        <>
                          <Ticket className="h-4 w-4" />
                          Confirm Booking
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;

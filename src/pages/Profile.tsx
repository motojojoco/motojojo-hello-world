
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { FadeIn } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { categories } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Check, UserRound, MapPin, Phone, Mail, Ticket } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getUserBookings, getBookingTickets, Booking, Ticket as TicketType } from "@/services/bookingService";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { toast } = useToast();
  const { user, profile, isLoaded, isSignedIn, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get('tab') === 'bookings' ? 'bookings' : 'profile';
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [userProfile, setUserProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    preferences: [] as number[]
  });
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [ticketsForBooking, setTicketsForBooking] = useState<TicketType[]>([]);
  
  // Update active tab when URL changes
  useEffect(() => {
    const tab = queryParams.get('tab') === 'bookings' ? 'bookings' : 'profile';
    setActiveTab(tab);
  }, [location.search]);
  
  // Modified fetching logic
  const { 
    data: bookings = [], 
    isLoading: bookingsLoading,
    error: bookingsError,
    refetch: refetchBookings
  } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: () => getUserBookings(user?.id || ''),
    enabled: !!isSignedIn && !!user?.id,
    retry: 1
  });

  // Effect to handle loading states
  useEffect(() => {
    if (!isLoaded || !profile) {
      return;
    }

    if (bookingsError) {
      toast({
        title: "Error Loading Bookings",
        description: "There was a problem loading your bookings. Please try again.",
        variant: "destructive"
      });
    }
  }, [isLoaded, profile, bookingsError, toast]);
  
  // Effect to update local state when profile data loads
  useEffect(() => {
    if (profile) {
      setUserProfile({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        city: profile.city || "",
        preferences: profile.preferences ? JSON.parse(profile.preferences) : []
      });
    }
  }, [profile]);
  
  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your profile.",
      });
      navigate("/");
    }
  }, [isLoaded, isSignedIn, navigate, toast]);
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await updateProfile({
        full_name: userProfile.full_name,
        phone: userProfile.phone,
        city: userProfile.city,
        preferences: JSON.stringify(userProfile.preferences)
      });
      
      if (result) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive"
      });
    }
  };
  
  const handleInterestToggle = (categoryId: number) => {
    setUserProfile(prev => {
      const preferences = [...prev.preferences];
      
      if (preferences.includes(categoryId)) {
        return {
          ...prev,
          preferences: preferences.filter(id => id !== categoryId)
        };
      } else {
        return {
          ...prev,
          preferences: [...preferences, categoryId]
        };
      }
    });
  };

  // Modified handleViewTickets to use the new property name
  const handleViewTickets = async (booking: Booking) => {
    setSelectedBooking(booking);
    
    // Check if the booking has ticket_items array and use it directly
    if (booking.ticket_items && Array.isArray(booking.ticket_items)) {
      setTicketsForBooking(booking.ticket_items);
      setIsTicketDialogOpen(true);
    } else {
      // If tickets are not included in the booking, fetch them separately
      try {
        const ticketData = await getBookingTickets(booking.id);
        setTicketsForBooking(ticketData);
        setIsTicketDialogOpen(true);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast({
          title: "No Tickets Found",
          description: "We couldn't find any tickets for this booking.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-md mx-auto p-6">
            <Skeleton className="h-8 w-3/4 mb-6" />
            <Skeleton className="h-32 w-full mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-padding">
          <FadeIn>
            <h1 className="text-3xl md:text-4xl font-bold mb-8">My Profile</h1>
          </FadeIn>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FadeIn delay={100} className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <div className="flex">
                              <UserRound className="mr-2 h-4 w-4 text-muted-foreground mt-3" />
                              <Input 
                                id="full_name" 
                                value={userProfile.full_name} 
                                onChange={e => setUserProfile({...userProfile, full_name: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="flex">
                              <Mail className="mr-2 h-4 w-4 text-muted-foreground mt-3" />
                              <Input 
                                id="email" 
                                type="email" 
                                value={user?.primaryEmailAddress?.emailAddress || ''}
                                disabled
                                className="bg-gray-100"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="flex">
                              <Phone className="mr-2 h-4 w-4 text-muted-foreground mt-3" />
                              <Input 
                                id="phone" 
                                value={userProfile.phone} 
                                onChange={e => setUserProfile({...userProfile, phone: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <div className="flex">
                              <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-3" />
                              <Input 
                                id="city" 
                                value={userProfile.city} 
                                onChange={e => setUserProfile({...userProfile, city: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Button type="submit">Update Profile</Button>
                      </form>
                    </CardContent>
                  </Card>
                </FadeIn>
                
                <FadeIn delay={200}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Interests & Preferences</CardTitle>
                      <CardDescription>
                        Select your interests to get personalized recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categories.map(category => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`category-${category.id}`}
                              checked={userProfile.preferences.includes(category.id)}
                              onCheckedChange={() => handleInterestToggle(category.id)}
                            />
                            <Label 
                              htmlFor={`category-${category.id}`}
                              className="cursor-pointer"
                            >
                              {category.name}
                            </Label>
                          </div>
                        ))}
                        
                        <Button 
                          type="button" 
                          className="w-full mt-4"
                          onClick={handleProfileUpdate}
                        >
                          Save Preferences
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
            </TabsContent>
            
            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <FadeIn>
                <div className="grid grid-cols-1 gap-6">
                  {bookingsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-pulse">Loading your bookings...</div>
                    </div>
                  ) : bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden border-none shadow-soft">
                        <div className="md:flex">
                          <div className="md:w-1/4 h-48 md:h-auto">
                            {booking.event && (
                              <img 
                                src={booking.event.image} 
                                alt={booking.event.title} 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="p-6 md:w-3/4">
                            <div className="flex flex-col md:flex-row justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold mb-1">
                                  {booking.event ? booking.event.title : "Event details not available"}
                                </h3>
                                <p className="text-muted-foreground">
                                  {booking.event ? booking.event.subtitle : ""}
                                </p>
                              </div>
                              <div className="mt-2 md:mt-0 flex items-center">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  booking.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500' 
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500'
                                }`}>
                                  {booking.status === 'confirmed' && <Check className="mr-1 h-3 w-3" />}
                                  {booking.status}
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              {booking.event && (
                                <>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Event Date</div>
                                    <div className="font-medium">{formatDate(booking.event.date)}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Booking Date</div>
                                    <div className="font-medium">{formatDate(booking.booking_date)}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Venue</div>
                                    <div className="font-medium">{booking.event.venue}, {booking.event.city}</div>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-border">
                              <div>
                                <div className="text-sm text-muted-foreground">Tickets</div>
                                <div className="font-medium">
                                  {booking.tickets} x ₹{booking.event ? booking.event.price : 0}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Total Amount</div>
                                <div className="text-lg font-bold">₹{booking.amount}</div>
                              </div>
                              <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                                <Button 
                                  variant="default"
                                  onClick={() => handleViewTickets(booking)}
                                  className="flex items-center gap-2"
                                >
                                  <Ticket className="h-4 w-4" />
                                  View Tickets
                                </Button>
                                {booking.event && (
                                  <Button 
                                    variant="outline"
                                    onClick={() => navigate(`/event/${booking.event.id}`)}
                                  >
                                    View Event
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8 text-center">
                      <h3 className="text-xl font-medium mb-2">No Bookings Yet</h3>
                      <p className="text-muted-foreground mb-6">You haven't booked any events yet. Explore our exciting events and book your first experience!</p>
                      <Button 
                        onClick={() => navigate("/")}
                      >
                        Explore Events
                      </Button>
                    </Card>
                  )}
                </div>
              </FadeIn>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Fixed ticket dialog rendering */}
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Tickets</DialogTitle>
            <DialogDescription>
              {selectedBooking?.event?.title} - {ticketsForBooking.length} tickets
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {ticketsForBooking.length > 0 ? (
              <div className="space-y-4">
                {ticketsForBooking.map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center">
                        {ticket.qr_code && (
                          <div className="mb-3">
                            <img 
                              src={ticket.qr_code} 
                              alt="Ticket QR Code" 
                              className="w-32 h-32"
                            />
                          </div>
                        )}
                        <div className="text-center">
                          <div className="font-bold mb-1">
                            Ticket #{ticket.ticket_number}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Please show this QR code at the venue
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                No tickets found for this booking.
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsTicketDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Profile;

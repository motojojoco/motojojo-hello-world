
import { useState } from "react";
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
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { events, categories } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Check, UserRound, MapPin, Phone, Mail } from "lucide-react";

const Profile = () => {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    city: "Mumbai",
    interests: [1, 3, 6] // IDs of categories the user is interested in
  });
  
  // Mock user bookings
  const [bookings] = useState([
    {
      id: 1,
      eventId: 1,
      event: events[0],
      bookingDate: "2025-01-10",
      status: "confirmed",
      ticketCount: 2,
      totalAmount: events[0].price * 2
    },
    {
      id: 2,
      eventId: 3,
      event: events[2],
      bookingDate: "2025-02-15",
      status: "confirmed",
      ticketCount: 1,
      totalAmount: events[2].price
    }
  ]);
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };
  
  const handleInterestToggle = (categoryId: number) => {
    setUserProfile(prev => {
      const interests = [...prev.interests];
      
      if (interests.includes(categoryId)) {
        return {
          ...prev,
          interests: interests.filter(id => id !== categoryId)
        };
      } else {
        return {
          ...prev,
          interests: [...interests, categoryId]
        };
      }
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-padding">
          <FadeIn>
            <h1 className="text-3xl md:text-4xl font-bold mb-8">My Profile</h1>
          </FadeIn>
          
          <Tabs defaultValue="profile" className="w-full">
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
                            <Label htmlFor="name">Full Name</Label>
                            <div className="flex">
                              <UserRound className="mr-2 h-4 w-4 text-muted-foreground mt-3" />
                              <Input 
                                id="name" 
                                value={userProfile.name} 
                                onChange={e => setUserProfile({...userProfile, name: e.target.value})}
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
                                value={userProfile.email} 
                                onChange={e => setUserProfile({...userProfile, email: e.target.value})}
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
                            <Label htmlFor="whatsapp">WhatsApp Number</Label>
                            <div className="flex">
                              <Phone className="mr-2 h-4 w-4 text-muted-foreground mt-3" />
                              <Input 
                                id="whatsapp" 
                                value={userProfile.whatsapp} 
                                onChange={e => setUserProfile({...userProfile, whatsapp: e.target.value})}
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
                              checked={userProfile.interests.includes(category.id)}
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
                          onClick={() => {
                            toast({
                              title: "Preferences Saved",
                              description: "Your interests have been updated successfully.",
                            });
                          }}
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
                  {bookings.length > 0 ? (
                    bookings.map(booking => (
                      <Card key={booking.id} className="overflow-hidden border-none shadow-soft">
                        <div className="md:flex">
                          <div className="md:w-1/4 h-48 md:h-auto">
                            <img 
                              src={booking.event.image} 
                              alt={booking.event.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-6 md:w-3/4">
                            <div className="flex flex-col md:flex-row justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold mb-1">{booking.event.title}</h3>
                                <p className="text-muted-foreground">{booking.event.subtitle}</p>
                              </div>
                              <div className="mt-2 md:mt-0 flex items-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500">
                                  <Check className="mr-1 h-3 w-3" />
                                  {booking.status}
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Event Date</div>
                                <div className="font-medium">{formatDate(booking.event.date)}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Booking Date</div>
                                <div className="font-medium">{formatDate(booking.bookingDate)}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Venue</div>
                                <div className="font-medium">{booking.event.venue}, {booking.event.city}</div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-border">
                              <div>
                                <div className="text-sm text-muted-foreground">Tickets</div>
                                <div className="font-medium">{booking.ticketCount} x ₹{booking.event.price}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Total Amount</div>
                                <div className="text-lg font-bold">₹{booking.totalAmount}</div>
                              </div>
                              <Button 
                                variant="outline" 
                                className="mt-4 md:mt-0"
                                onClick={() => {
                                  window.location.href = `/event/${booking.eventId}`;
                                }}
                              >
                                View Event
                              </Button>
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
                        onClick={() => {
                          window.location.href = "/";
                        }}
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
      
      <Footer />
    </div>
  );
};

export default Profile;

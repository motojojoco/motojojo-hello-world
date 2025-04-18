
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FadeIn } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EventForm from "@/components/admin/EventForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/services/eventService";
import { createEvent, updateEvent, deleteEvent, subscribeToEvents } from "@/services/adminEventService";
import { getEvents } from "@/services/eventService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch events using React Query
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToEvents((event) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event Updated",
        description: "The events list has been updated.",
      });
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, toast]);

  const handleCreateEvent = async (data: Omit<Event, "id" | "created_at" | "updated_at">) => {
    await createEvent(data);
    queryClient.invalidateQueries({ queryKey: ['events'] });
    toast({
      title: "Success",
      description: "Event created successfully",
    });
  };

  const handleUpdateEvent = async (data: Omit<Event, "id" | "created_at" | "updated_at">) => {
    if (!selectedEvent?.id) return;
    await updateEvent(selectedEvent.id, data);
    setIsEditDialogOpen(false);
    setSelectedEvent(null);
    queryClient.invalidateQueries({ queryKey: ['events'] });
    toast({
      title: "Success",
      description: "Event updated successfully",
    });
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteEvent(id);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get current items for pagination
  const getCurrentItems = (items: any[]) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Auth check
  useEffect(() => {
    // In a real app, you would check if the user is authenticated
    // For demo purposes, we'll just assume they are
    console.log("Admin authenticated");
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/admin");
  };
  
  // Mock bookings data
  const bookings = [
    { id: 1, eventId: 1, eventName: "Sunburn Festival 2025", userName: "Ravi Kumar", email: "ravi@example.com", tickets: 2, amount: 4998, date: "2025-01-10" },
    { id: 2, eventId: 3, eventName: "Prithvi Theatre Festival", userName: "Anjali Sharma", email: "anjali@example.com", tickets: 1, amount: 599, date: "2025-01-15" },
    { id: 3, eventId: 2, eventName: "Zakir Hussain Live", userName: "Mohan Singh", email: "mohan@example.com", tickets: 3, amount: 5997, date: "2025-01-18" },
    { id: 4, eventId: 5, eventName: "Comic Con India", userName: "Priya Patel", email: "priya@example.com", tickets: 4, amount: 3596, date: "2025-01-20" },
    { id: 5, eventId: 4, eventName: "Comedy Nights with Vir Das", userName: "Sanjay Mehta", email: "sanjay@example.com", tickets: 2, amount: 1998, date: "2025-01-22" },
    { id: 6, eventId: 1, eventName: "Sunburn Festival 2025", userName: "Kavita Gupta", email: "kavita@example.com", tickets: 1, amount: 2499, date: "2025-01-25" },
    { id: 7, eventId: 6, eventName: "Divine: Gully Fest", userName: "Vikram Reddy", email: "vikram@example.com", tickets: 3, amount: 4497, date: "2025-02-01" }
  ];
  
  // Calculate total pages
  const totalPages = (items: any[]) => Math.ceil(items.length / itemsPerPage);
  
  // Handle form submissions (mock implementations)
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Event Added",
      description: "The new event has been successfully added.",
    });
  };
  
  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Experience Added",
      description: "The new experience has been successfully added.",
    });
  };
  
  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Banner Added",
      description: "The new banner has been successfully added.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/5">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm shadow-sm py-4">
        <div className="container-padding flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gradient">Motojojo Admin</h1>
          </div>
          
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-grow py-8">
        <div className="container-padding">
          <FadeIn>
            <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>
          </FadeIn>

          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="events">Manage Events</TabsTrigger>
              <TabsTrigger value="experiences">Manage Experiences</TabsTrigger>
              <TabsTrigger value="banners">Manage Banners</TabsTrigger>
              <TabsTrigger value="bookings">View Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <div className="grid grid-cols-1 gap-8">
                <FadeIn delay={100}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>All Events</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>
                              <Plus className="mr-2 h-4 w-4" />
                              Add New Event
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Create New Event</DialogTitle>
                            </DialogHeader>
                            <EventForm onSubmit={handleCreateEvent} />
                          </DialogContent>
                        </Dialog>
                      </CardTitle>
                      <CardDescription>
                        Manage your events and their details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Seats</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getCurrentItems(events).map((event) => (
                              <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.title}</TableCell>
                                <TableCell>{event.category}</TableCell>
                                <TableCell>{formatDate(event.date)}</TableCell>
                                <TableCell>₹{event.price}</TableCell>
                                <TableCell>{event.seats_available}</TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedEvent(event);
                                      setIsEditDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDeleteEvent(event.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        {/* Pagination Controls */}
                        <div className="flex justify-end items-center space-x-2 p-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {Math.ceil(events.length / itemsPerPage)}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(prev => 
                              Math.min(prev + 1, Math.ceil(events.length / itemsPerPage))
                            )}
                            disabled={currentPage === Math.ceil(events.length / itemsPerPage)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
            </TabsContent>

            <TabsContent value="experiences">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <FadeIn delay={100}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span>All Experiences</span>
                          <Button size="sm">
                            <Plus className="mr-1 h-4 w-4" />
                            Add New
                          </Button>
                        </CardTitle>
                        <CardDescription>
                          Manage your curated experiences
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {/* @ts-expect-error */}
                              {experiences.map((experience) => (
                                <TableRow key={experience.id}>
                                  <TableCell className="font-medium">{experience.name}</TableCell>
                                  <TableCell>{experience.description}</TableCell>
                                  <TableCell className="text-right space-x-2">
                                    <Button size="icon" variant="ghost">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                </div>
                
                <div>
                  <FadeIn delay={200}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Add New Experience</CardTitle>
                        <CardDescription>
                          Create a new curated experience
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleAddExperience} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="exp-name">Experience Name</Label>
                            <Input id="exp-name" placeholder="Enter experience name" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="exp-description">Description</Label>
                            <Textarea id="exp-description" placeholder="Enter description" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="exp-image">Experience Image</Label>
                            <Input id="exp-image" type="file" />
                          </div>
                          
                          <Button type="submit" className="w-full">
                            Create Experience
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </FadeIn>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="banners">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <FadeIn delay={100}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span>All Banners</span>
                          <Button size="sm">
                            <Plus className="mr-1 h-4 w-4" />
                            Add New
                          </Button>
                        </CardTitle>
                        <CardDescription>
                          Manage your homepage banner sliders
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Link</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {/* @ts-expect-error */}
                              {banners.map((banner) => (
                                <TableRow key={banner.id}>
                                  <TableCell className="font-medium">{banner.title}</TableCell>
                                  <TableCell>
                                    <div className="w-16 h-10 rounded overflow-hidden">
                                      <img 
                                        src={banner.image} 
                                        alt={banner.title} 
                                        className="w-full h-full object-cover" 
                                      />
                                    </div>
                                  </TableCell>
                                  <TableCell>{banner.link}</TableCell>
                                  <TableCell className="text-right space-x-2">
                                    <Button size="icon" variant="ghost">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                </div>
                
                <div>
                  <FadeIn delay={200}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Add New Banner</CardTitle>
                        <CardDescription>
                          Create a new homepage banner slider
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleAddBanner} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="banner-title">Banner Title</Label>
                            <Input id="banner-title" placeholder="Enter banner title" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="banner-link">Link (URL)</Label>
                            <Input id="banner-link" placeholder="Enter link URL" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="banner-image">Banner Image</Label>
                            <Input id="banner-image" type="file" />
                          </div>
                          
                          <Button type="submit" className="w-full">
                            Create Banner
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </FadeIn>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              <FadeIn delay={100}>
                <Card>
                  <CardHeader>
                    <CardTitle>User Bookings</CardTitle>
                    <CardDescription>
                      View and manage all user bookings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Tickets</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getCurrentItems(bookings).map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">{booking.eventName}</TableCell>
                              <TableCell>{booking.userName}</TableCell>
                              <TableCell>{booking.email}</TableCell>
                              <TableCell>{booking.tickets}</TableCell>
                              <TableCell>₹{booking.amount}</TableCell>
                              <TableCell>{formatDate(booking.date)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* Pagination Controls */}
                    {totalPages(bookings) > 1 && (
                      <div className="flex justify-end items-center space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Page {currentPage} of {totalPages(bookings)}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages(bookings)))}
                          disabled={currentPage === totalPages(bookings)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <EventForm
              initialData={selectedEvent}
              onSubmit={handleUpdateEvent}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;

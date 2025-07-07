import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FadeIn } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EventForm from "@/components/admin/EventForm";
import CategoryForm from "@/components/admin/CategoryForm";
import EventTypeForm from "@/components/admin/EventTypeForm";
import BannerForm from "@/components/admin/BannerForm";
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
import { EventType, getAllEventTypes, createEventType, updateEventType, deleteEventType } from "@/services/eventTypeService";
import { Banner, getAllBanners, createBanner, updateBanner, deleteBanner } from "@/services/bannerService";
import { Testimonial, getAllTestimonials, getPendingTestimonials, approveTestimonial, rejectTestimonial, updateTestimonial, deleteTestimonial } from "@/services/testimonialService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Search, Filter, Users, Calendar, DollarSign, TrendingUp, CheckCircle, Clock, AlertCircle, RefreshCw, Download, MoreHorizontal, MessageSquare, Star, Check, X } from "lucide-react";
import { experiences } from "@/data/mockData";
import ArtistForm from "@/components/admin/ArtistForm";
import { processCompletedEvents, getUserBookings, Booking, getAllBookings, checkAttendanceFields } from "@/services/bookingService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEventTypeEditDialogOpen, setIsEventTypeEditDialogOpen] = useState(false);
  const [isBannerEditDialogOpen, setIsBannerEditDialogOpen] = useState(false);
  const [isTestimonialEditDialogOpen, setIsTestimonialEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProcessingEvents, setIsProcessingEvents] = useState(false);
  const [currentTab, setCurrentTab] = useState('events');
  const itemsPerPage = 5;

  // Fetch events using React Query with proper query function
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      return await getEvents();
    }
  });

  // Fetch all bookings using React Query
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: getAllBookings
  });

  // Fetch all event types using React Query
  const { data: eventTypes = [], isLoading: eventTypesLoading } = useQuery({
    queryKey: ['admin-event-types'],
    queryFn: getAllEventTypes
  });

  // Fetch all banners using React Query
  const { data: banners = [], isLoading: bannersLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: getAllBanners
  });

  // Fetch all testimonials using React Query
  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: getAllTestimonials
  });

  // Fetch pending testimonials using React Query
  const { data: pendingTestimonials = [], isLoading: pendingTestimonialsLoading } = useQuery({
    queryKey: ['admin-pending-testimonials'],
    queryFn: getPendingTestimonials
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

  // Subscribe to real-time booking updates
  useEffect(() => {
    const subscription = supabase
      .channel('admin-bookings')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' }, 
        (payload) => {
          console.log('Booking change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
          toast({
            title: "Booking Updated",
            description: "The bookings list has been updated.",
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
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

  // Event Type handlers
  const handleCreateEventType = async (data: any) => {
    await createEventType(data);
    queryClient.invalidateQueries({ queryKey: ['admin-event-types'] });
    queryClient.invalidateQueries({ queryKey: ['event-types'] });
    toast({
      title: "Success",
      description: "Event type created successfully",
    });
  };

  const handleUpdateEventType = async (data: any) => {
    if (!selectedEventType?.id) return;
    await updateEventType(selectedEventType.id, data);
    setIsEventTypeEditDialogOpen(false);
    setSelectedEventType(null);
    queryClient.invalidateQueries({ queryKey: ['admin-event-types'] });
    queryClient.invalidateQueries({ queryKey: ['event-types'] });
    toast({
      title: "Success",
      description: "Event type updated successfully",
    });
  };

  const handleDeleteEventType = async (id: string) => {
    if (confirm("Are you sure you want to delete this event type?")) {
      await deleteEventType(id);
      queryClient.invalidateQueries({ queryKey: ['admin-event-types'] });
      queryClient.invalidateQueries({ queryKey: ['event-types'] });
      toast({
        title: "Success",
        description: "Event type deleted successfully",
      });
    }
  };

  // Banner handlers
  const handleCreateBanner = async (data: any) => {
    await createBanner(data);
    queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    queryClient.invalidateQueries({ queryKey: ['banners'] });
    toast({
      title: "Success",
      description: "Banner created successfully",
    });
  };

  const handleUpdateBanner = async (data: any) => {
    if (!selectedBanner?.id) return;
    await updateBanner(selectedBanner.id, data);
    setIsBannerEditDialogOpen(false);
    setSelectedBanner(null);
    queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    queryClient.invalidateQueries({ queryKey: ['banners'] });
    toast({
      title: "Success",
      description: "Banner updated successfully",
    });
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      await deleteBanner(id);
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
    }
  };

  // Testimonial handlers
  const handleApproveTestimonial = async (id: string) => {
    try {
      await approveTestimonial(id);
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['admin-pending-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast({
        title: "Success",
        description: "Testimonial approved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve testimonial",
        variant: "destructive",
      });
    }
  };

  const handleRejectTestimonial = async (id: string) => {
    if (confirm("Are you sure you want to reject this testimonial?")) {
      try {
        await rejectTestimonial(id);
        queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
        queryClient.invalidateQueries({ queryKey: ['admin-pending-testimonials'] });
        queryClient.invalidateQueries({ queryKey: ['testimonials'] });
        toast({
          title: "Success",
          description: "Testimonial rejected successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to reject testimonial",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateTestimonial = async (data: any) => {
    if (!selectedTestimonial?.id) return;
    try {
      await updateTestimonial(selectedTestimonial.id, data);
      setIsTestimonialEditDialogOpen(false);
      setSelectedTestimonial(null);
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update testimonial",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteTestimonial(id);
        queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
        queryClient.invalidateQueries({ queryKey: ['testimonials'] });
        toast({
          title: "Success",
          description: "Testimonial deleted successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete testimonial",
          variant: "destructive",
        });
      }
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

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.event?.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
  
  // Calculate total pages
  const totalPages = (items: any[]) => Math.ceil(items.length / itemsPerPage);
  
  // Handle form submissions (mock implementations)
  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Experience Added",
      description: "The new experience has been successfully added.",
    });
  };
  
  const handleProcessCompletedEvents = async () => {
    if (isProcessingEvents) return; // Prevent multiple clicks
    
    setIsProcessingEvents(true);
    try {
      toast({
        title: "Processing Events",
        description: "Marking tickets as attended for completed events...",
      });

      console.log('Starting process completed events...');
      const result = await processCompletedEvents();
      console.log('Process completed events result:', result);
      
      if (result.success) {
        toast({
          title: "Events Processed Successfully",
          description: `Successfully marked ${result.totalTicketsUpdated} tickets as attended for completed events.`,
        });
        // Refetch data to update statistics
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      } else {
        toast({
          title: "Processing Failed",
          description: "Failed to process completed events. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error processing completed events:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing completed events. Please check the console for details.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingEvents(false);
    }
  };

  // Test function to check if there are any completed events
  const handleTestCompletedEvents = async () => {
    try {
      // Check if attendance fields exist
      const attendanceFieldsExist = await checkAttendanceFields();
      console.log('Attendance fields exist:', attendanceFieldsExist);
      
      const now = new Date();
      const completedEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate < now;
      });
      
      console.log('Current time:', now);
      console.log('Completed events found:', completedEvents);
      
      toast({
        title: "Test Results",
        description: `Found ${completedEvents.length} completed events. Attendance fields: ${attendanceFieldsExist ? 'OK' : 'Missing'}. Check console for details.`,
      });
    } catch (error) {
      console.error("Error testing completed events:", error);
    }
  };

  // Handle generating system report
  const handleGenerateSystemReport = async () => {
    try {
      toast({
        title: "Generating Report",
        description: "Creating comprehensive system report...",
      });

      // Calculate various statistics
      const totalEvents = events?.length || 0;
      const totalBookings = bookings.length;
      const totalRevenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
      
      // Calculate completed events
      const now = new Date();
      const completedEvents = events?.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate < now;
      }) || [];
      
      // Calculate upcoming events
      const upcomingEvents = events?.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate > now;
      }) || [];
      
      // Calculate booking statistics
      const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed').length;
      const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;
      
      // Calculate average booking value
      const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
      
      // Generate report content
      const report = {
        generatedAt: new Date().toLocaleString(),
        summary: {
          totalEvents,
          totalBookings,
          totalRevenue: totalRevenue.toLocaleString(),
          completedEvents: completedEvents.length,
          upcomingEvents: upcomingEvents.length,
          confirmedBookings,
          pendingBookings,
          averageBookingValue: averageBookingValue.toLocaleString()
        },
        topEvents: events?.slice(0, 5).map(event => ({
          title: event.title,
          date: event.date,
          price: event.price
        })) || [],
        recentBookings: bookings.slice(0, 5).map(booking => ({
          event: booking.event?.title || 'Unknown Event',
          customer: booking.name,
          amount: booking.amount,
          date: booking.booking_date
        }))
      };
      
      // Log the report to console (in a real app, this would be exported or sent to admin)
      console.log('=== SYSTEM REPORT ===');
      console.log('Generated at:', report.generatedAt);
      console.log('Summary:', report.summary);
      console.log('Top Events:', report.topEvents);
      console.log('Recent Bookings:', report.recentBookings);
      console.log('=====================');
      
      // Show success message with key metrics
      toast({
        title: "Report Generated",
        description: `Total: ${totalEvents} events, ${totalBookings} bookings, ₹${totalRevenue.toLocaleString()} revenue. Check console for full report.`,
      });
      
    } catch (error) {
      console.error("Error generating system report:", error);
      toast({
        title: "Report Generation Failed",
        description: "Failed to generate system report. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle downloading system report
  const handleDownloadSystemReport = async () => {
    try {
      toast({
        title: "Preparing Download",
        description: "Generating system report for download...",
      });

      // Calculate various statistics
      const totalEvents = events?.length || 0;
      const totalBookings = bookings.length;
      const totalRevenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
      
      // Calculate completed events
      const now = new Date();
      const completedEvents = events?.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate < now;
      }) || [];
      
      // Calculate upcoming events
      const upcomingEvents = events?.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate > now;
      }) || [];
      
      // Calculate booking statistics
      const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed').length;
      const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;
      
      // Calculate average booking value
      const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
      
      // Generate CSV content
      const csvContent = [];
      
      // 1. Summary Report
      csvContent.push('=== SYSTEM SUMMARY REPORT ===');
      csvContent.push('Generated At,' + new Date().toLocaleString());
      csvContent.push('Report Type,Motojojo Event Management System Report');
      csvContent.push('');
      csvContent.push('Metric,Value');
      csvContent.push('Total Events,' + totalEvents);
      csvContent.push('Total Bookings,' + totalBookings);
      csvContent.push('Total Revenue (₹),' + totalRevenue.toLocaleString());
      csvContent.push('Completed Events,' + completedEvents.length);
      csvContent.push('Upcoming Events,' + upcomingEvents.length);
      csvContent.push('Confirmed Bookings,' + confirmedBookings);
      csvContent.push('Pending Bookings,' + pendingBookings);
      csvContent.push('Average Booking Value (₹),' + averageBookingValue.toLocaleString());
      csvContent.push('');
      
      // 2. All Events Report
      csvContent.push('=== ALL EVENTS ===');
      csvContent.push('Event ID,Title,Category,Date,Time,Venue,City,Price (₹),Status');
      events?.forEach(event => {
        const status = new Date(event.date) < now ? 'Completed' : 'Upcoming';
        csvContent.push([
          event.id,
          `"${event.title}"`,
          event.category,
          event.date,
          event.time || 'TBD',
          `"${event.venue}"`,
          event.city,
          event.price,
          status
        ].join(','));
      });
      csvContent.push('');
      
      // 3. All Bookings Report
      csvContent.push('=== ALL BOOKINGS ===');
      csvContent.push('Booking ID,Event,Customer Name,Email,Phone,Tickets,Amount (₹),Status,Booking Date');
      bookings.forEach(booking => {
        csvContent.push([
          booking.id,
          `"${booking.event?.title || 'Unknown Event'}"`,
          `"${booking.name}"`,
          booking.email,
          booking.phone,
          booking.tickets,
          booking.amount,
          booking.status,
          booking.booking_date
        ].join(','));
      });
      csvContent.push('');
      
      // 4. Revenue Analysis
      csvContent.push('=== REVENUE ANALYSIS ===');
      csvContent.push('Month,Revenue (₹)');
      const monthlyRevenue = bookings.reduce((acc, booking) => {
        const month = new Date(booking.booking_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        acc[month] = (acc[month] || 0) + booking.amount;
        return acc;
      }, {} as Record<string, number>);
      
      Object.entries(monthlyRevenue).forEach(([month, revenue]) => {
        csvContent.push(`"${month}",${revenue.toLocaleString()}`);
      });
      csvContent.push('');
      
      // 5. Event Categories Analysis
      csvContent.push('=== EVENT CATEGORIES ===');
      csvContent.push('Category,Count');
      const eventCategories = events?.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
      
      Object.entries(eventCategories).forEach(([category, count]) => {
        csvContent.push(`"${category}",${count}`);
      });
      csvContent.push('');
      
      // 6. Top Customers
      csvContent.push('=== TOP CUSTOMERS ===');
      csvContent.push('Customer Name,Total Spent (₹),Number of Bookings');
      const customerSpending = bookings.reduce((acc, booking) => {
        acc[booking.name] = acc[booking.name] || { total: 0, bookings: 0 };
        acc[booking.name].total += booking.amount;
        acc[booking.name].bookings += 1;
        return acc;
      }, {} as Record<string, { total: number; bookings: number }>);
      
      Object.entries(customerSpending)
        .sort(([, a], [, b]) => b.total - a.total)
        .slice(0, 10)
        .forEach(([customer, data]) => {
          csvContent.push(`"${customer}",${data.total.toLocaleString()},${data.bookings}`);
        });
      csvContent.push('');
      
      // 7. Recent Activity
      csvContent.push('=== RECENT ACTIVITY (Last 10 Bookings) ===');
      csvContent.push('Event,Customer,Amount (₹),Date,Status');
      bookings.slice(0, 10).forEach(booking => {
        csvContent.push([
          `"${booking.event?.title || 'Unknown Event'}"`,
          `"${booking.name}"`,
          booking.amount,
          booking.booking_date,
          booking.status
        ].join(','));
      });
      
      // Create and download the CSV file
      const csvBlob = new Blob([csvContent.join('\n')], { 
        type: 'text/csv;charset=utf-8;' 
      });
      const url = URL.createObjectURL(csvBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `motojojo-system-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Report Downloaded",
        description: "System report has been downloaded as CSV file.",
      });
      
    } catch (error) {
      console.error("Error downloading system report:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download system report. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/5">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm shadow-sm py-4">
        <div className="container-padding flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gradient">Motojojo Admin</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Overview Stats */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{events?.length || 0} Events</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-green-500" />
                <span className="font-medium">{bookings.length} Bookings</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">₹{bookings.reduce((sum, booking) => sum + booking.amount, 0).toLocaleString()}</span>
              </div>
            </div>
            
            {/* Mobile Stats */}
            <TooltipProvider>
              <div className="lg:hidden flex items-center gap-3 text-sm">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{events?.length || 0}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total Events</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{bookings.length}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total Bookings</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <DollarSign className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">₹{(bookings.reduce((sum, booking) => sum + booking.amount, 0) / 1000).toFixed(0)}K</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total Revenue: ₹{bookings.reduce((sum, booking) => sum + booking.amount, 0).toLocaleString()}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            
            {/* Quick Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedEvent(null)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentTab('bookings')}
              >
                <Users className="h-4 w-4 mr-2" />
                View Bookings
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleProcessCompletedEvents}
                disabled={isProcessingEvents}
              >
                {isProcessingEvents ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadSystemReport}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            {/* Mobile Quick Actions */}
            <div className="md:hidden flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => setSelectedEvent(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Event
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => setCurrentTab('bookings')}>
                    <Users className="h-4 w-4 mr-2" />
                    View All Bookings
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => setCurrentTab('overview')}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Dashboard Overview
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Reports & Analytics</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleGenerateSystemReport}>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Generate Report
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={handleDownloadSystemReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV Report
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Event Management</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleProcessCompletedEvents} disabled={isProcessingEvents}>
                    {isProcessingEvents ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {isProcessingEvents ? 'Processing Events...' : 'Process Completed Events'}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={handleTestCompletedEvents}>
                    <Clock className="h-4 w-4 mr-2" />
                    Test Event Status
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow py-8 pb-20 md:pb-8">
        <div className="container-padding">
          <FadeIn>
            <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>
          </FadeIn>

          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid grid-cols-7 mb-8">
              <TabsTrigger value="events">Manage Events</TabsTrigger>
              <TabsTrigger value="event-types">Event Types</TabsTrigger>
              <TabsTrigger value="categories">Manage Categories</TabsTrigger>
              <TabsTrigger value="experiences">Manage Experiences</TabsTrigger>
              <TabsTrigger value="banners">Manage Banners</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="bookings">View Bookings</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
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
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedEvent(event);
                                      setIsEditDialogOpen(true);
                                    }}
                                  >
                                    Edit
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

            <TabsContent value="event-types">
              <div className="grid grid-cols-1 gap-8">
                <FadeIn delay={100}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>All Event Types</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>
                              <Plus className="mr-2 h-4 w-4" />
                              Add New Event Type
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Create New Event Type</DialogTitle>
                            </DialogHeader>
                            <EventTypeForm onSubmit={handleCreateEventType} />
                          </DialogContent>
                        </Dialog>
                      </CardTitle>
                      <CardDescription>
                        Manage your event types and their images
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Icon</TableHead>
                              <TableHead>Image</TableHead>
                              <TableHead>Sort Order</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {eventTypes.map((eventType) => (
                              <TableRow key={eventType.id}>
                                <TableCell className="font-medium">{eventType.name}</TableCell>
                                <TableCell className="text-2xl">{eventType.icon || "🎭"}</TableCell>
                                <TableCell>
                                  {eventType.image_url ? (
                                    <img
                                      src={eventType.image_url}
                                      alt={eventType.name}
                                      className="w-8 h-8 rounded object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <span className="text-muted-foreground text-sm">No image</span>
                                  )}
                                </TableCell>
                                <TableCell>{eventType.sort_order}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    eventType.is_active 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {eventType.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedEventType(eventType);
                                      setIsEventTypeEditDialogOpen(true);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  {eventType.deletable && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteEventType(eventType.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      Delete
                                    </Button>
                                  )}
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

              {/* Edit Event Type Dialog */}
              <Dialog open={isEventTypeEditDialogOpen} onOpenChange={setIsEventTypeEditDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Event Type</DialogTitle>
                  </DialogHeader>
                  {selectedEventType && (
                    <EventTypeForm 
                      initialData={selectedEventType} 
                      onSubmit={handleUpdateEventType} 
                      isEditing={true} 
                    />
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="categories">
              <FadeIn delay={100}>
                <CategoryForm />
              </FadeIn>
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
              {/* Featured Artists Upload Section */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <FadeIn delay={250}>
                    <ArtistForm />
                  </FadeIn>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="banners">
              <div className="grid grid-cols-1 gap-8">
                <FadeIn delay={100}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>All Banners</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>
                              <Plus className="mr-2 h-4 w-4" />
                              Add New Banner
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Create New Banner</DialogTitle>
                            </DialogHeader>
                            <BannerForm onSubmit={handleCreateBanner} />
                          </DialogContent>
                        </Dialog>
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
                              <TableHead>Subtitle</TableHead>
                              <TableHead>Image</TableHead>
                              <TableHead>Link</TableHead>
                              <TableHead>Sort Order</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {banners.map((banner) => (
                              <TableRow key={banner.id}>
                                <TableCell className="font-medium">{banner.title}</TableCell>
                                <TableCell className="max-w-[200px] truncate">
                                  {banner.subtitle || "No subtitle"}
                                </TableCell>
                                <TableCell>
                                  <div className="w-16 h-10 rounded overflow-hidden">
                                    <img 
                                      src={banner.image_url} 
                                      alt={banner.title} 
                                      className="w-full h-full object-cover" 
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="max-w-[150px] truncate">
                                  {banner.link_url || "No link"}
                                </TableCell>
                                <TableCell>{banner.sort_order}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    banner.is_active 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {banner.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedBanner(banner);
                                      setIsBannerEditDialogOpen(true);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteBanner(banner.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Delete
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

              {/* Edit Banner Dialog */}
              <Dialog open={isBannerEditDialogOpen} onOpenChange={setIsBannerEditDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Banner</DialogTitle>
                  </DialogHeader>
                  {selectedBanner && (
                    <BannerForm 
                      initialData={selectedBanner} 
                      onSubmit={handleUpdateBanner} 
                      isEditing={true} 
                    />
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="testimonials">
              <div className="grid grid-cols-1 gap-8">
                {/* Pending Testimonials Section - always on top */}
                <FadeIn delay={50}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Testimonials</CardTitle>
                      <CardDescription>
                        Review and approve or reject new testimonials submitted by users.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Rating</TableHead>
                              <TableHead>Content</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pendingTestimonials.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                  No pending testimonials.
                                </TableCell>
                              </TableRow>
                            ) : pendingTestimonials.map((testimonial) => (
                              <TableRow key={testimonial.id}>
                                <TableCell className="font-medium">{testimonial.name}</TableCell>
                                <TableCell className="capitalize">{testimonial.role}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 fill-yellow text-yellow" />
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="max-w-md truncate">{testimonial.content}</TableCell>
                                <TableCell>
                                  <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Pending</span>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleApproveTestimonial(testimonial.id)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Check className="h-4 w-4 mr-1" /> Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRejectTestimonial(testimonial.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4 mr-1" /> Reject
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

                {/* Approved/All Testimonials Section */}
                <FadeIn delay={100}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>All Testimonials</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>
                              <Plus className="mr-2 h-4 w-4" />
                              Add New Testimonial
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Create New Testimonial</DialogTitle>
                            </DialogHeader>
                            <div className="p-4">
                              <p className="text-muted-foreground">Use the feedback form on the main site to create testimonials.</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardTitle>
                      <CardDescription>
                        Manage your testimonials
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Testimonial</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {testimonials.map((testimonial) => (
                              <TableRow key={testimonial.id}>
                                <TableCell className="font-medium">{testimonial.name}</TableCell>
                                <TableCell className="max-w-md truncate">{testimonial.content}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    testimonial.is_approved 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {testimonial.is_approved ? 'Approved' : 'Pending'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedTestimonial(testimonial);
                                      setIsTestimonialEditDialogOpen(true);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Delete
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

              {/* Edit Testimonial Dialog */}
              <Dialog open={isTestimonialEditDialogOpen} onOpenChange={setIsTestimonialEditDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Testimonial</DialogTitle>
                  </DialogHeader>
                  {selectedTestimonial && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          defaultValue={selectedTestimonial.name}
                          onChange={(e) => setSelectedTestimonial({
                            ...selectedTestimonial,
                            name: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={selectedTestimonial.role}
                          onValueChange={(value) => setSelectedTestimonial({
                            ...selectedTestimonial,
                            role: value as 'audience' | 'artist' | 'organizer'
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="audience">Event Attendee</SelectItem>
                            <SelectItem value="artist">Artist/Performer</SelectItem>
                            <SelectItem value="organizer">Event Organizer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <Select
                          value={selectedTestimonial.rating.toString()}
                          onValueChange={(value) => setSelectedTestimonial({
                            ...selectedTestimonial,
                            rating: parseInt(value)
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <SelectItem key={rating} value={rating.toString()}>
                                {rating} Star{rating > 1 ? 's' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          defaultValue={selectedTestimonial.content}
                          onChange={(e) => setSelectedTestimonial({
                            ...selectedTestimonial,
                            content: e.target.value
                          })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_approved"
                          checked={selectedTestimonial.is_approved}
                          onChange={(e) => setSelectedTestimonial({
                            ...selectedTestimonial,
                            is_approved: e.target.checked
                          })}
                        />
                        <Label htmlFor="is_approved">Approved</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_featured"
                          checked={selectedTestimonial.is_featured}
                          onChange={(e) => setSelectedTestimonial({
                            ...selectedTestimonial,
                            is_featured: e.target.checked
                          })}
                        />
                        <Label htmlFor="is_featured">Featured</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsTestimonialEditDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleUpdateTestimonial({
                            name: selectedTestimonial.name,
                            role: selectedTestimonial.role,
                            content: selectedTestimonial.content,
                            rating: selectedTestimonial.rating,
                            is_approved: selectedTestimonial.is_approved,
                            is_featured: selectedTestimonial.is_featured
                          })}
                        >
                          Update Testimonial
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
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
                    {bookingsLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[250px]" />
                              <Skeleton className="h-4 w-[200px]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
                        <p className="text-muted-foreground">
                          There are no bookings in the system yet.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Search and Filter Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              placeholder="Search by name, email, or event..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                              <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Results count */}
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">
                            Showing {filteredBookings.length} of {bookings.length} bookings
                          </p>
                        </div>

                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Tickets</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Booking Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getCurrentItems(filteredBookings).map((booking) => (
                                <TableRow key={booking.id}>
                                  <TableCell className="font-medium">
                                    {booking.event?.title || 'Event not found'}
                                  </TableCell>
                                  <TableCell>{booking.name}</TableCell>
                                  <TableCell>{booking.email}</TableCell>
                                  <TableCell>{booking.phone}</TableCell>
                                  <TableCell>{booking.tickets}</TableCell>
                                  <TableCell>₹{booking.amount.toLocaleString()}</TableCell>
                                  <TableCell>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      booking.status === 'confirmed' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {booking.status}
                                    </span>
                                  </TableCell>
                                  <TableCell>{formatDate(booking.booking_date)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        
                        {/* Pagination Controls */}
                        {totalPages(filteredBookings) > 1 && (
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
                              Page {currentPage} of {totalPages(filteredBookings)}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages(filteredBookings)))}
                              disabled={currentPage === totalPages(filteredBookings)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>
            </TabsContent>

            <TabsContent value="overview">
              <FadeIn delay={100}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                          <p className="text-2xl font-bold">{events?.length || 0}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                          <p className="text-2xl font-bold">{bookings.length}</p>
                        </div>
                        <Users className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                          <p className="text-2xl font-bold">₹{bookings.reduce((sum, booking) => sum + booking.amount, 0).toLocaleString()}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Completed Events</p>
                          <p className="text-2xl font-bold">
                            {events?.filter(event => {
                              const eventDate = new Date(event.date);
                              const now = new Date();
                              return eventDate < now;
                            }).length || 0}
                          </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Event Management
                      </CardTitle>
                      <CardDescription>
                        Manage completed events and attendance tracking
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">Process Completed Events</h4>
                            <p className="text-sm text-muted-foreground">
                              Automatically mark tickets as attended for events that have ended
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={handleTestCompletedEvents}
                            >
                              Test
                            </Button>
                            <Button 
                              onClick={handleProcessCompletedEvents}
                              disabled={isProcessingEvents}
                            >
                              {isProcessingEvents ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Process Events
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                      <CardDescription>
                        Common administrative tasks
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button 
                          className="w-full justify-start" 
                          onClick={() => setSelectedEvent(null)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Event
                        </Button>
                        <Button 
                          className="w-full justify-start" 
                          variant="outline"
                          onClick={() => setCurrentTab('bookings')}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          View All Bookings
                        </Button>
                        <Button 
                          className="w-full justify-start" 
                          variant="outline"
                          onClick={handleGenerateSystemReport}
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          System Reports
                        </Button>
                        <Button 
                          className="w-full justify-start" 
                          variant="outline"
                          onClick={handleDownloadSystemReport}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
      <div className="mt-8 flex flex-col items-center">
        <Link to="/response">
          <Button className="bg-violet text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-violet-700 transition-colors">
            Responses
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

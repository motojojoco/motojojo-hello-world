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
  createHostInvitation, 
  getHostInvitations, 
  deleteHostInvitation,
  assignHostToEvent,
  removeHostFromEvent,
  getHostProfile
} from "@/services/hostService";
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
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/use-auth";
import { getAllEvents } from "@/services/eventService";

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
  const { inviteUser } = useAuth();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [hostInviteEmail, setHostInviteEmail] = useState("");
  const [hostInviteLoading, setHostInviteLoading] = useState(false);
  const [isHostInviteDialogOpen, setIsHostInviteDialogOpen] = useState(false);
  const [hostActivity, setHostActivity] = useState([]);

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

  // Fetch host invitations using React Query
  const { data: hostInvitations = [], isLoading: hostInvitationsLoading } = useQuery({
    queryKey: ['admin-host-invitations'],
    queryFn: getHostInvitations
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

  const handleInviteAdmin = async () => {
    setInviteLoading(true);
    try {
      const { error } = await inviteUser(inviteEmail, "admin");
      if (error) {
        toast({
          title: "Invite Failed",
          description: error.message || "Could not send invite.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Admin Invited",
          description: `Invitation sent to ${inviteEmail}`,
        });
        setIsInviteDialogOpen(false);
        setInviteEmail("");
      }
    } catch (err: any) {
      toast({
        title: "Invite Failed",
        description: err.message || "Could not send invite.",
        variant: "destructive",
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const handleInviteHost = async () => {
    if (!hostInviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address.",
        variant: "destructive"
      });
      return;
    }

    setHostInviteLoading(true);
    try {
      const result = await createHostInvitation(hostInviteEmail);
      if (result.success) {
        toast({
          title: "Success",
          description: "Host invitation sent successfully!",
        });
        setHostInviteEmail("");
        setIsHostInviteDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ['admin-host-invitations'] });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send invitation",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setHostInviteLoading(false);
    }
  };

  const handleDeleteHostInvitation = async (invitationId: string) => {
    if (confirm("Are you sure you want to delete this host invitation?")) {
      const success = await deleteHostInvitation(invitationId);
      if (success) {
        toast({
          title: "Success",
          description: "Host invitation deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['admin-host-invitations'] });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete host invitation",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    async function fetchHostActivity() {
      // Get all events with host info
      const events = await getAllEvents();
      // Get all hosts
      const { data: hosts } = await supabase.from('hosts').select('*');
      // Get all bookings
      const { data: bookings } = await supabase.from('bookings').select('*');
      // Get all tickets
      const { data: tickets } = await supabase.from('tickets').select('*');
      // Aggregate
      const activity = events.filter(e => e.host).map(event => {
        const host = hosts?.find(h => h.id === event.host);
        const eventBookings = bookings?.filter(b => b.event_id === event.id) || [];
        const eventTickets = tickets?.filter(t => eventBookings.map(b => b.id).includes(t.booking_id)) || [];
        const ticketsSold = eventTickets.length;
        const attendees = eventTickets.filter(t => t.attended).length;
        const revenue = eventBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
        return {
          hostName: host?.host_name || 'Unknown',
          eventTitle: event.title,
          eventDate: event.date,
          ticketsSold,
          attendees,
          revenue,
        };
      });
      setHostActivity(activity);
    }
    fetchHostActivity();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar and navigation remain unchanged */}
      <div className="pt-8"> {/* Add top padding to prevent overlap */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="max-w-7xl mx-auto px-4">
          <TabsList className="w-full mb-6 shadow-md bg-pink-500 rounded-lg flex flex-wrap justify-center gap-2 p-2 sticky top-0 z-20">
            <TabsTrigger value="events">Manage Events</TabsTrigger>
            <TabsTrigger value="event-types">Event Types</TabsTrigger>
            <TabsTrigger value="categories">Manage Categories</TabsTrigger>
            <TabsTrigger value="experiences">Manage Experiences</TabsTrigger>
            <TabsTrigger value="banners">Manage Banners</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="bookings">View Bookings</TabsTrigger>
            <TabsTrigger value="hosts">Host Management</TabsTrigger>
            <TabsTrigger value="host-activity">Host Activity</TabsTrigger>
          </TabsList>
          {/* ... rest of the content ... */}
        </Tabs>
      </div>
    </div>
  );
};

export default function AdminDashboardProtected() {
  return (
    <ProtectedRoute adminOnly>
      <AdminDashboard />
    </ProtectedRoute>
  );
}

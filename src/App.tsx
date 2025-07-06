import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Events from "./pages/Events";
import PreviousEvents from "./pages/PreviousEvents";
import EventDetail from "./pages/EventDetail";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ExplorePremium from "./pages/ExplorePremium";
import PricingPage from "./pages/PricingPage";
import TicketPreview from "./pages/TicketPreview";
import BookingTicketDemo from "./pages/BookingTicketDemo";
import Feedback from "./pages/Feedback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/previousevents" element={<PreviousEvents />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/explorepremium" element={<ExplorePremium />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/feedback" element={<Feedback />} />
          {/* Ticket preview route with booking ID */}
          <Route path="/ticket-preview/:bookingId" element={<TicketPreview />} />
          {/* QR code scan route with ticket ID */}
          <Route path="/ticket/:ticketId" element={<TicketPreview />} />
          {/* Demo ticket preview route */}
          <Route path="/ticket-preview" element={<TicketPreview />} />
          {/* Booking ticket demo route */}
          <Route path="/booking-ticket-demo" element={<BookingTicketDemo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

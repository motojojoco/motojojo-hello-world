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
import HostLogin from "./pages/HostLogin";
import HostDashboard from "./pages/HostDashboard";
import HostInvitation from "./pages/HostInvitation";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ExplorePremium from "./pages/ExplorePremium";
import PricingPage from "./pages/PricingPage";
import Membership from "./pages/Membership";
import MjMember from "./pages/MjMember";
import JoJoGang from "./pages/JoJoGang";
import TicketPreview from "./pages/TicketPreview";
import BookingTicketDemo from "./pages/BookingTicketDemo";
import Feedback from "./pages/Feedback";
import Response from "./pages/Response";
import SignInSignUp from "./pages/SignInSignUp";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { useSubscriptionStatus } from "./hooks/useSubscriptionStatus";
import LocalGathering from "./pages/LocalGathering";
import Addebazi from "./pages/Addebazi";
import KitchenGathering from "./pages/KitchenGathering";
import PardahGathering from "./pages/PardahGathering";
import GhumakariKalakar from "./pages/GhumakariKalakar";
import WhatsAppButton from "./components/shared/WhatsAppButton";
import AdminUsers from "./pages/AdminUsers";
import BookingPage from "./pages/BookingPage";
import ThankYou from "./pages/ThankYou";
import InviteOnly from "./pages/InviteOnly";
import JoinRequests from "./pages/admin/JoinRequests";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SubscriptionProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<Events />} />
              <Route path="/previousevents" element={<PreviousEvents />} />
              {/* SEO-friendly event URL pattern */}
              <Route
                path="/events/:city/:eventName/:eventId"
                element={<EventDetail />}
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              {/* Demo ticket preview route */}
              <Route path="/ticket-preview" element={<TicketPreview />} />
              {/* Booking ticket demo route */}
              <Route path="/booking-ticket-demo" element={<BookingTicketDemo />} />
              {/* AUTH ROUTE */}
              <Route path="/auth" element={<SignInSignUp />} />
              <Route path="/inviteonly" element={<InviteOnly tag="inviteonly" />} />
              <Route path="/book/:eventId" element={<BookingPage />} />
              <Route path="/thank-you" element={<ThankYou />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <WhatsAppButton />
          </BrowserRouter>
        </SubscriptionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

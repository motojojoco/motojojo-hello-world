
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventTicket from "@/components/tickets/EventTicket";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { getBookingTickets, Booking } from "@/services/bookingService";
import { supabase } from "@/integrations/supabase/client";

interface TicketPreviewProps {
  bookingId?: string;
  ticketId?: string;
}

export default function TicketPreview() {
  const { bookingId, ticketId } = useParams<TicketPreviewProps>();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingTickets, setGeneratingTickets] = useState(false);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);

  useEffect(() => {
    const fetchTicketData = async () => {
      console.log('Fetching ticket data with bookingId:', bookingId, 'ticketId:', ticketId);
      
      try {
        if (bookingId) {
          console.log('Fetching booking with ID:', bookingId);
          
          // Fetch booking details by booking ID
          const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .select(`
              *,
              event:event_id (*)
            `)
            .eq('id', bookingId)
            .single();

          if (bookingError) {
            console.error('Error fetching booking:', bookingError);
            return;
          }

          console.log('Booking data found:', bookingData);
          setBooking(bookingData);

          // Fetch tickets for this booking
          console.log('Fetching tickets for booking:', bookingId);
          const ticketData = await getBookingTickets(bookingId);
          console.log('Tickets found:', ticketData);
          setTickets(ticketData);
          
        } else if (ticketId) {
          console.log('Fetching ticket with number:', ticketId);
          
          // Fetch booking details by ticket number (for QR code scanning)
          const { data: ticketData, error: ticketError } = await supabase
            .from('tickets')
            .select(`
              *,
              booking:booking_id (
                *,
                event:event_id (*)
              )
            `)
            .eq('ticket_number', ticketId)
            .single();

          if (ticketError) {
            console.error('Error fetching ticket:', ticketError);
            return;
          }

          console.log('Ticket data found:', ticketData);
          if (ticketData && ticketData.booking) {
            setBooking(ticketData.booking);
            setTickets([ticketData]);
          }
        } else {
          console.log('No bookingId or ticketId provided');
          // Generate real tickets in real-time
          await generateRealTimeTickets();
        }
      } catch (error) {
        console.error('Error fetching ticket data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [bookingId, ticketId]);

  const handleDownloadTicket = () => {
    // Create a canvas to capture the ticket
    const ticketElement = document.querySelector('.ticket-container');
    if (ticketElement) {
      // Implementation for downloading ticket as image
      // This would require html2canvas or similar library
      console.log('Download functionality would be implemented here');
    }
  };

  const handleShareTicket = () => {
    if (navigator.share) {
      navigator.share({
        title: `My ticket for ${booking?.event?.title || 'Event'}`,
        text: `I'm going to ${booking?.event?.title || 'Event'} on ${booking?.event?.date || 'Event Date'}!`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Generate real-time tickets
  const generateRealTimeTickets = async () => {
    setGeneratingTickets(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user found, redirecting to login');
        navigate('/');
        return;
      }

      // Get user profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      // Get a sample event (you can modify this to get a specific event)
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(1);

      if (!events || events.length === 0) {
        console.log('No events found');
        return;
      }

      const event = events[0];
      const ticketCount = 2; // Generate 2 tickets
      const totalAmount = event.price * ticketCount;

      // Create a temporary booking object
      const tempBooking = {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        event_id: event.id,
        name: userProfile?.full_name || user.email || 'Guest',
        email: userProfile?.email || user.email || '',
        phone: userProfile?.phone || '',
        tickets: ticketCount,
        amount: totalAmount,
        status: 'temporary',
        booking_date: new Date().toISOString(),
        event: event,
        // Add mock ticket_names for demo (replace with real names if available)
        ticket_names: [userProfile?.full_name || user.email || 'Guest', ...(Array(ticketCount - 1).fill('Guest'))]
      };

      // Generate real tickets
      const attendeeNames = tempBooking.ticket_names || [];
      const generatedTickets = [];
      for (let i = 0; i < ticketCount; i++) {
        const ticketNumber = `MJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketNumber}`;
        
        const ticket = {
          id: `temp-ticket-${i}`,
          ticket_number: ticketNumber,
          qr_code: qrCode,
          username: attendeeNames[i] || `${tempBooking.name} ${i + 1}`,
          created_at: new Date().toISOString()
        };
        
        generatedTickets.push(ticket);
      }

      setBooking(tempBooking);
      setTickets(generatedTickets);
      
      console.log('Generated real-time tickets:', generatedTickets);
    } catch (error) {
      console.error('Error generating real-time tickets:', error);
    } finally {
      setGeneratingTickets(false);
    }
  };

  // Add this helper to render booking details
  const renderBookingDetails = (booking) => (
    <div className="mb-6 bg-white/10 rounded-lg p-4 text-white">
      <h3 className="font-semibold mb-2">Booking Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div><span className="text-white/70">Full Name:</span> {booking.name}</div>
        <div><span className="text-white/70">Email:</span> {booking.email}</div>
        <div><span className="text-white/70">Phone:</span> {booking.phone}</div>
        <div><span className="text-white/70">Number of Tickets:</span> {booking.tickets}</div>
        <div><span className="text-white/70">Total Amount:</span> ₹{booking.amount}</div>
        {Array.isArray(booking.ticket_names) && booking.ticket_names.length > 0 && (
          <div className="col-span-2"><span className="text-white/70">Ticket Holder Names:</span> {booking.ticket_names.join(', ')}</div>
        )}
      </div>
    </div>
  );

  if (loading || generatingTickets) {
    return (
      <div className="bg-raspberry min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-lg">
            {generatingTickets ? 'Generating your tickets...' : 'Loading your tickets...'}
          </div>
          {generatingTickets && (
            <div className="text-white/70 text-sm mt-2">
              Creating real-time tickets with your information
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-raspberry min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="text-lg mb-4">No tickets found</div>
          <div className="text-sm mb-6 text-white/70">
            {bookingId ? `Booking ID: ${bookingId}` : ticketId ? `Ticket ID: ${ticketId}` : 'No ID provided'}
          </div>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/profile')}
              className="bg-sandstorm text-black hover:bg-sandstorm/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-sandstorm text-sandstorm hover:bg-sandstorm/10"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If there are no tickets but booking exists, show a single ticket UI with booking info
  if (tickets.length === 0) {
    // Try to get ticket holder names from booking (if available)
    const ticketHolderNames = booking.ticket_names || booking.ticketHolderNames || booking.ticketNames || [];
    return (
      <div className="bg-raspberry min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Your Ticket</h1>
            <p className="text-white/80">Show this ticket at the event entry</p>
            <div className="mt-2 text-sm text-white/60">(No ticket record found, showing booking info)</div>
          </div>
          <div className="relative ticket-container">
            <EventTicket
              ticketId={booking.id || 'N/A'}
              imageUrl={booking.event?.image || '/placeholder.svg'}
              eventName={booking.event?.title || 'Event'}
              eventDescription={booking.event?.subtitle || ''}
              date={booking.event?.date || ''}
              time={booking.event?.time || ''}
              venue={`${booking.event?.venue || ''}, ${booking.event?.city || ''}`}
              price={booking.amount ? booking.amount / (booking.tickets || 1) : 0}
              username={booking.name || 'Guest'}
              qrCode={undefined}
            />
            {/* Show ticket holder names if more than one ticket */}
            {Array.isArray(ticketHolderNames) && ticketHolderNames.length > 1 && (
              <div className="mt-4 bg-white/80 rounded-xl p-4">
                <div className="font-semibold text-black mb-2">Ticket Holders:</div>
                <ul className="list-decimal list-inside text-black text-sm">
                  {ticketHolderNames.map((name, idx) => (
                    <li key={idx}>Ticket {idx + 1}: {name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              onClick={() => navigate('/profile')}
              className="bg-sandstorm text-black hover:bg-sandstorm/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-sandstorm text-sandstorm hover:bg-sandstorm/10"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If there are multiple tickets, show one at a time with navigation
  if (tickets.length > 1) {
    const ticket = tickets[currentTicketIndex];
    return (
      <div className="bg-raspberry min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Your Ticket</h1>
            <p className="text-white/80">Show this ticket at the event entry</p>
            <div className="mt-2 text-sm text-white/60">Ticket {currentTicketIndex + 1} of {tickets.length}</div>
          </div>
          <div className="relative ticket-container">
            <EventTicket
              ticketId={ticket.ticket_number}
              imageUrl={booking.event?.image || '/placeholder.svg'}
              eventName={booking.event?.title || 'Event'}
              eventDescription={booking.event?.subtitle || ''}
              date={booking.event?.date || ''}
              time={booking.event?.time || ''}
              venue={`${booking.event?.venue || ''}, ${booking.event?.city || ''}`}
              price={booking.amount ? booking.amount / booking.tickets : 0}
              username={ticket.username || booking.name || 'Guest'}
              qrCode={ticket.qr_code}
            />
          </div>
          <div className="flex flex-row gap-4 justify-center mt-8">
            <Button 
              onClick={() => setCurrentTicketIndex(i => Math.max(0, i - 1))}
              disabled={currentTicketIndex === 0}
              className="bg-sandstorm text-black hover:bg-sandstorm/90"
            >
              Previous
            </Button>
            <Button 
              onClick={() => setCurrentTicketIndex(i => Math.min(tickets.length - 1, i + 1))}
              disabled={currentTicketIndex === tickets.length - 1}
              className="bg-sandstorm text-black hover:bg-sandstorm/90"
            >
              Next
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              onClick={() => navigate('/profile')}
              className="bg-sandstorm text-black hover:bg-sandstorm/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-sandstorm text-sandstorm hover:bg-sandstorm/10"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-raspberry min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Your Tickets</h1>
          <p className="text-white/80">Show these tickets at the event entry</p>
          {booking?.status === 'temporary' && (
            <div className="mt-2 text-sm text-white/60">
              Real-time generated tickets
            </div>
          )}
        </div>
        {/* Booking Details */}
        {booking && renderBookingDetails(booking)}

        {/* Tickets Grid */}
        <div className={`grid gap-6 ${
          tickets.length === 1 
            ? 'grid-cols-1 max-w-xl mx-auto' 
            : tickets.length === 2 
              ? 'grid-cols-1 md:grid-cols-2' 
              : tickets.length === 3 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {tickets.map((ticket, index) => (
            <div key={ticket.id} className="relative ticket-container">
              <div className="absolute -top-2 -left-2 bg-sandstorm text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center z-30">
                {index + 1}
              </div>
              <EventTicket
                ticketId={ticket.ticket_number}
                imageUrl={booking.event?.image || '/placeholder.svg'}
                eventName={booking.event?.title || 'Event'}
                eventDescription={booking.event?.subtitle || ''}
                date={booking.event?.date || ''}
                time={booking.event?.time || ''}
                venue={`${booking.event?.venue || ''}, ${booking.event?.city || ''}`}
                price={booking.amount ? booking.amount / booking.tickets : 0}
                username={ticket.username || booking.name || 'Guest'}
                qrCode={ticket.qr_code}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button 
            onClick={handleDownloadTicket}
            className="bg-sandstorm text-black hover:bg-sandstorm/90"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Ticket
          </Button>
          <Button 
            onClick={handleShareTicket}
            variant="outline"
            className="border-sandstorm text-sandstorm hover:bg-sandstorm/10"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Ticket
          </Button>
          <Button 
            onClick={() => navigate('/profile')}
            variant="outline"
            className="border-sandstorm text-sandstorm hover:bg-sandstorm/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </div>

        {/* Event Details */}
        {booking.event && (
          <div className="mt-8 bg-white/10 rounded-lg p-4 text-white">
            <h3 className="font-semibold mb-2">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/70">Event:</span> {booking.event.title}
              </div>
              <div>
                <span className="text-white/70">Date:</span> {new Date(booking.event.date).toLocaleDateString()}
              </div>
              <div>
                <span className="text-white/70">Time:</span> {booking.event.time}
              </div>
              <div>
                <span className="text-white/70">Venue:</span> {booking.event.venue}, {booking.event.city}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

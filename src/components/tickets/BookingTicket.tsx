import { Calendar, MapPin, Ticket, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingTicketProps {
  eventName: string;
  eventDescription: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventCity: string;
  eventPrice: number;
  bookerName: string;
  bookerEmail: string;
  bookerPhone: string;
  numberOfTickets: number;
  totalAmount: number;
  onBookNow?: () => void;
  isBooking?: boolean;
  ticketHolderNames?: string[];
}

export default function BookingTicket({
  eventName,
  eventDescription,
  eventDate,
  eventTime,
  eventVenue,
  eventCity,
  eventPrice,
  bookerName,
  bookerEmail,
  bookerPhone,
  numberOfTickets,
  totalAmount,
  onBookNow,
  isBooking = false,
  ticketHolderNames = []
}: BookingTicketProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-IN');
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-sandstorm rounded-3xl shadow-glow-yellow p-0 overflow-visible border-4 border-solid border-sandstorm">
      {/* Corner semi-circles (ticket cut-outs) */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-raspberry rounded-full z-10" />
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-raspberry rounded-full z-10" />
      
      <div className="flex flex-col">
        {/* Header with Event Info */}
        <div className="px-6 py-4 bg-gradient-to-r from-raspberry to-purple-600 rounded-t-2xl">
          <div className="text-white text-center">
            <h2 className="font-bold text-xl mb-1">{eventName}</h2>
            <p className="text-white/90 text-sm line-clamp-2">{eventDescription}</p>
          </div>
        </div>

        {/* Event Details */}
        <div className="px-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center text-black font-semibold gap-2">
              <Calendar size={16} className="text-raspberry" />
              <span>{formatDate(eventDate)} | {eventTime}</span>
            </div>
            <div className="flex items-center text-black font-semibold gap-2">
              <MapPin size={16} className="text-raspberry" />
              <span className="line-clamp-1">{eventVenue}, {eventCity}</span>
            </div>
          </div>
        </div>

        {/* Booker Information */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <User size={16} className="text-raspberry" />
            <span className="font-semibold text-black">Booking Information</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium text-black">{bookerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-black truncate">{bookerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium text-black">{bookerPhone}</span>
            </div>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="px-6 py-3 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Ticket size={16} className="text-raspberry" />
            <span className="font-semibold text-black">Ticket Details</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tickets:</span>
              <span className="font-medium text-black">{numberOfTickets} x ₹{formatPrice(eventPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-black">₹{formatPrice(eventPrice * numberOfTickets)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Booking Fee:</span>
              <span className="font-medium text-black">₹0</span>
            </div>
            {/* Show ticket holder names if more than 1 ticket */}
            {ticketHolderNames.length > 1 && (
              <div className="pt-2">
                <span className="text-gray-600 block mb-1">Ticket Holders:</span>
                <ul className="list-disc pl-5 text-black">
                  {ticketHolderNames.map((name, idx) => (
                    <li key={idx} className="text-sm">Ticket {idx + 1}: {name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Bottom dashed divider */}
        <div className="flex items-center px-6 py-3 relative">
          <div className="absolute left-0 right-0 top-0 h-0.5 border-t-4 border-dashed border-black w-full" />
        </div>

        {/* Total Amount and Action */}
        <div className="px-6 pb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="font-extrabold text-2xl text-black">₹{formatPrice(totalAmount)}</div>
            <CreditCard size={24} className="text-raspberry" />
          </div>
          
          {onBookNow && (
            <Button 
              onClick={onBookNow}
              disabled={isBooking}
              className="w-full bg-raspberry hover:bg-raspberry/90 text-white font-semibold py-3"
            >
              {isBooking ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  Book Now
                </div>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      {isBooking && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full px-3 py-1 flex items-center gap-1 z-30">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
          Booking
        </div>
      )}
    </div>
  );
} 
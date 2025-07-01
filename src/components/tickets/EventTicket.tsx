import { Calendar, MapPin, Ticket } from "lucide-react";

interface EventTicketProps {
  ticketId: string;
  imageUrl: string;
  eventName: string;
  eventDescription: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  username: string;
}

export default function EventTicket({
  ticketId,
  imageUrl,
  eventName,
  eventDescription,
  date,
  time,
  venue,
  price,
  username,
}: EventTicketProps) {
  return (
    <div className="relative w-full bg-sandstorm rounded-3xl shadow-glow-yellow p-0 overflow-visible border-4 border-solid border-sandstorm">
      {/* Corner semi-circles (ticket cut-outs) */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-raspberry rounded-full z-10" />
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-raspberry rounded-full z-10" />
      <div className="flex flex-col">
        {/* Image */}
        <div className="rounded-t-2xl overflow-hidden">
          <img src={imageUrl} alt={eventName} className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover grayscale" />
        </div>
        {/* Content */}
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="font-bold text-lg sm:text-xl lg:text-2xl text-black mb-1 line-clamp-2">{eventName}</div>
          <div className="text-black text-sm sm:text-base mb-2 sm:mb-3 line-clamp-2">{eventDescription}</div>
          <div className="flex items-center text-black font-semibold mb-1 gap-2 text-sm sm:text-base">
            <Calendar size={16} className="sm:w-5 sm:h-5" /> {date} | {time}
          </div>
          <div className="flex items-center text-black font-semibold mb-2 sm:mb-3 gap-2 text-sm sm:text-base">
            <MapPin size={16} className="sm:w-5 sm:h-5" /> <span className="line-clamp-1">{venue}</span>
          </div>
          <div className="text-xs text-gray-700 mb-1 sm:mb-2 font-mono">Ticket ID: <span className="font-bold">{ticketId}</span></div>
          <div className="text-xs text-gray-700 mb-1 sm:mb-2 font-mono">Name: <span className="font-bold">{username}</span></div>
        </div>
        {/* Bottom dashed divider & price */}
        <div className="flex items-center px-4 sm:px-6 pb-3 sm:pb-4 relative">
          <div className="absolute left-0 right-0 top-0 h-0.5 border-t-4 border-dashed border-black w-full" />
        </div>
        <div className="flex justify-between items-center px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="font-extrabold text-lg sm:text-xl lg:text-2xl text-black">₹{price} /-</div>
          <Ticket size={24} className="sm:w-8 sm:h-8 lg:w-8 lg:h-8 text-violet" />
        </div>
      </div>
    </div>
  );
}

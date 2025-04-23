
import { Calendar, MapPin, Ticket } from "lucide-react";

interface EventTicketProps {
  ticketId: string;
  username: string;
  imageUrl: string;
  eventName: string;
  eventDescription: string;
  date: string;
  time: string;
  venue: string;
  price: number;
}

export default function EventTicket({
  ticketId,
  username,
  imageUrl,
  eventName,
  eventDescription,
  date,
  time,
  venue,
  price,
}: EventTicketProps) {
  return (
    <div className="relative w-full max-w-xl mx-auto bg-sandstorm rounded-3xl shadow-glow-yellow p-0 overflow-visible my-8 border-4 border-solid border-sandstorm">
      {/* Corner semi-circles (ticket cut-outs) */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-raspberry rounded-full z-10" />
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-raspberry rounded-full z-10" />
      <div className="flex flex-col">
        {/* Image */}
        <div className="rounded-t-2xl overflow-hidden">
          <img src={imageUrl} alt={eventName} className="w-full h-72 object-cover grayscale" />
        </div>
        {/* Content */}
        <div className="px-6 py-4">
          <div className="font-bold text-2xl text-black mb-1">{eventName}</div>
          <div className="text-black text-base mb-3">{eventDescription}</div>
          <div className="text-black font-medium mb-3">Ticket Holder: {username}</div>
          <div className="flex items-center text-black font-semibold mb-1 gap-2">
            <Calendar size={20} /> {date} | {time}
          </div>
          <div className="flex items-center text-black font-semibold mb-3 gap-2">
            <MapPin size={20} /> {venue}
          </div>
          <div className="text-xs text-gray-700 mb-2 font-mono">Ticket ID: <span className="font-bold">{ticketId}</span></div>
        </div>
        {/* Bottom dashed divider & price */}
        <div className="flex items-center px-6 pb-4 relative">
          <div className="absolute left-0 right-0 top-0 h-0.5 border-t-4 border-dashed border-black w-full" />
        </div>
        <div className="flex justify-between items-center px-6 pb-6">
          <div className="font-extrabold text-2xl text-black">₹{price} /-</div>
          <Ticket size={32} className="text-violet" />
        </div>
      </div>
    </div>
  );
}


import EventTicket from "@/components/tickets/EventTicket";

// Sample screen to preview the ticket after QR scan/use
export default function TicketPreview() {
  const demoTicket = {
    ticketId: "TK12345KAF",
    imageUrl: "/lovable-uploads/71249b89-f4ee-4afe-a83e-c856d254686e.png",
    eventName: "Group Gathering",
    eventDescription:
      "Lorem ipsum dolor sit amet consectetur. Et lectus volutpat turpis facilisi nisl viverra.",
    date: "April 1",
    time: "6 AM",
    venue: "6924 W Oak Street, Ritchieworth 56312",
    price: 150,
    username: "Guest User",
  };

  return (
    <div className="bg-raspberry min-h-screen flex flex-col items-center justify-center p-4">
      <EventTicket {...demoTicket} />
      <div className="text-white mt-4">Show this ticket at the entry</div>
    </div>
  );
}

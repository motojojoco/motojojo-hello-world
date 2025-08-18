import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to check if an event is over
export function isEventOver(eventDate: string, eventTime?: string): boolean {
  if (!eventDate) return false;
  
  const now = new Date();
  const eventDateTime = new Date(eventDate);
  
  // If time is provided, include it in the comparison
  if (eventTime) {
    const [hours, minutes] = eventTime.split(':').map(Number);
    eventDateTime.setHours(hours, minutes, 0, 0);
  } else {
    // If no time provided, assume end of day (23:59:59)
    eventDateTime.setHours(23, 59, 59, 999);
  }
  
  return now > eventDateTime;
}

// Utility function to get event status
export function getEventStatus(eventDate: string, eventTime?: string): 'upcoming' | 'ongoing' | 'completed' {
  if (!eventDate) return 'upcoming';
  
  const now = new Date();
  const eventDateTime = new Date(eventDate);
  
  // If time is provided, include it in the comparison
  if (eventTime) {
    const [hours, minutes] = eventTime.split(':').map(Number);
    eventDateTime.setHours(hours, minutes, 0, 0);
  } else {
    // If no time provided, assume end of day (23:59:59)
    eventDateTime.setHours(23, 59, 59, 999);
  }
  
  // Add 4 hours to consider event "ongoing" for a reasonable duration
  const eventEndTime = new Date(eventDateTime.getTime() + (4 * 60 * 60 * 1000));
  
  if (now < eventDateTime) {
    return 'upcoming';
  } else if (now >= eventDateTime && now <= eventEndTime) {
    return 'ongoing';
  } else {
    return 'completed';
  }
}

// Utility function to format event status for display
export function formatEventStatus(status: 'upcoming' | 'ongoing' | 'completed'): {
  text: string;
  color: string;
  bgColor: string;
} {
  switch (status) {
    case 'upcoming':
      return {
        text: 'Upcoming',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      };
    case 'ongoing':
      return {
        text: 'Live Now',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    case 'completed':
      return {
        text: 'Event Over',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100'
      };
    default:
      return {
        text: 'Unknown',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100'
      };
  }
}

import { generateSlug } from './urlUtils';
import type { Event } from '@/services/eventService';

/**
 * Generates a clean, SEO-friendly URL for an event
 * @param event The event object
 * @returns The complete URL path for the event
 */
export const getEventUrl = (event: { id: string; title: string; city: string }): string => {
  return `/events/${generateSlug(event.city)}/${generateSlug(event.title)}/${event.id}`;
};

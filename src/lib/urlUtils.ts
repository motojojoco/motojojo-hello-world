/**
 * Generates a URL-friendly slug from a string
 * @param text Input string to convert to slug
 * @returns URL-friendly slug string
 */
export const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

/**
 * Extracts the event ID from a URL slug
 * @param slug The URL slug (last part of the URL)
 * @returns The event ID if found, null otherwise
 */
export const extractEventIdFromSlug = (slug: string): string | null => {
  // The ID is the last part after the last dash
  const parts = slug.split('-');
  const idPart = parts[parts.length - 1];
  
  // Check if the last part looks like an ID (alphanumeric and at least 3 characters)
  if (/^[a-zA-Z0-9]{3,}$/.test(idPart)) {
    return idPart;
  }
  return null;
};

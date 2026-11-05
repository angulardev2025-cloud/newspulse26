/**
 * Calculates estimated reading time for article content.
 * Standard average reading speed: ~180-200 words per minute.
 */
export function calculateReadingTime(
  content: string | null | undefined,
  excerpt?: string | null | undefined,
  title?: string | null | undefined
): { words: number; minutes: number; text: string } {
  const combined = [content || '', excerpt || '', title || ''].join(' ');

  if (!combined.trim()) {
    return { words: 0, minutes: 1, text: '1 min read' };
  }

  // Strip HTML tags and entities
  const cleanText = combined
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  
  // Average reading speed is ~180-200 words per minute
  // Round to nearest minute, minimum 1 min
  const minutes = Math.max(1, Math.round(words / 180) || 1);

  return {
    words,
    minutes,
    text: `${minutes} min read`,
  };
}

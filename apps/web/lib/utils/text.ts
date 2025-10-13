// Utility function to truncate text at word boundaries
export function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  // If we can't find a space, just truncate at the max length
  if (lastSpaceIndex === -1) return truncated + '...';

  let result = truncated.slice(0, lastSpaceIndex);

  // Remove trailing punctuation marks
  result = result.replace(/[.,;:!?]+$/, '');

  return result + '...';
}
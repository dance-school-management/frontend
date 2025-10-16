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

export function calculateNameSimilarity(name: string, searchQuery: string): number {
  if (!searchQuery.trim()) return 0;

  const searchWords = searchQuery.toLowerCase().trim().split(/\s+/);
  const nameWords = name.toLowerCase().split(/[\s\-–—,&]+/).filter(w => w.length > 0);

  let totalScore = 0;
  for (const searchWord of searchWords) {
    let bestMatch = 0;
    for (const nameWord of nameWords) {
      if (nameWord === searchWord) {
        bestMatch = 1.0; // Exact match
        break;
      } else if (nameWord.includes(searchWord) || searchWord.includes(nameWord)) {
        bestMatch = Math.max(bestMatch, 0.5); // Partial match
      }
    }
    totalScore += bestMatch;
  }

  return totalScore;
}
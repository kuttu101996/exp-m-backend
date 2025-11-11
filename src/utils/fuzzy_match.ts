/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching category names
 */
export const levenshtein_distance = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  const len1 = s1.length;
  const len2 = s2.length;

  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
};

/**
 * Calculate similarity percentage between two strings
 */
export const calculate_similarity = (str1: string, str2: string): number => {
  const distance = levenshtein_distance(str1, str2);
  const max_length = Math.max(str1.length, str2.length);

  if (max_length === 0) return 100;

  return ((max_length - distance) / max_length) * 100;
};

/**
 * Find similar strings from a list based on similarity threshold
 */
export const find_similar_strings = (
  target: string,
  strings: string[],
  threshold: number = 70
): Array<{ text: string; similarity: number }> => {
  const similar_matches = strings
    .map((str) => ({
      text: str,
      similarity: calculate_similarity(target, str),
    }))
    .filter((match) => match.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);

  return similar_matches;
};

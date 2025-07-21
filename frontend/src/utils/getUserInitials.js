// src/utils/getUserInitials.js
export const getUserInitials = (name = "") => {
  // Handle non-string inputs
  if (typeof name !== "string") return "";
  
  // Trim and split while preserving special characters
  const words = name
    .normalize("NFC")  // Combine diacritics with their base characters
    .trim()
    .split(/[\s\p{Z}]+/u)  // Split on any Unicode whitespace or separator
    .filter(word => word.length > 0);

  // Handle empty names after cleaning
  if (words.length === 0) return "";

  // Special handling for East Asian names (single character per word)
  const isEastAsian = words.some(word => 
    /[\p{Script=Han}\p{Script=Katakana}\p{Script=Hiragana}\p{Script=Hangul}]/u.test(word)
  );

  // Handle single-word names
  if (words.length === 1) {
    return processSingleWord(words[0], isEastAsian);
  }

  // Multi-word name processing
  return processMultiWord(words, isEastAsian);
};

// Helper functions
const processSingleWord = (word, isEastAsian) => {
  if (isEastAsian && word.length > 1) {
    // Take last character for East Asian names
    return getSafeChar(word, word.length - 1).toUpperCase();
  }
  return getSafeChar(word, 0).toUpperCase();
};

const processMultiWord = (words, isEastAsian) => {
  // Filter out honorifics and prefixes
  const cleanWords = words.filter(word => 
    !/^(?:dr|mr|mrs|ms|miss|prof|rev)\.?$/i.test(word)
  );

  const validWords = cleanWords.length > 0 ? cleanWords : words;
  
  // Special handling for East Asian names (use first character of each word)
  if (isEastAsian) {
    return validWords
      .slice(0, 2)
      .map(word => getSafeChar(word, 0))
      .join("")
      .toUpperCase();
  }

  // Western-style name handling (first + last)
  const first = getSafeChar(validWords[0], 0);
  const last = getSafeChar(validWords[validWords.length - 1], 0);
  
  return `${first}${last}`.toUpperCase();
};

// Safe Unicode character extraction (handles surrogate pairs)
const getSafeChar = (str, index) => {
  return Array.from(str)[index] || "";
};
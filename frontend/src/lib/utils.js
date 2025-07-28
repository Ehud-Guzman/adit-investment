// src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names and resolves Tailwind CSS conflicts
 * @param {...any} inputs - Class names to merge
 * @returns {string} - Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats currency values
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'KES')
 * @param {number} decimals - Decimal places (default: 2)
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currency = 'KES', decimals = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Formats date strings
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'dd MMM yyyy')
 * @returns {string} - Formatted date
 */
export function formatDate(date, formatStr = 'dd MMM yyyy') {
  if (!date) return '—';
  return format(new Date(date), formatStr);
}

/**
 * Truncates text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (!text) return '—';
  return text.length > maxLength 
    ? `${text.substring(0, maxLength)}...` 
    : text;
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
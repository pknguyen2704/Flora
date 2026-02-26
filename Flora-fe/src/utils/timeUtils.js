/**
 * Utilities for date and time formatting that respect the user's browser settings.
 */

/**
 * Formats a date string or object to a localized date string.
 * @param {string|Date} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted localized date
 */
export const formatLocalDate = (date, options = { 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric' 
}) => {
  if (!date) return 'N/A';
  
  // If it's a string and looks like a naive ISO string (no timezone info), append Z
  let dateToParse = date;
  if (typeof date === 'string' && date.includes('T')) {
    const timePart = date.split('T')[1];
    if (!timePart.includes('Z') && !timePart.includes('+') && !timePart.includes('-')) {
      dateToParse = `${date}Z`;
    }
  }
  
  const d = new Date(dateToParse);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  // Use browser's locale by not providing a locale string
  return new Intl.DateTimeFormat(undefined, options).format(d);
};

/**
 * Formats a date string or object to a localized relative time string.
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted relative time (e.g., "3 minutes ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return 'Never';
  
  // If it's a string and looks like a naive ISO string, append Z
  let dateToParse = date;
  if (typeof date === 'string' && date.includes('T')) {
    const timePart = date.split('T')[1];
    if (!timePart.includes('Z') && !timePart.includes('+') && !timePart.includes('-')) {
      dateToParse = `${date}Z`;
    }
  }
  
  const now = new Date();
  const past = new Date(dateToParse);
  const diffMs = now - past;
  
  // Basic relative time logic
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
};

/**
 * Formats a duration in seconds to a human-readable string.
 * @param {number} seconds - The duration in seconds
 * @returns {string} - Formatted duration (e.g., "2:30")
 */
export const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

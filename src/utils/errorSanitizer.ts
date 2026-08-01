/**
 * Utility to sanitize raw technical error strings into user-friendly passenger messaging.
 */
export function sanitizeErrorMessage(rawError: unknown): string {
  if (!rawError) {
    return "An unexpected error occurred. Please try again.";
  }

  const message =
    typeof rawError === "string"
      ? rawError
      : rawError instanceof Error
      ? rawError.message
      : String(rawError);

  const lower = message.toLowerCase();

  if (
    lower.includes("booking_hold_invalid") ||
    lower.includes("booking_hold_mismatch") ||
    lower.includes("hold expired") ||
    lower.includes("hold_expired") ||
    lower.includes("reservation expired")
  ) {
    return "Your seat reservation time ended. Please select your seats again.";
  }

  if (
    lower.includes("seat_temporarily_held") ||
    lower.includes("temporarily held") ||
    lower.includes("currently held")
  ) {
    return "These seats are currently selected by another passenger. Please pick another seat.";
  }

  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("network request failed") ||
    lower.includes("econndefused")
  ) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }

  if (lower.includes("500") || lower.includes("internal server error")) {
    return "Our server ran into an issue loading seat details. Please try again in a moment.";
  }

  if (lower.includes("404") || lower.includes("not found")) {
    return "The requested trip or seat layout could not be found.";
  }

  if (lower.includes("jwt") || lower.includes("unauthorized") || lower.includes("401")) {
    return "Your session has expired. Please refresh or log in again.";
  }

  if (lower.includes("sold out") || lower.includes("no available seats")) {
    return "All seats for this trip have been booked.";
  }

  if (lower.includes("timeout")) {
    return "The request timed out. Please click retry to reload seat details.";
  }

  // Return original clean string if already friendly, capped at reasonable length
  if (message.length > 120) {
    return "Unable to reserve your seats at this time. Please try again.";
  }

  return message;
}

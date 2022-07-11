/**
 * Error identifiers which can be used in API responses and error handling
 * to specify the exact error that happened.
 */

// Unexpected Error
export const UNEXPECTED_ERROR = "unexpected-error";

// User Errors
export const USER_NOT_FOUND = "user-not-found";
export const USER_USERNAME_EXISTS = "user-username-exists";
export const USER_EMAIL_EXISTS = "user-email-exists";

// Access Errors
export const ACCESS_DENIED = "access-denied";
export const ACCESS_FORBIDDEN = "access-forbidden";
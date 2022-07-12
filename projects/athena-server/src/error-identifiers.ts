/**
 * Error identifiers which can be used in API responses and error handling
 * to specify the exact error that happened.
 */

export enum AthenaErrorIdentifiers {
  // User Errors
  USER_NOT_FOUND = "user-not-found",
  USER_USERNAME_EXISTS = "user-username-exists",
  USER_EMAIL_EXISTS = "user-email-exists",
}


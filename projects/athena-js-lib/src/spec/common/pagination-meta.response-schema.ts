/**
 * Metadata sent with paginated responses.
 * This lets clients do things like determine what "page" of data they're on and if there is more data left.
 */
export interface MetaPaginationResponseSchema {
  total: number;
  take: number;
  skip: number;
}

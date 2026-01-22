/**
 * Base Datadog API error response
 */
export interface ApiErrorResponse {
  errors: string[];
}

/**
 * API request options
 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
}

/**
 * Validate response - simple check endpoint
 */
export interface ValidateResponse {
  valid: boolean;
}

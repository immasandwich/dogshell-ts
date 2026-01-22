import { Config, DatadogSite } from '../types/config.js';
import { ApiErrorResponse, RequestOptions, ValidateResponse } from '../types/api.js';

/**
 * Error thrown when API request fails
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors: string[] = []
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Build the base API URL for a given Datadog site
 */
function getBaseUrl(site: DatadogSite): string {
  return `https://api.${site}`;
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Datadog API client
 */
export class DatadogClient {
  private baseUrl: string;
  private apiKey: string;
  private appKey: string;
  private maxRetries: number;
  private baseDelay: number;

  constructor(config: Config, options?: { maxRetries?: number; baseDelay?: number }) {
    this.baseUrl = getBaseUrl(config.site);
    this.apiKey = config.api_key;
    this.appKey = config.app_key;
    this.maxRetries = options?.maxRetries ?? 3;
    this.baseDelay = options?.baseDelay ?? 1000;
  }

  /**
   * Make an authenticated request to the Datadog API
   */
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, params, headers = {} } = options;

    // Build URL with query params
    const url = new URL(path, this.baseUrl);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    // Build headers
    const requestHeaders: Record<string, string> = {
      'DD-API-KEY': this.apiKey,
      'DD-APPLICATION-KEY': this.appKey,
      'Content-Type': 'application/json',
      ...headers,
    };

    // Make request with retry logic for rate limits
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(url.toString(), {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });

        // Handle rate limiting with exponential backoff
        if (response.status === 429) {
          if (attempt < this.maxRetries) {
            const retryAfter = response.headers.get('X-RateLimit-Reset');
            const delay = retryAfter
              ? parseInt(retryAfter, 10) * 1000
              : this.baseDelay * Math.pow(2, attempt);

            await sleep(delay);
            continue;
          }
          throw new ApiError('Rate limit exceeded', 429);
        }

        // Handle error responses
        if (!response.ok) {
          let errors: string[] = [];
          try {
            const errorBody = (await response.json()) as ApiErrorResponse;
            errors = errorBody.errors || [];
          } catch {
            // Ignore JSON parse errors
          }

          throw new ApiError(
            errors.length > 0 ? errors.join(', ') : `HTTP ${response.status}`,
            response.status,
            errors
          );
        }

        // Handle empty responses (204 No Content)
        if (response.status === 204) {
          return {} as T;
        }

        return (await response.json()) as T;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        lastError = error as Error;

        // Retry on network errors
        if (attempt < this.maxRetries) {
          await sleep(this.baseDelay * Math.pow(2, attempt));
          continue;
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * GET request helper
   */
  async get<T>(path: string, params?: RequestOptions['params']): Promise<T> {
    return this.request<T>(path, { method: 'GET', params });
  }

  /**
   * POST request helper
   */
  async post<T>(path: string, body?: unknown, params?: RequestOptions['params']): Promise<T> {
    return this.request<T>(path, { method: 'POST', body, params });
  }

  /**
   * PUT request helper
   */
  async put<T>(path: string, body?: unknown, params?: RequestOptions['params']): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body, params });
  }

  /**
   * PATCH request helper
   */
  async patch<T>(path: string, body?: unknown, params?: RequestOptions['params']): Promise<T> {
    return this.request<T>(path, { method: 'PATCH', body, params });
  }

  /**
   * DELETE request helper
   */
  async delete<T>(path: string, params?: RequestOptions['params']): Promise<T> {
    return this.request<T>(path, { method: 'DELETE', params });
  }

  /**
   * Validate API credentials
   */
  async validate(): Promise<boolean> {
    try {
      const response = await this.get<ValidateResponse>('/api/v1/validate');
      return response.valid === true;
    } catch {
      return false;
    }
  }
}

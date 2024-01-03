import { BackendFetchOptions, HTTPMethod, QueryParams, RequestError, } from './backend.types';
import { buildPath, buildQueryString } from './fetch-utils';

export class BackendClient {
  private MAX_RETRIES = 1;

  private baseUrl = process.env['NEXT_PUBLIC_API_BASE_URL'] || '/';

  private static instance: BackendClient;

  public static getInstance(): BackendClient {
    if (!BackendClient.instance) {
      BackendClient.instance = new BackendClient();
    }

    return BackendClient.instance;
  }

  private constructor() {
  }

  post<T>(path: string, options: BackendFetchOptions = {}) {
    return this.fetch<T>('POST', path, options);
  }

  get<T>(path: string, options: BackendFetchOptions = {}) {
    return this.fetch<T>('GET', path, options);
  }

  put<T>(path: string, options: BackendFetchOptions = {}) {
    return this.fetch<T>('PUT', path, options);
  }

  delete<T>(path: string, options: BackendFetchOptions = {}) {
    return this.fetch<T>('DELETE', path, options);
  }

  patch<T>(path: string, options: BackendFetchOptions = {}) {
    return this.fetch<T>('PATCH', path, options);
  }

  /**
   * Performs a fetch to the backend API. Will automatically refresh the session if the access token
   * has expired. Can retry the request if the access token has expired.
   */
  private async fetch<T>(
    method: HTTPMethod,
    path: string,
    options: {
      params?: QueryParams;
      body?: unknown;
      signal?: AbortSignal;
    } = {}
  ): Promise<T> {
    const finalPath = buildPath(path);
    const queryString = buildQueryString(options.params);
    const url = `${this.baseUrl}${finalPath}${queryString}`;

    let retries = 0;

    // We can retry the request if the access token has expired/invalidated.
    while (retries < this.MAX_RETRIES) {
      try {
        const response = await fetch(url, {
          headers: this.getHeaders(),
          referrerPolicy: 'same-origin',
          method,
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: options.signal,
        });

        if (!response.ok) {
          if (response.status === 401 && retries < this.MAX_RETRIES) {
            retries++;
            continue;
          }
          return Promise.reject(new RequestError(response));
        }

        return (await response.json()) as T;
      } catch (ex) {
        retries++;
      }
    }

    return Promise.reject(
      `Failed to fetch, exceeded max retries. url: "${url}"`
    );
  }

  private defaultHeaders: Record<string, string> = {
    accept: 'application/json, text/plain, */*',
    'content-type': 'application/json',
  } as const;

  /**
   * Returns the headers to be used for the request.
   */
  private getHeaders() {
    return { ...this.defaultHeaders };
  }
}

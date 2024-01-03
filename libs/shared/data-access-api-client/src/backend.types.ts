// The assumption is that the path is of the form: /api-service/[]...rest]
export type BackendServicePath = `${string}-${string}/${string}`;

export type BackendFetchOptions = {
  params?: QueryParams;
  body?: unknown;

  // Abort signal for query cancellation https://react-query-v3.tanstack.com/guides/query-cancellation
  signal?: AbortSignal;
};

export type HTTPMethod = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';

export type QueryParams = Record<string, string | number | boolean | undefined>;

export class RequestError extends Error {
  response: Response;

  constructor(response: Response) {
    super('Request error ' + response.status);
    this.name = 'RequestError';
    this.response = response;
  }
}

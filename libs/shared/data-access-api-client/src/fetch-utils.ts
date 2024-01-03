import { BackendServicePath, QueryParams } from './backend.types';

export function buildQueryString(params?: QueryParams): string {
  if (!params) {
    return '';
  }

  const stringObject = Object.entries(params).reduce((acc, [k, v]) => {
    if (typeof v !== 'undefined') {
      acc[k] = v.toString();
    }

    return acc;
  }, {} as Record<string, string>);

  return `?${new URLSearchParams(stringObject)?.toString()}`;
}

/**
 * Builds a path for a mathem backend service. Adds the noauth path if the user is not authenticated,
 * and adds query params if they are provided.
 */
export function buildPath(path: string): string {
  const [serviceName, ...restOfPath] = path.split('/');

  return `${serviceName}/${restOfPath.join('/')}`;
}

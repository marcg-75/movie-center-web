import { BackendClient } from './BackendClient';

/**
 * Creates a singleton backend client that can be used to make requests to the backend. Requests will wait for the user session to be resolved before being made.
 *
 * @param overrideSession If provided, the session will be overridden with this value. This is useful for SSR. Supply null
 * to make the request without a session.
 */
export function getBackendClient() {
  return BackendClient.getInstance();
}

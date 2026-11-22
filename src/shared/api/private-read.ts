import { createContext, useContext } from 'react';
import { isApiError } from './http';

/** Bound to the current account, family and access level by App Providers. */
export const PrivateReadScope = createContext<string | null>(null);
export const usePrivateReadScope = () => useContext(PrivateReadScope);

export const isAccessDenied = (error: unknown) =>
  isApiError(error) && (error.status === 401 || error.status === 403);

export const privateReadOptions = {
  meta: { privateRead: true },
  retryOnMount: false,
  retry: (failureCount: number, error: unknown) =>
    failureCount < 1 &&
    isApiError(error) &&
    (error.status === 0 || error.status === 429 || error.status >= 500),
  retryDelay: (_attempt: number, error: unknown) =>
    isApiError(error) ? (error.retryAfter ?? 1_000) : 1_000,
};

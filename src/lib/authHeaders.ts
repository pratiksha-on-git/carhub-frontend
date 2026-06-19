/**
 * Returns Authorization headers with the Bearer token from localStorage.
 * Checks dealerToken first, then adminToken.
 */
export function getAuthHeaders(extraHeaders?: Record<string, string>): Record<string, string> {
  const token =
    localStorage.getItem('dealerToken') ?? localStorage.getItem('adminToken') ?? '';

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

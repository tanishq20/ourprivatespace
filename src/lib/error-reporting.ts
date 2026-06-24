/**
 * Simple error reporting utility
 * Logs errors to console for development and debugging
 */
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const errorInfo = {
    error: error instanceof Error ? error.message : String(error),
    route: window.location.pathname,
    timestamp: new Date().toISOString(),
    ...context,
  };

  console.error("Error reported:", errorInfo);
}

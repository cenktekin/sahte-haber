declare global {
  interface Window {
    APP_DEBUG?: boolean
  }
}

const isBrowser = typeof window !== 'undefined'

export const DEBUG =
  (isBrowser
    ? ((window as Window).APP_DEBUG ?? false)
    : process.env.DEBUG === '1' || process.env.NODE_ENV === 'development') || false

export function dlog(...args: unknown[]) {
  if (DEBUG && typeof console !== 'undefined') console.log('[DEBUG]', ...args)
}

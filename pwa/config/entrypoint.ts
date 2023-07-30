export const ENTRYPOINT = typeof window === "undefined" ? process.env.NEXT_PUBLIC_ENTRYPOINT : window.origin;
export const BACKEND_URL = 'http://caddy';
export const MEDIAOBJECTS_URL = '/api/media_objects';

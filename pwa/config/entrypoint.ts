export const ENTRYPOINT = typeof window === "undefined" ? process.env.NEXT_PUBLIC_ENTRYPOINT : window.origin;
export const BACKEND_URL = 'http://caddy';
export const MEDIA_OBJECTS_URL = '/api/media_objects';
export const TECHNICAL_DOCUMENT_URL = '/api/technical_documents';

export const ENTRYPOINT = typeof window === "undefined" ? process.env.NEXT_PUBLIC_ENTRYPOINT : window.origin;
export const BACKEND_URL = 'http://caddy';
export const MEDIA_OBJECTS_URL = '/api/media_objects';
export const TECHNICAL_DOCUMENT_URL = '/api/technical_documents';
export const ARTICLE_IMAGE_URL = '/api/article_images';
export const IMAGE_404 = '/images/no-image.png';
export const TIMEZONE = 'Africa/Tunis';

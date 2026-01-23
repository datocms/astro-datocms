import ContentLink from './ContentLink.astro';

// Re-export types and utilities from @datocms/content-link
export type { Controller } from '@datocms/content-link';
export { decodeStega, stripStega } from '@datocms/content-link';

export { ContentLink };

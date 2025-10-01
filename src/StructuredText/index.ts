import StructuredText from './StructuredText.astro';

export {
  defaultMetaTransformer,
  type TransformedMeta,
} from 'datocms-structured-text-generic-html-renderer';

export {
  type CdaStructuredTextValue,
  type CdaStructuredTextRecord,
  type TypesafeCdaStructuredTextValue,
  type Document as StructuredTextDocument,
} from 'datocms-structured-text-utils';

export { ensureValidStructuredTextProps } from './ensureValidStructuredTextProps';

export { StructuredText };

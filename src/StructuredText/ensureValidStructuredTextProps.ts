import {
  type Node as DastNode,
  type CdaStructuredTextRecord,
  type Document,
  type CdaStructuredTextValue,
} from 'datocms-structured-text-utils';
import type {
  BlockComponents,
  InlineBlockComponents,
  InlineRecordComponents,
  LinkToRecordComponents,
} from './types';

type Props<
  B extends CdaStructuredTextRecord,
  L extends CdaStructuredTextRecord,
  I extends CdaStructuredTextRecord,
> =
  | {
      /** The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from a DatoCMS Structured Text field */
      data:
        | (Omit<CdaStructuredTextValue<B, L, I>, 'blocks' | 'links' | 'inlineBlocks'> & {
            blocks?: never;
            links?: never;
            inlineBlocks?: never;
          })
        | Document
        | DastNode
        | null
        | undefined;
      blockComponents?: never;
      inlineBlockComponents?: never;
      linkToRecordComponents?: never;
      inlineRecordComponents?: never;
    }
  | {
      /** The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from a DatoCMS Structured Text field */
      data:
        | (Omit<CdaStructuredTextValue<B, L, I>, 'blocks' | 'links' | 'inlineBlocks'> & {
            blocks: B[];
            links?: never;
            inlineBlocks?: never;
          })
        | null
        | undefined;
      /** An object in which the keys are the `__typename` of the blocks to be rendered, and the values are the Astro components  */
      blockComponents: BlockComponents<B, L, I>;
      inlineBlockComponents?: never;
      linkToRecordComponents?: never;
      inlineRecordComponents?: never;
    }
  | {
      /** The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from a DatoCMS Structured Text field */
      data:
        | (Omit<CdaStructuredTextValue<B, L, I>, 'blocks' | 'links' | 'inlineBlocks'> & {
            blocks?: never;
            links: L[];
            inlineBlocks?: never;
          })
        | null
        | undefined;
      blockComponents?: never;
      inlineBlockComponents?: never;
      /** An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components */
      linkToRecordComponents: LinkToRecordComponents<B, L, I>;
      /** An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components */
      inlineRecordComponents: InlineRecordComponents<B, L, I>;
    }
  | {
      /** The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from a DatoCMS Structured Text field */
      data:
        | (Omit<CdaStructuredTextValue<B, L, I>, 'blocks' | 'links' | 'inlineBlocks'> & {
            blocks?: never;
            links?: never;
            inlineBlocks: I[];
          })
        | null
        | undefined;
      blockComponents?: never;
      /** An object in which the keys are the `__typename` of the inline blocks to be rendered, and the values are the Astro components  */
      inlineBlockComponents: InlineBlockComponents<B, L, I>;
      linkToRecordComponents?: never;
      inlineRecordComponents?: never;
    }
  | {
      /** The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from a DatoCMS Structured Text field */
      data:
        | (Omit<CdaStructuredTextValue<B, L, I>, 'blocks' | 'links' | 'inlineBlocks'> & {
            blocks?: never;
            links: L[];
            inlineBlocks: I[];
          })
        | null
        | undefined;
      blockComponents?: never;
      /** An object in which the keys are the `__typename` of the inline blocks to be rendered, and the values are the Astro components  */
      inlineBlockComponents: InlineBlockComponents<B, L, I>;
      /** An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components */
      linkToRecordComponents: LinkToRecordComponents<B, L, I>;
      /** An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components */
      inlineRecordComponents: InlineRecordComponents<B, L, I>;
    }
  | {
      /** The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from a DatoCMS Structured Text field */
      data:
        | (Omit<CdaStructuredTextValue<B, L, I>, 'blocks' | 'links' | 'inlineBlocks'> & {
            blocks: B[];
            links?: never;
            inlineBlocks: I[];
          })
        | null
        | undefined;
      /** An object in which the keys are the `__typename` of the blocks to be rendered, and the values are the Astro components  */
      blockComponents: BlockComponents<B, L, I>;
      /** An object in which the keys are the `__typename` of the inline blocks to be rendered, and the values are the Astro components  */
      inlineBlockComponents: InlineBlockComponents<B, L, I>;
      linkToRecordComponents?: never;
      inlineRecordComponents?: never;
    }
  | {
      /** The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from a DatoCMS Structured Text field */
      data:
        | (Omit<CdaStructuredTextValue<B, L, I>, 'blocks' | 'links' | 'inlineBlocks'> & {
            blocks: B[];
            links: L[];
            inlineBlocks?: never;
          })
        | null
        | undefined;
      /** An object in which the keys are the `__typename` of the blocks to be rendered, and the values are the Astro components  */
      blockComponents: BlockComponents<B, L, I>;
      inlineBlockComponents?: never;
      /** An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components */
      linkToRecordComponents: LinkToRecordComponents<B, L, I>;
      /** An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components */
      inlineRecordComponents: InlineRecordComponents<B, L, I>;
    }
  | {
      /** The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from a DatoCMS Structured Text field */
      data:
        | (Omit<CdaStructuredTextValue<B, L, I>, 'blocks' | 'links' | 'inlineBlocks'> & {
            blocks: B[];
            links: L[];
            inlineBlocks: I[];
          })
        | null
        | undefined;
      /** An object in which the keys are the `__typename` of the blocks to be rendered, and the values are the Astro components  */
      blockComponents: BlockComponents<B, L, I>;
      /** An object in which the keys are the `__typename` of the inline blocks to be rendered, and the values are the Astro components  */
      inlineBlockComponents: InlineBlockComponents<B, L, I>;
      /** An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components */
      linkToRecordComponents: LinkToRecordComponents<B, L, I>;
      /** An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components */
      inlineRecordComponents: InlineRecordComponents<B, L, I>;
    };

export function ensureValidStructuredTextProps<
  B extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  L extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  I extends CdaStructuredTextRecord = CdaStructuredTextRecord,
>(props: Props<B, L, I>): Props<B, L, I> {
  return props;
}

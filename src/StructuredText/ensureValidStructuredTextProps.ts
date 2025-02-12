import {
  type Node as DastNode,
  type Record as DatocmsRecord,
  type Document,
  type StructuredText,
} from 'datocms-structured-text-utils';
import type {
  BlockComponents,
  InlineBlockComponents,
  InlineRecordComponents,
  LinkToRecordComponents,
} from './types';

type Props<R1 extends DatocmsRecord, R2 extends DatocmsRecord> =
  | {
      /** The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from a DatoCMS Structured Text field */
      data: Document | DastNode | null | undefined;
      blockComponents?: never;
      inlineBlockComponents?: never;
      linkToRecordComponents?: never;
      inlineRecordComponents?: never;
    }
  | {
      /** The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from a DatoCMS Structured Text field */
      data:
        | (Omit<StructuredText<R1, R2>, 'blocks' | 'links'> & { blocks: R1[]; links: R2[] })
        | null
        | undefined;
      /** An object in which the keys are the `__typename` of the blocks to be rendered, and the values are the Astro components  */
      blockComponents: BlockComponents<R1, R2>;
      /** An object in which the keys are the `__typename` of the inline blocks to be rendered, and the values are the Astro components  */
      inlineBlockComponents: BlockComponents<R1, R2>;
      /** An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components */
      linkToRecordComponents: LinkToRecordComponents<R1, R2>;
      /** An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components */
      inlineRecordComponents: InlineRecordComponents<R1, R2>;
    }
  | {
      /** The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from a DatoCMS Structured Text field */
      data:
        | (Omit<StructuredText<R1, R2>, 'blocks' | 'links'> & { blocks: R1[]; links?: never })
        | null
        | undefined;
      /** An object in which the keys are the `__typename` of the blocks to be rendered, and the values are the Astro components  */
      blockComponents: BlockComponents<R1, R2>;
      inlineBlockComponents: InlineBlockComponents<R1, R2>;
      linkToRecordComponents?: never;
      inlineRecordComponents?: never;
    }
  | {
      /** The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from a DatoCMS Structured Text field */
      data:
        | (Omit<StructuredText<R1, R2>, 'blocks' | 'links'> & { blocks?: never; links: R2[] })
        | null
        | undefined;
      blockComponents?: never;
      inlineBlockComponents?: never;
      /** An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components */
      linkToRecordComponents: LinkToRecordComponents<R1, R2>;
      /** An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components */
      inlineRecordComponents: InlineRecordComponents<R1, R2>;
    }
  | {
      /** The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from a DatoCMS Structured Text field */
      data:
        | (Omit<StructuredText<R1, R2>, 'blocks' | 'links'> & { blocks?: never; links?: never })
        | null
        | undefined;
      blockComponents?: never;
      inlineBlockComponents?: never;
      linkToRecordComponents?: never;
      inlineRecordComponents?: never;
    };

export function ensureValidStructuredTextProps<R1 extends DatocmsRecord, R2 extends DatocmsRecord>(
  props: Props<R1, R2>,
): Props<R1, R2> {
  return props;
}

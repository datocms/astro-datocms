import type { TransformedMeta } from 'datocms-structured-text-generic-html-renderer';
import type {
  Block,
  CdaStructuredTextRecord,
  CdaStructuredTextValue,
  Document,
  InlineBlock,
  InlineItem,
  ItemLink,
  Mark,
  Node,
  Span,
} from 'datocms-structured-text-utils';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type AstroComponent<P = any> = (props: P) => any;

export type BlockComponents<
  B extends CdaStructuredTextRecord,
  _L extends CdaStructuredTextRecord,
  _I extends CdaStructuredTextRecord,
> = {
  [R in B as R['__typename']]: AstroComponent<{ block: R }>;
};

export type InlineBlockComponents<
  _B extends CdaStructuredTextRecord,
  _L extends CdaStructuredTextRecord,
  I extends CdaStructuredTextRecord,
> = {
  [R in I as R['__typename']]: AstroComponent<{ block: R }>;
};

export type LinkToRecordComponents<
  _B extends CdaStructuredTextRecord,
  L extends CdaStructuredTextRecord,
  _I extends CdaStructuredTextRecord,
> = {
  [R in L as R['__typename']]: AstroComponent<{
    node: ItemLink;
    attrs: TransformedMeta;
    record: R;
  }>;
};

export type InlineRecordComponents<
  _B extends CdaStructuredTextRecord,
  L extends CdaStructuredTextRecord,
  _I extends CdaStructuredTextRecord,
> = {
  [R in L as R['__typename']]: AstroComponent<{ record: R }>;
};

export type NodeOverrides = Partial<{
  [N in Node as N['type']]: AstroComponent<
    N extends ItemLink
      ? {
          node: ItemLink;
          record: CdaStructuredTextRecord;
          linkToRecordComponents?: LinkToRecordComponents<
            CdaStructuredTextRecord,
            CdaStructuredTextRecord,
            CdaStructuredTextRecord
          >;
        }
      : N extends InlineItem
        ? {
            node: InlineItem;
            record: CdaStructuredTextRecord;
            inlineRecordComponents?: InlineRecordComponents<
              CdaStructuredTextRecord,
              CdaStructuredTextRecord,
              CdaStructuredTextRecord
            >;
          }
        : N extends Block
          ? {
              node: Block;
              block: CdaStructuredTextRecord;
              blockComponents?: BlockComponents<
                CdaStructuredTextRecord,
                CdaStructuredTextRecord,
                CdaStructuredTextRecord
              >;
            }
          : N extends Span
            ? {
                node: N;
                markOverrides?: MarkOverrides;
              }
            : N extends InlineBlock
              ? {
                  node: N;
                  block: CdaStructuredTextRecord;
                  inlineBlockComponents: InlineBlockComponents<
                    CdaStructuredTextRecord,
                    CdaStructuredTextRecord,
                    CdaStructuredTextRecord
                  >;
                }
              : { node: N }
  >;
}>;

export type MarkOverrides = Partial<Record<Mark, AstroComponent | string>>;

// It would be better to type this as a generic:
//
// interface Props<B extends CdaStructuredTextRecord = any, L extends CdaStructuredTextRecord = any, I extends CdaStructuredTextRecord = any>
//
// but it's currently not possible: https://github.com/withastro/roadmap/discussions/601#discussioncomment-10333959
//
// In the meantime, you can use ensureValidStructuredTextProps()

export interface StructuredTextProps {
  /** The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from a DatoCMS Structured Text field */
  data: CdaStructuredTextValue | Document | Node | null | undefined;

  /** An object in which the keys are the `__typename` of the blocks to be rendered, and the values are the Astro components  */
  blockComponents?: Record<string, AstroComponent>;
  /** An object in which the keys are the `__typename` of the inline blocks to be rendered, and the values are the Astro components  */
  inlineBlockComponents?: Record<string, AstroComponent>;
  /** An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components */
  linkToRecordComponents?: Record<string, AstroComponent>;
  /** An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components */
  inlineRecordComponents?: Record<string, AstroComponent>;

  /** An object in which the keys are the types of DAST nodes to override, and the values are the Astro components */
  nodeOverrides?: NodeOverrides;
  /** An object in which the keys are the types of `span` node marks to override, and the values are the Astro components */
  markOverrides?: MarkOverrides;
}

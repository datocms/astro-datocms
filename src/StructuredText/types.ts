import type { TransformedMeta } from 'datocms-structured-text-generic-html-renderer';
import type {
  Block,
  CdaStructuredTextRecord,
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

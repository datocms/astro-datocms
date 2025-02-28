import type { TransformedMeta } from 'datocms-structured-text-generic-html-renderer';
import type {
  Block,
  Record as DatocmsRecord,
  InlineBlock,
  InlineItem,
  ItemLink,
  Mark,
  Node,
  Span,
} from 'datocms-structured-text-utils';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type AstroComponent<P = any> = (props: P) => any;

export type BlockComponents<R1 extends DatocmsRecord, _R2 extends DatocmsRecord> = {
  [R in R1 as R['__typename']]: AstroComponent<{ block: R }>;
};

export type InlineBlockComponents<R1 extends DatocmsRecord, _R2 extends DatocmsRecord> = {
  [R in R1 as R['__typename']]: AstroComponent<{ block: R }>;
};

export type LinkToRecordComponents<_R1 extends DatocmsRecord, R2 extends DatocmsRecord> = {
  [R in R2 as R['__typename']]: AstroComponent<{
    node: ItemLink;
    attrs: TransformedMeta;
    record: R;
  }>;
};

export type InlineRecordComponents<_R1 extends DatocmsRecord, R2 extends DatocmsRecord> = {
  [R in R2 as R['__typename']]: AstroComponent<{ record: R }>;
};

export type NodeOverrides = Partial<{
  [N in Node as N['type']]: AstroComponent<
    N extends ItemLink
      ? {
          node: ItemLink;
          record: DatocmsRecord;
          linkToRecordComponents?: LinkToRecordComponents<DatocmsRecord, DatocmsRecord>;
        }
      : N extends InlineItem
        ? {
            node: InlineItem;
            record: DatocmsRecord;
            inlineRecordComponents?: InlineRecordComponents<DatocmsRecord, DatocmsRecord>;
          }
        : N extends Block
          ? {
              node: Block;
              block: DatocmsRecord;
              blockComponents?: BlockComponents<DatocmsRecord, DatocmsRecord>;
            }
          : N extends Span
            ? {
                node: N;
                markOverrides?: MarkOverrides;
              }
            : N extends InlineBlock
              ? {
                  node: N;
                  block: DatocmsRecord;
                  inlineBlockComponents: InlineBlockComponents<DatocmsRecord, DatocmsRecord>;
                }
              : { node: N }
  >;
}>;

export type MarkOverrides = Partial<Record<Mark, AstroComponent | string>>;

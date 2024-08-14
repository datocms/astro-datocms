import type { Record as DatocmsRecord, NodeType } from 'datocms-structured-text-utils';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AstroComponent = (props: any) => any;

export type BlockComponents<R1 extends DatocmsRecord, R2 extends DatocmsRecord> = Record<
  R1['__typename'],
  AstroComponent
>;

export type ItemLinkComponents<R1 extends DatocmsRecord, R2 extends DatocmsRecord> = Record<
  R2['__typename'],
  AstroComponent
>;

export type InlineItemComponents<R1 extends DatocmsRecord, R2 extends DatocmsRecord> = Record<
  R2['__typename'],
  AstroComponent
>;

export type Overrides = Record<NodeType, AstroComponent>;

import type { Record as DatocmsRecord, Mark, NodeType } from 'datocms-structured-text-utils';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type AstroComponent = (props: any) => any;

export type BlockComponents<R1 extends DatocmsRecord, R2 extends DatocmsRecord> = Record<
  R1['__typename'],
  AstroComponent
>;

export type LinkToRecordComponents<R1 extends DatocmsRecord, R2 extends DatocmsRecord> = Record<
  R2['__typename'],
  AstroComponent
>;

export type InlineRecordComponents<R1 extends DatocmsRecord, R2 extends DatocmsRecord> = Record<
  R2['__typename'],
  AstroComponent
>;

export type NodeOverrides = Partial<Record<NodeType, AstroComponent>>;

export type MarkOverrides = Partial<Record<Mark, AstroComponent>>;

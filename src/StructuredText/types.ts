import type { Node } from 'datocms-structured-text-utils';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AstroComponent = (props: any) => any;

export type PredicateComponentTuple = [(n: Node) => boolean, AstroComponent];

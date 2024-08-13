import type { Options } from 'datocms-listen';

export type QueryListenerOptions<QueryResult, QueryVariables> = Omit<
  Options<QueryResult, QueryVariables>,
  | 'onStatusChange'
  | 'onUpdate'
  | 'onChannelError'
  | 'onError'
  | 'onEvent'
  | 'fetcher'
  | 'eventSourceClass'
>;

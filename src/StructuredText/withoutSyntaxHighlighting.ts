// Same API as `@datocms/astro/StructuredText`, but code nodes render as plain
// `<pre><code>`. Nothing reachable from here imports `astro:components`, so
// Shiki stays out of the server bundle.
import StructuredText from './StructuredTextWithoutSyntaxHighlighting.astro';

export * from './common';

export { StructuredText };

# @datocms/astro

## 0.7.0

### Minor Changes

- 8f43634: Add `@datocms/astro/StructuredText/WithoutSyntaxHighlighting`, a `<StructuredText />` without syntax highlighting. It has the same API as `@datocms/astro/StructuredText`, but renders `code` nodes as plain `<pre data-language="…"><code>…</code></pre>` instead of using Astro's `<Code />`, so Shiki (about 11 MB of grammars and themes) stays out of the server bundle. Use it on edge runtimes with a script size limit, such as Bunny Edge Scripting. `@datocms/astro/StructuredText` keeps highlighting code as before.

## 0.6.16

### Patch Changes

- 339c518: Move to `datocms-structured-text` 6.x, so you don't end up with two copies of it

  If your site already depends on `datocms-structured-text-utils` 6.x, you have been
  getting a second copy of it — a 5.x one — tucked under `@datocms/astro`, because
  we asked for `^5`. Two copies mean a bigger bundle and two versions of types that
  should be one. This release asks for `^6` instead, and the duplicate goes away.

  Nothing to do on your side, and nothing changes at runtime: 6.0.0 of these
  packages was a version bump and nothing else, so every type and helper is exactly
  what it was before.

---
'@datocms/astro': minor
---

Add `@datocms/astro/StructuredText/Plain`, a `<StructuredText />` without syntax highlighting. It has the same API as `@datocms/astro/StructuredText`, but renders `code` nodes as plain `<pre data-language="…"><code>…</code></pre>` instead of using Astro's `<Code />`, so Shiki (about 11 MB of grammars and themes) stays out of the server bundle. Use it on edge runtimes with a script size limit, such as Bunny Edge Scripting. `@datocms/astro/StructuredText` keeps highlighting code as before.

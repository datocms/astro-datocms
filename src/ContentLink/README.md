# Visual Editing with click-to-edit overlays

`<ContentLink />` enables Visual Editing for your DatoCMS content by providing click-to-edit overlays. It's built on top of the framework-agnostic [`@datocms/content-link`](https://www.npmjs.com/package/@datocms/content-link) library.

## What is Visual Editing?

Visual Editing transforms how editors interact with your content by letting them see and edit it directly in the context of your website. Instead of switching between the CMS and the live site, editors can:

- **See content in context**: View draft content exactly as it appears on the website
- **Click to edit**: Click any content element to instantly open the editor for that specific field
- **Navigate seamlessly**: Browse between pages while staying in editing mode
- **Get instant feedback**: See changes immediately without page refreshes

## Out-of-the-box features

- **Click-to-edit overlays**: Visual indicators showing which content is editable
- **Stega decoding**: Automatically detects stega-encoded metadata from DatoCMS GraphQL responses
- **Keyboard shortcuts**: Hold Alt/Option key to temporarily toggle click-to-edit mode
- **Flash-all highlighting**: Animated effect to show all editable elements at once
- **Bidirectional navigation**: Sync URL changes between your preview and the DatoCMS interface
- **Framework-agnostic**: Works with any Astro setup (with or without View Transitions)
- **StructuredText integration**: Special handling for complex structured content fields
- **Web Previews plugin integration**: Automatic bidirectional communication when running inside the DatoCMS Web Previews plugin

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Basic Setup](#basic-setup)
  - [Step 1: Fetch content with Content Link metadata](#step-1-fetch-content-with-content-link-metadata)
  - [Step 2: Add the ContentLink component](#step-2-add-the-contentlink-component)
- [Usage](#usage)
- [Props](#props)
  - [`enableClickToEdit` options](#enableclicktoedit-options)
- [Data attributes reference](#data-attributes-reference)
  - [Developer-specified attributes](#developer-specified-attributes)
    - [`data-datocms-content-link-url`](#data-datocms-content-link-url)
    - [`data-datocms-content-link-source`](#data-datocms-content-link-source)
    - [`data-datocms-content-link-group`](#data-datocms-content-link-group)
    - [`data-datocms-content-link-boundary`](#data-datocms-content-link-boundary)
  - [Library-managed attributes](#library-managed-attributes)
    - [`data-datocms-contains-stega`](#data-datocms-contains-stega)
    - [`data-datocms-auto-content-link-url`](#data-datocms-auto-content-link-url)
- [How group and boundary resolution works](#how-group-and-boundary-resolution-works)
- [Structured Text fields](#structured-text-fields)
  - [Rule 1: Always wrap the Structured Text component in a group](#rule-1-always-wrap-the-structured-text-component-in-a-group)
  - [Rule 2: Wrap embedded blocks, inline blocks, and inline records in a boundary](#rule-2-wrap-embedded-blocks-inline-blocks-and-inline-records-in-a-boundary)
- [Low-level utilities](#low-level-utilities)
  - [`stripStega()` works with any data type](#stripstega-works-with-any-data-type)
- [Troubleshooting](#troubleshooting)
  - [Click-to-edit overlays not appearing](#click-to-edit-overlays-not-appearing)
  - [Navigation not syncing in Web Previews plugin](#navigation-not-syncing-in-web-previews-plugin)
  - [Content inside StructuredText not clickable](#content-inside-structuredtext-not-clickable)
  - [Layout issues caused by stega encoding](#layout-issues-caused-by-stega-encoding)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```bash
npm install --save @datocms/astro
```

Note that `@datocms/content-link` is included as a dependency and will be installed automatically.

## Basic Setup

### Step 1: Fetch content with Content Link metadata

Make sure you pass the `contentLink` and `baseEditingUrl` options when fetching content from DatoCMS:

```astro
---
import { executeQuery } from '@datocms/cda-client';

const query = `
  query {
    blogPost {
      title
      content
    }
  }
`;

const result = await executeQuery(query, {
  token: import.meta.env.DATOCMS_API_TOKEN,
  contentLink: 'v1',
  baseEditingUrl: 'https://your-project.admin.datocms.com',
});
---
```

The `contentLink: 'v1'` option enables stega encoding, which embeds invisible metadata into text fields. The `baseEditingUrl` tells DatoCMS where your project is located so edit URLs can be generated correctly. Both options are required.

### Step 2: Add the ContentLink component

Add the `<ContentLink />` component to your page or layout. This component renders nothing visible but activates all the Visual Editing features:

```astro
---
import { ContentLink } from '@datocms/astro/ContentLink';
---

<html>
  <head>
    <!-- your head content -->
  </head>
  <body>
    <!-- your page content -->
    <ContentLink />
  </body>
</html>
```

That's it! The component will automatically:

- Scan the page for stega-encoded content
- Enable Alt/Option key toggling for click-to-edit mode
- Connect to the Web Previews plugin if running inside its iframe
- Handle navigation synchronization

## Usage

The ContentLink component works seamlessly whether or not your Astro site uses [View Transitions](https://docs.astro.build/en/guides/view-transitions/). Simply add it to your layout:

```astro
---
// src/layouts/Layout.astro
import { ContentLink } from '@datocms/astro/ContentLink';
---

<html>
  <head>
    <!-- ViewTransitions are optional -->
  </head>
  <body>
    <slot />
    <ContentLink />
  </body>
</html>
```

The component automatically handles both scenarios:

- **With View Transitions**: Listens to `astro:page-load` events and syncs the URL with the Web Previews plugin during client-side navigation
- **Without View Transitions**: Still initializes correctly and handles navigation via standard page reloads

You get the full Visual Editing experience regardless of your routing setup.

## Props

| Prop                | Type                                                                  | Default | Description                                                                                                                               |
| ------------------- | --------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `enableClickToEdit` | `boolean \| { scrollToNearestTarget?: boolean; hoverOnly?: boolean }` | -       | Enable click-to-edit overlays on mount. Use `true` for immediate activation, or pass options object (see below)                           |
| `stripStega`        | `boolean`                                                             | `false` | Strip stega-encoded invisible characters from text content. When `true`, encoding is permanently removed (prevents controller recreation) |

### `enableClickToEdit` options

When passing an options object to `enableClickToEdit`, the following properties are available:

| Option                  | Type      | Default | Description                                                                                                                                                                                          |
| ----------------------- | --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scrollToNearestTarget` | `boolean` | `false` | Automatically scroll to the nearest editable element if none is currently visible in the viewport when click-to-edit mode is enabled                                                                 |
| `hoverOnly`             | `boolean` | `false` | Only enable click-to-edit on devices that support hover (non-touch). Uses `window.matchMedia('(hover: hover)')` to detect hover capability. On touch devices, users can still toggle with Alt/Option |

**Examples:**

```astro
<!-- Enable click-to-edit immediately -->
<ContentLink enableClickToEdit={true} />

<!-- Enable with scroll-to-nearest behavior -->
<ContentLink enableClickToEdit={{ scrollToNearestTarget: true }} />

<!-- Only enable on devices with hover capability (recommended for sites with touch users) -->
<ContentLink enableClickToEdit={{ hoverOnly: true }} />

<!-- Combine both options -->
<ContentLink enableClickToEdit={{ hoverOnly: true, scrollToNearestTarget: true }} />
```

The `hoverOnly` option is particularly useful for websites that receive traffic from both desktop and mobile users. On touch devices, the click-to-edit overlays can interfere with normal scrolling and tapping behavior. By setting `hoverOnly: true`, overlays will only appear automatically on devices with a mouse or trackpad, while touch device users can still access click-to-edit mode by pressing and holding the Alt/Option key.

## Data attributes reference

This library uses several `data-datocms-*` attributes. Some are **developer-specified** (you add them to your markup), and some are **library-managed** (added automatically during DOM stamping). Here's a complete reference.

### Developer-specified attributes

These attributes are added by you in your templates/components to control how editable regions behave.

#### `data-datocms-content-link-url`

Manually marks an element as editable with an explicit edit URL. Use this for non-text fields (booleans, numbers, dates, JSON) that cannot contain stega encoding. The recommended approach is to use the `_editingUrl` field available on all records:

```graphql
query {
  product {
    id
    price
    isActive
    _editingUrl
  }
}
```

```astro
<span data-datocms-content-link-url={product._editingUrl}>
  ${product.price}
</span>
```

#### `data-datocms-content-link-source`

Attaches stega-encoded metadata without the need to render it as content. Useful for structural elements that cannot contain text (like `<video>`, `<audio>`, `<iframe>`, etc.) or when stega encoding in visible text would be problematic:

```astro
<div data-datocms-content-link-source={video.alt}>
  <video src={video.url} poster={video.posterImage.url} controls></video>
</div>
```

The value must be a stega-encoded string (any text field from the API will work). The library decodes the stega metadata from the attribute value and makes the element clickable to edit.

#### `data-datocms-content-link-group`

Expands the clickable area to a parent element. When the library encounters stega-encoded content, by default it makes the immediate parent of the text node clickable to edit. Adding this attribute to an ancestor makes that ancestor the clickable target instead:

```html
<article data-datocms-content-link-group>
  <!-- product.title contains stega encoding -->
  <h2>{product.title}</h2>
  <p>${product.price}</p>
</article>
```

Here, clicking anywhere in the `<article>` opens the editor, rather than requiring users to click precisely on the `<h2>`.

**Important:** A group should contain only one stega-encoded source. If multiple stega strings resolve to the same group, the library logs a collision warning and only the last URL wins.

#### `data-datocms-content-link-boundary`

Stops the upward DOM traversal that looks for a `data-datocms-content-link-group`, making the element where stega was found the clickable target instead. This creates an independent editable region that won't merge into a parent group (see [How group and boundary resolution works](#how-group-and-boundary-resolution-works) below for details):

```html
<div data-datocms-content-link-group>
  <!-- page.title contains stega encoding → resolves to URL A -->
  <h1>{page.title}</h1>
  <section data-datocms-content-link-boundary>
    <!-- page.author contains stega encoding → resolves to URL B -->
    <span>{page.author}</span>
  </section>
</div>
```

Without the boundary, clicking `page.author` would open URL A (the outer group). With the boundary, the `<span>` becomes the clickable target opening URL B.

The boundary can also be placed directly on the element that contains the stega text:

```html
<div data-datocms-content-link-group>
  <!-- page.title contains stega encoding → resolves to URL A -->
  <h1>{page.title}</h1>
  <!-- page.author contains stega encoding → resolves to URL B -->
  <span data-datocms-content-link-boundary>{page.author}</span>
</div>
```

Here, the `<span>` has the boundary and directly contains the stega text, so the `<span>` itself becomes the clickable target (since the starting element and the boundary element are the same).

### Library-managed attributes

These attributes are added automatically by the library during DOM stamping. You do not need to add them yourself, but you can target them in CSS or JavaScript.

#### `data-datocms-contains-stega`

Added to elements whose text content contains stega-encoded invisible characters. This attribute is only present when `stripStega` is `false` (the default), since with `stripStega: true` the characters are removed entirely. Useful for CSS workarounds — the zero-width characters can sometimes cause unexpected letter-spacing or text overflow:

```css
[data-datocms-contains-stega] {
  letter-spacing: 0 !important;
}
```

#### `data-datocms-auto-content-link-url`

Added automatically to elements that the library has identified as editable targets (through stega decoding and group/boundary resolution). Contains the resolved edit URL.

This is the automatic counterpart to the developer-specified `data-datocms-content-link-url`. The library adds `data-datocms-auto-content-link-url` wherever it can extract an edit URL from stega encoding, while `data-datocms-content-link-url` is needed for non-text fields (booleans, numbers, dates, etc.) where stega encoding cannot be embedded. Both attributes are used by the click-to-edit overlay system to determine which elements are clickable and where they link to.

## How group and boundary resolution works

When the library encounters stega-encoded content inside an element, it walks up the DOM tree from that element:

1. If it finds a `data-datocms-content-link-group`, it stops and stamps **that** element as the clickable target.
2. If it finds a `data-datocms-content-link-boundary`, it stops and stamps the **starting element** as the clickable target — further traversal is prevented.
3. If it reaches the root without finding either, it stamps the **starting element**.

Here are some concrete examples to illustrate:

**Example 1: Nested groups**

```html
<div data-datocms-content-link-group>
  <!-- page.title contains stega encoding → resolves to URL A -->
  <h1>{page.title}</h1>
  <div data-datocms-content-link-group>
    <!-- page.subtitle contains stega encoding → resolves to URL B -->
    <p>{page.subtitle}</p>
  </div>
</div>
```

- **`page.title`**: walks up from `<h1>`, finds the outer group → the **outer `<div>`** becomes clickable (opens URL A).
- **`page.subtitle`**: walks up from `<p>`, finds the inner group first → the **inner `<div>`** becomes clickable (opens URL B). The outer group is never reached.

Each nested group creates an independent clickable region. The innermost group always wins for its own content.

**Example 2: Boundary preventing group propagation**

```html
<div data-datocms-content-link-group>
  <!-- page.title contains stega encoding → resolves to URL A -->
  <h1>{page.title}</h1>
  <section data-datocms-content-link-boundary>
    <!-- page.author contains stega encoding → resolves to URL B -->
    <span>{page.author}</span>
  </section>
</div>
```

- **`page.title`**: walks up from `<h1>`, finds the outer group → the **outer `<div>`** becomes clickable (opens URL A).
- **`page.author`**: walks up from `<span>`, hits the `<section>` boundary → traversal stops, the **`<span>`** itself becomes clickable (opens URL B). The outer group is not reached.

**Example 3: Boundary inside a group**

```html
<div data-datocms-content-link-group>
  <!-- page.description contains stega encoding → resolves to URL A -->
  <p>{page.description}</p>
  <div data-datocms-content-link-boundary>
    <!-- page.footnote contains stega encoding → resolves to URL B -->
    <p>{page.footnote}</p>
  </div>
</div>
```

- **`page.description`**: walks up from `<p>`, finds the outer group → the **outer `<div>`** becomes clickable (opens URL A).
- **`page.footnote`**: walks up from `<p>`, hits the boundary → traversal stops, the **`<p>`** itself becomes clickable (opens URL B). The outer group is not reached.

**Example 4: Multiple stega strings without groups (collision warning)**

```html
<p>
  <!-- Both product.name and product.tagline contain stega encoding -->
  {product.name} {product.tagline}
</p>
```

Both stega-encoded strings resolve to the same `<p>` element. The library logs a console warning and the last URL wins. To fix this, wrap each piece of content in its own element:

```html
<p>
  <span>{product.name}</span>
  <span>{product.tagline}</span>
</p>
```

## Structured Text fields

Structured Text fields require special attention because of how stega encoding works within them:

- The DatoCMS API encodes stega information inside a single `<span>` within the structured text output. Without any configuration, only that small span would be clickable.
- Structured Text fields can contain **embedded blocks** and **inline records**, each with their own editing URL that should open a different record in the editor.

Here are the rules to follow:

### Rule 1: Always wrap the Structured Text component in a group

This makes the entire structured text area clickable, instead of just the tiny stega-encoded span:

```astro
---
import { StructuredText } from '@datocms/astro/StructuredText';
---

<div data-datocms-content-link-group>
  <StructuredText data={page.content} />
</div>
```

### Rule 2: Wrap embedded blocks, inline blocks, and inline records in a boundary

Embedded blocks, inline blocks, and inline records have their own edit URL (pointing to the block/record). Without a boundary, clicking them would bubble up to the parent group and open the structured text field editor instead. Add `data-datocms-content-link-boundary` to prevent them from merging into the parent group.

**Note:** Record links (`renderLinkToRecord`) don't need a boundary. They are typically just `<a>` tags wrapping text that already belongs to the surrounding structured text. Since they don't introduce a separate editing target, there's no URL collision and no reason to isolate them from the parent group — clicking a record link's text should open the structured text field editor, just like clicking any other text in the field.

Add `data-datocms-content-link-boundary` to the root element of each component that renders a block, inline block, or inline record. For example, given a `Cta` block component:

```astro
---
// src/components/Cta.astro
const { block } = Astro.props;
---

<div data-datocms-content-link-boundary>
  <a href={block.url}>{block.label}</a>
</div>
```

For inline blocks, use a `<span>` instead of a `<div>` since they appear within inline content:

```astro
---
// src/components/NewsletterSignup.astro
const { block } = Astro.props;
---

<span data-datocms-content-link-boundary>
  <input type="email" placeholder={block.placeholder} />
</span>
```

Same for inline records:

```astro
---
// src/components/InlineTeamMember.astro
const { record } = Astro.props;
---

<span data-datocms-content-link-boundary>
  <a href={`/team/${record.slug}`}>{record.name}</a>
</span>
```

Then use these components directly in your structured text rendering:

```astro
---
import { StructuredText } from '@datocms/astro/StructuredText';
import Cta from '~/components/Cta.astro';
import NewsletterSignup from '~/components/NewsletterSignup.astro';
import InlineTeamMember from '~/components/InlineTeamMember.astro';
---

<div data-datocms-content-link-group>
  <StructuredText
    data={page.content}
    blockComponents={{
      CtaRecord: Cta,
    }}
    inlineBlockComponents={{
      NewsletterSignupRecord: NewsletterSignup,
    }}
    inlineRecordComponents={{
      TeamMemberRecord: InlineTeamMember,
    }}
  />
</div>
```

With this setup:

- Clicking the main text (paragraphs, headings, lists) opens the **structured text field editor**
- Clicking an embedded block, inline block, or inline record opens **that block/record's editor**

## Low-level utilities

The `@datocms/content-link` package provides low-level utilities for working with stega-encoded content:

```astro
---
import { decodeStega, stripStega } from '@datocms/astro/ContentLink';

const text = 'Some content with invisible stega encoding';

// Extract editing metadata from stega-encoded text
const metadata = decodeStega(text);
// Returns: { origin: string, href: string } | null

// Remove stega encoding to get clean text
const cleanText = stripStega(text);
// Returns: 'Some content with invisible stega encoding' (without zero-width characters)
---
```

**Use cases:**

- **Meta tags and social sharing**: Use `stripStega()` to clean text before adding to `<meta>` tags
- **Programmatic text processing**: Remove invisible characters before string operations
- **Debugging**: Use `decodeStega()` to inspect what editing URLs are embedded in content

### `stripStega()` works with any data type

The `stripStega()` function handles strings, objects, arrays, and primitives:

```js
// Works with strings
stripStega('Hello‎World'); // "HelloWorld"

// Works with objects
stripStega({ name: 'John‎', age: 30 });

// Works with nested structures - removes ALL stega encodings
stripStega({
  users: [
    { name: 'Alice‎', email: 'alice‎.com' },
    { name: 'Bob‎', email: 'bob‎.co' },
  ],
});

// Works with arrays
stripStega(['First‎', 'Second‎', 'Third‎']);
```

## Troubleshooting

### Click-to-edit overlays not appearing

If you don't see any overlays when holding Alt/Option:

1. **Check that Content Link is enabled in your query:**

   ```ts
   const result = await executeQuery(query, {
     contentLink: 'v1', // Must be present
     baseEditingUrl: 'https://your-project.admin.datocms.com', // Must be present
   });
   ```

2. **Verify the component is loaded:**
   Check your browser console for any errors. The component should initialize silently.

3. **Ensure you're viewing draft content:**
   Content Link metadata is only included for draft content. Make sure you're using an API token with draft access and have `includeDrafts: true` in your query options if needed.

4. **Check for conflicting CSS:**
   The overlays use z-index and absolute positioning. Make sure your site's CSS isn't hiding them.

### Navigation not syncing in Web Previews plugin

If navigation isn't syncing between your preview and the DatoCMS interface:

1. **Verify you're running inside the plugin:**
   The bidirectional connection only works when your preview is loaded inside the Web Previews plugin's iframe.

2. **Check browser console:**
   Look for any errors related to the iframe communication. The component uses `postMessage` for communication.

3. **Ensure the component is in your layout:**
   The `<ContentLink />` component should be in a layout that persists across page navigations.

### Content inside StructuredText not clickable

If structured text content isn't opening the editor:

1. **Wrap with `data-datocms-content-link-group`:**
   See [Rule 1: Always wrap the Structured Text component in a group](#rule-1-always-wrap-the-structured-text-component-in-a-group).

2. **Add boundaries for embedded blocks and inline records:**
   See [Rule 2: Wrap embedded blocks and inline records in a boundary](#rule-2-wrap-embedded-blocks-and-inline-records-in-a-boundary).

3. **Check for `data-datocms-content-link-boundary` blocking clicks:**
   Make sure you haven't accidentally added a boundary attribute that's preventing the click from reaching the group.

4. **Verify stega encoding is present:**
   Use the browser inspector to check if the structured text HTML contains zero-width characters (stega encoding). If not, check your query options.

### Layout issues caused by stega encoding

The invisible zero-width characters can cause unexpected letter-spacing or text breaking out of containers. To fix this, either use `stripStega: true`, or use CSS: `[data-datocms-contains-stega] { letter-spacing: 0 !important; }`. This attribute is automatically added to elements with stega-encoded content when `stripStega: false` (the default). See [`data-datocms-contains-stega`](#data-datocms-contains-stega) for more details.

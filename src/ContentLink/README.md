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
- [StructuredText integration](#structuredtext-integration)
  - [Edit groups with `data-datocms-content-link-group`](#edit-groups-with-data-datocms-content-link-group)
  - [Edit boundaries with `data-datocms-content-link-boundary`](#edit-boundaries-with-data-datocms-content-link-boundary)
- [Manual overlays](#manual-overlays)
  - [Using `data-datocms-content-link-url`](#using-data-datocms-content-link-url)
  - [Using `data-datocms-content-link-source`](#using-data-datocms-content-link-source)
- [Low-level utilities](#low-level-utilities)
  - [`stripStega()` works with any data type](#stripstega-works-with-any-data-type)
- [Troubleshooting](#troubleshooting)
  - [Click-to-edit overlays not appearing](#click-to-edit-overlays-not-appearing)
  - [Navigation not syncing in Web Previews plugin](#navigation-not-syncing-in-web-previews-plugin)
  - [Content inside StructuredText not clickable](#content-inside-structuredtext-not-clickable)

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

The `contentLink: 'v1'` option enables stega encoding, which embeds invisible metadata into text fields. The `baseEditingUrl` tells DatoCMS where your project is located so edit URLs can be generated correctly.

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

| Prop                | Type                                             | Default | Description                                                                                                                               |
| ------------------- | ------------------------------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `enableClickToEdit` | `boolean \| { scrollToNearestTarget?: boolean }` | -       | Enable click-to-edit overlays on mount. Use `true` for immediate activation, or pass options like `{ scrollToNearestTarget: true }`       |
| `stripStega`        | `boolean`                                        | `false` | Strip stega-encoded invisible characters from text content. When `true`, encoding is permanently removed (prevents controller recreation) |

## StructuredText integration

When working with DatoCMS's [Structured Text fields](https://www.datocms.com/docs/structured-text/dast), you may want more control over which areas are clickable.

### Edit groups with `data-datocms-content-link-group`

By default, only the specific element containing stega-encoded data is clickable. For Structured Text fields, this might be a single `<span>` inside a paragraph, which creates a poor editing experience.

Use the `data-datocms-content-link-group` attribute to make a larger area clickable:

```astro
---
import { StructuredText } from '@datocms/astro/StructuredText';
---

<!-- Make the entire structured text area clickable -->
<div data-datocms-content-link-group>
  <StructuredText data={content.structuredTextField} />
</div>
```

Now editors can click anywhere within the structured text content to open the field editor.

### Edit boundaries with `data-datocms-content-link-boundary`

When Structured Text contains embedded blocks or inline records, you typically want:

- Main text content (paragraphs, headings, lists) to open the Structured Text field editor
- Embedded blocks to open their own specific record editor

Use `data-datocms-content-link-boundary` to prevent click events from bubbling up past a certain point:

```astro
---
import { StructuredText } from '@datocms/astro/StructuredText';
import BlogPost from './BlogPost.astro';
---

<div data-datocms-content-link-group>
  <StructuredText
    data={content.structuredTextField}
    components={{
      renderBlock: ({ record }) => {
        // This boundary prevents the block from using the parent group
        return (
          <div data-datocms-content-link-boundary>
            <BlogPost data={record} />
          </div>
        );
      },
    }}
  />
</div>
```

This ensures:

- Clicking the main text opens the Structured Text field editor
- Clicking an embedded block opens that specific block's editor

## Manual overlays

In some cases, you may want to manually create click-to-edit overlays for content that doesn't have stega encoding.

### Using `data-datocms-content-link-url`

You can add the `data-datocms-content-link-url` attribute with a DatoCMS editing URL:

```graphql
query {
  product {
    id
    price
    isActive
    inStock
    _editingUrl
  }
}
```

```astro
<div>
  <span data-datocms-content-link-url={product._editingUrl}>
    ${product.price}
  </span>

  <span data-datocms-content-link-url={product._editingUrl}>
    {product.inStock ? 'In Stock' : 'Out of Stock'}
  </span>
</div>
```

### Using `data-datocms-content-link-source`

For elements without visible stega-encoded content, use the [`data-datocms-content-link-source`](https://github.com/datocms/content-link?tab=readme-ov-file#stamping-elements-via-data-datocms-content-link-source) attribute to attach stega metadata directly:

```astro
<!-- product.asset.video.alt contains stega-encoded info -->
<video
  src={product.asset.video.url}
  data-datocms-content-link-source={product.asset.video.alt}
  controls
/>
```

This is useful for structural elements like `<video>`, `<audio>`, or `<iframe>` where stega encoding in visible text would be problematic.

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

   ```astro
   <div data-datocms-content-link-group>
     <StructuredText data={content.body} />
   </div>
   ```

2. **Check for `data-datocms-content-link-boundary` blocking clicks:**
   Make sure you haven't accidentally added a boundary attribute that's preventing the click from reaching the group.

3. **Verify stega encoding is present:**
   Use the browser inspector to check if the structured text HTML contains zero-width characters (stega encoding). If not, check your query options.

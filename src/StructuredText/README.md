# Structured text

`<StructuredText />` is an Astro component that you can use to render the value contained inside a DatoCMS [Structured Text field type](https://www.datocms.com/docs/structured-text/dast).

### Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Setup](#setup)
- [Basic usage](#basic-usage)
- [Customization](#customization)
  - [Custom components for blocks](#custom-components-for-blocks)
  - [Override default rendering of nodes](#override-default-rendering-of-nodes)
- [Props](#props)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### Setup

Import the component like this:

```js
import { StructuredText } from '@datocms/astro/StructuredText';
```

## Basic usage

```astro
---
import { StructuredText } from '@datocms/astro/StructuredText';
import { executeQuery } from '@datocms/cda-client';

const query = gql`
  query {
    blogPost {
      title
      content {
        value
      }
    }
  }
`;

const { blogPost } = await executeQuery(query, { token: '<YOUR-API-TOKEN>' });
---

<article>
  <h1>{data.blogPost.title}</h1>
  <StructuredText data={data.blogPost.content} />
</article>
```

## Customization

The `<StructuredText />` component comes with a set of default components that are use to render all the nodes present in [DatoCMS Dast trees](https://www.datocms.com/docs/structured-text/dast). These default components are enough to cover most of the simple cases.

You need to use custom components in the following cases:

- you have to render blocks, inline items or item links: there's no conventional way of rendering theses nodes, so you must create and pass custom components;
- you need to render a conventional node differently (e.g. you may want a custom render for blockquotes)

### Custom components for blocks

Here is an example using custom components for blocks, inline and item links. Take a look at the [test fixtures](https://github.com/datocms/datocms-svelte/tree/main/src/lib/components/StructuredText/__tests__/__fixtures__) to see examples on how to implement these components.

```astro
---
import { isBlock, isInlineItem, isItemLink } from 'datocms-structured-text-utils';
import { StructuredText } from '@datocms/astro/StructuredText';

import Block from '~/components/Block/index.astro';
import InlineItem from '~/components/InlineItem/index.astro';
import ItemLink from '~/components/ItemLink/index.astro';

const query = gql`
  query {
    blogPost {
      title
      content {
        value
        links {
          __typename
          ... on TeamMemberRecord {
            id
            firstName
            slug
          }
        }
        blocks {
          __typename
          ... on ImageRecord {
            id
            image {
              responsiveImage(imgixParams: { fit: crop, w: 300, h: 300, auto: format }) {
                srcSet
                webpSrcSet
                sizes
                src
                width
                height
                aspectRatio
                alt
                title
                base64
              }
            }
          }
        }
      }
    }
  }
`;

const { blogPost } = await executeQuery(query, { token: '<YOUR-API-TOKEN>' });
---

<article>
  <h1>{blogPost.title}</h1>
  <StructuredText
    data={blogPost.content}
    components={[
      [isInlineItem, InlineItem],
      [isItemLink, ItemLink],
      [isBlock, Block],
    ]}
  />
</article>
```

### Override default rendering of nodes

`<StructuredText />` automatically renders all nodes (except for `inline_item`, `item_link` and `block`) using a set of default components, that you might want to customize. For example:

- For `heading` nodes, you might want to add an anchor;
- For `code` nodes, you might want to use a custom syntax highlighting component;

In this case, you can easily override default rendering rules with the `components` props.

```astro
---
import { isHeading } from 'datocms-structured-text-utils';
import HeadingWithAnchorLink from '~/components/HeadingWithAnchorLink/index.astro';
---

<StructuredText data={blogPost.content} components={[[isHeading, HeadingWithAnchorLink]]} />
```

## Props

| prop       | type                                                                                                                     | required                                                                  | description                                                                                      | default |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------- |
| data       | `StructuredText \| DastNode`                                                                                             | :white_check_mark:                                                        | The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from DatoCMS |         |
| components | [`PredicateComponentTuple[] \| null`](https://github.com/datocms/astro-datocms/blob/main/src/StructuredText/types.ts#L6) | Only required if data contain `block`, `inline_item` or `item_link` nodes | Array of tuples formed by a predicate function and custom component                              | `[]`    |

# Structured text

`<StructuredText />` is an Astro component that you can use to render the value contained inside a DatoCMS [Structured Text field type](https://www.datocms.com/docs/structured-text/dast).

### Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Setup](#setup)
- [Basic usage](#basic-usage)
- [Customization](#customization)
  - [Custom components for blocks, inline records or links to records](#custom-components-for-blocks-inline-records-or-links-to-records)
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

- you have to render blocks, inline records or links to records: there's no conventional way of rendering theses nodes, so you must create and pass custom components;
- you need to render a conventional node differently (e.g. you may want a custom render for blockquotes)

### Custom components for blocks, inline records or links to records

- Astro components passed in `blockComponents` will be used to render blocks and will receive a `block` prop containing the actual block data.
- Astro components passed in `inlineItemComponents` will be used to render inline records and will receive a `record` prop containing the actual record.
- Astro components passed in `itemLinkComponents` will be used to render links to records and will receive the following props: `node` (the actual `'inlineItem'` node), `record` (the record linked to the node), and `attrs` (the custom attributes for the link specified by the node).

```astro
---
import { StructuredText } from '@datocms/astro/StructuredText';

import Cta from '~/components/Cta/index.astro';
import NewsletterSignup from '~/components/NewsletterSignup/index.astro';

import InlineTeamMember from '~/components/InlineTeamMember/index.astro';
import LinkToTeamMember from '~/components/LinkToTeamMember/index.astro';

const query = gql`
  query {
    blogPost {
      title
      content {
        value
        blocks {
          ... on RecordInterface {
            id
            __typename
          }
          ... on CtaRecord {
            label
            url
          }
          ... on NewsletterSignupRecord {
            title
          }
        }
        links {
          ... on RecordInterface {
            id
            __typename
          }
          ... on TeamMemberRecord {
            firstName
            slug
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
    blockComponents={{
      CtaRecord: Cta,
      NewsletterSignupRecord: NewsletterSignup,
    }}
    inlineItemComponents={{
      TeamMemberRecord: InlineTeamMember,
    }}
    itemLinkComponents={{
      TeamMemberRecord: LinkToTeamMember,
    }}
  />
</article>
```

### Override default rendering of nodes

`<StructuredText />` automatically renders all nodes (except for `inline_item`, `item_link` and `block`) using a set of default components, that you might want to customize. For example:

- For `heading` nodes, you might want to add an anchor;
- For `code` nodes, you might want to use a custom syntax highlighting component;

In this case, you can easily override default rendering rules with the `overrides` prop.

```astro
---
import { isHeading } from 'datocms-structured-text-utils';
import HeadingWithAnchorLink from '~/components/HeadingWithAnchorLink/index.astro';
import Code from '~/components/Code/index.astro';
---

<StructuredText
  data={blogPost.content}
  components={{
    heading: HeadingWithAnchorLink,
    code: Code,
  }}
/>
```

## Props

| prop                 | type                             | required           | description                                                                                                             |
| -------------------- | -------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| data                 | `StructuredText \| DastNode`     | :white_check_mark: | The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from DatoCMS                        |
| blockComponents      | `Record<string, AstroComponent>` |                    | An object in which the keys are the `__typename` of the blocks to be rendered, and the values are the Astro components  |
| itemLinkComponents   | `Record<string, AstroComponent>` |                    | An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components |
| inlineItemComponents | `Record<string, AstroComponent>` |                    | An object in which the keys are the `__typename` of the records to be rendered, and the values are the Astro components |
| overrides            | `Record<string, AstroComponent>` |                    | An object in which the keys are the types of DAST nodes to override, and the values are the Astro components            |

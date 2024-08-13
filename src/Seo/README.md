# Social share, SEO and Favicon meta tags

Just like the image component, `<Seo />` is a component specially designed to work seamlessly with DatoCMS’s [`_seoMetaTags` and `faviconMetaTags` GraphQL queries](https://www.datocms.com/docs/content-delivery-api/seo) so that you can handle proper SEO in your pages.

You can use `<Seo />` in your pages, and it will inject title, meta and link tags in the document's `<head>` tag.

### Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage](#usage)
- [Example](#example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

`<Seo />`'s `data` prop takes an array of `Tag`s in the exact form they're returned by the following [DatoCMS GraphQL API](https://www.datocms.com/docs/content-delivery-api/seo) queries:

- `_seoMetaTags` query on any record, or
- `faviconMetaTags` on the global `_site` object.

## Example

Here is an example:

```astro
---
import { Seo } from '@datocms/astro/Seo';
import { executeQuery } from '@datocms/cda-client';

const query = gql`
  query {
    page: homepage {
      title
      seo: _seoMetaTags {
        attributes
        content
        tag
      }
    }
    site: _site {
      favicon: faviconMetaTags {
        attributes
        content
        tag
      }
    }
  }
`;

const result = await executeQuery(query, { token: '<YOUR-API-TOKEN>' });
---

<Seo data={[...result.page.seo, ...result.site.favicon]} />
```

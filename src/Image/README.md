# Progressive responsive image

`<Image>` is a TypeScript-ready Astro component specially designed to work seamlessly with DatoCMS’s [`responsiveImage` GraphQL query](https://www.datocms.com/docs/content-delivery-api/uploads#responsive-images) which optimizes image loading for your websites.

### Out-of-the-box features

- Completely native, with no JavaScript footprint
- Offers optimized version of images for browsers that support WebP/AVIF format
- Generates multiple smaller images so smartphones and tablets don’t download desktop-sized images
- Efficiently lazy loads images to speed initial page load and save bandwidth
- Holds the image position so your page doesn’t jump while images load
- Uses either blur-up or background color techniques to show a preview of the image while it loads

### Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Setup](#setup)
- [Usage](#usage)
- [Example](#example)
- [The `ResponsiveImage` object](#the-responsiveimage-object)
- [`<Image />`](#image-)
  - [Props](#props)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### Setup

You can import the component like this:

```js
import { Image } from '@datocms/astro/Image';
```

## Usage

1. Use `<Image>` in place of the regular `<img />` tag
2. Write a GraphQL query to your DatoCMS project using the [`responsiveImage` query](https://www.datocms.com/docs/content-delivery-api/images-and-videos#responsive-images)

The GraphQL query returns multiple thumbnails with optimized compression. The components automatically set up the "blur-up" effect as well as lazy loading of images further down the screen.

## Example

Here is a minimal starting point:

```astro
---
import { Image } from '@datocms/astro/Image';
import { executeQuery } from '@datocms/cda-client';

const query = gql`
  query {
    blogPost {
      title
      cover {
        responsiveImage(imgixParams: { fit: crop, w: 300, h: 300, auto: format }) {
          # always required
          src
          width
          height
          # not required, but strongly suggested!
          alt
          title
          # blur-up placeholder, JPEG format, base64-encoded, or...
          base64
          # background color placeholder
          bgColor
          # you can omit sizes if you explicitly pass the sizes prop to the image component
          sizes
        }
      }
    }
  }
`;

const { blogPost } = await executeQuery(query, { token: '<YOUR-API-TOKEN>' });
---

<Image data={blogPost.cover.responsiveImage} />
```

## The `ResponsiveImage` object

The `data` prop of both components expects an object with the same shape as the one returned by `responsiveImage` GraphQL call. It's up to you to make a GraphQL query that will return the properties you need for a specific use of the `<Image>` component.

- The minimum required properties for `data` are: `src`, `width` and `height`;
- `alt` and `title`, while not mandatory, are all highly suggested, so remember to use them!
- If you don't request `srcSet`, the component will auto-generate an `srcset` based on `src` + the `srcSetCandidates` prop (it can help reducing the GraphQL response size drammatically when many images are returned);
- We strongly to suggest to always specify [`{ auto: format }`](https://docs.imgix.com/apis/rendering/auto/auto#format) in your `imgixParams`, instead of requesting `webpSrcSet`, so that you can also take advantage of more performant optimizations (AVIF), without increasing GraphQL response size;
- If you request both the `bgColor` and `base64` property, the latter will take precedence, so just avoid querying both fields at the same time, as it will only make the GraphQL response bigger :wink:;
- You can avoid requesting `sizes` and directly pass a `sizes` prop to the component to reduce the GraphQL response size;

Here's a complete recap of what `responsiveImage` offers:

| property    | type    | required           | description                                                                                                                                                                                    |
| ----------- | ------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| src         | string  | :white_check_mark: | The `src` attribute for the image                                                                                                                                                              |
| width       | integer | :white_check_mark: | The width of the image                                                                                                                                                                         |
| height      | integer | :white_check_mark: | The height of the image                                                                                                                                                                        |
| alt         | string  | :x:                | Alternate text (`alt`) for the image (not required, but strongly suggested!)                                                                                                                   |
| title       | string  | :x:                | Title attribute (`title`) for the image (not required, but strongly suggested!)                                                                                                                |
| sizes       | string  | :x:                | The HTML5 `sizes` attribute for the image (omit it if you're already passing a `sizes` prop to the Image component)                                                                            |
| base64      | string  | :x:                | A base64-encoded thumbnail to offer during image loading                                                                                                                                       |
| bgColor     | string  | :x:                | The background color for the image placeholder (omit it if you're already requesting `base64`)                                                                                                 |
| srcSet      | string  | :x:                | The HTML5 `srcSet` attribute for the image (can be omitted, the Image component knows how to build it based on `src`)                                                                          |
| webpSrcSet  | string  | :x:                | The HTML5 `srcSet` attribute for the image in WebP format (deprecated, it's better to use the [`auto=format`](https://docs.imgix.com/apis/rendering/auto/auto#format) Imgix transform instead) |
| aspectRatio | float   | :x:                | The aspect ratio (width/height) of the image                                                                                                                                                   |

## `<Image />`

### Props

| prop             | type                     | default                            | required           | description                                                                                                                                          |
| ---------------- | ------------------------ | ---------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| data             | `ResponsiveImage` object |                                    | :white_check_mark: | The actual response you get from a DatoCMS `responsiveImage` GraphQL query \*\*\*\*                                                                  |
| pictureClass     | string                   | null                               | :x:                | Additional CSS class for the root `<picture>` tag                                                                                                    |
| pictureStyle     | CSS properties           | null                               | :x:                | Additional CSS rules to add to the root `<picture>` tag                                                                                              |
| imgClass         | string                   | null                               | :x:                | Additional CSS class for the `<img>` tag                                                                                                             |
| imgStyle         | CSS properties           | null                               | :x:                | Additional CSS rules to add to the `<img>` tag                                                                                                       |
| priority         | Boolean                  | false                              | :x:                | Disables lazy loading, and sets the image [fetchPriority](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/fetchPriority) to "high" |
| sizes            | string                   | undefined                          | :x:                | The HTML5 [`sizes`](https://web.dev/learn/design/responsive-images/#sizes) attribute for the image (will be used `data.sizes` as a fallback)         |
| usePlaceholder   | Boolean                  | true                               | :x:                | Whether the image should use a blurred image placeholder                                                                                             |
| srcSetCandidates | Array<number>            | [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4] | :x:                | If `data` does not contain `srcSet`, the candidates for the `srcset` attribute of the image will be auto-generated based on these width multipliers  |
| referrerPolicy   | string                   | `no-referrer-when-downgrade`       | :x:                | Defines which referrer is sent when fetching the image. Defaults to `no-referrer-when-downgrade` to give more useful stats in DatoCMS Project Usages |

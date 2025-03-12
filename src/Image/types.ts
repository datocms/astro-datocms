import type { JSX } from 'astro/jsx-runtime';

type StyleAttribute = JSX.HTMLAttributes['style'];
type StyleAttributeAsObject = Exclude<StyleAttribute, string>;

type Maybe<T> = T | null;

export type ResponsiveImageType = {
  /** A base64-encoded thumbnail to offer during image loading */
  base64?: Maybe<string>;
  /** The height of the image */
  height?: Maybe<number>;
  /** The width of the image */
  width: number;
  /** The aspect ratio (width/height) of the image */
  aspectRatio?: number;
  /** The HTML5 `sizes` attribute for the image */
  sizes?: Maybe<string>;
  /** The fallback `src` attribute for the image */
  src?: Maybe<string>;
  /** The HTML5 `srcSet` attribute for the image */
  srcSet?: Maybe<string>;
  /** The HTML5 `srcSet` attribute for the image in WebP format, for browsers that support the format */
  webpSrcSet?: Maybe<string>;
  /** The background color for the image placeholder */
  bgColor?: Maybe<string>;
  /** Alternate text (`alt`) for the image */
  alt?: Maybe<string>;
  /** Title attribute (`title`) for the image */
  title?: Maybe<string>;
};

export type ImageProps = {
  /** The actual response you get from a DatoCMS `responsiveImage` GraphQL query */
  data: ResponsiveImageType;
  /** Additional CSS class for the root <picture> tag */
  pictureClass?: string;
  /** Additional CSS rules to add to the root <picture> tag */
  pictureStyle?: StyleAttribute;
  /** Additional CSS class for the <img> tag */
  imgClass?: string;
  /** Additional CSS rules to add to the <img> tag */
  imgStyle?: StyleAttributeAsObject;
  /**
   * When true, the image will be considered high priority. Lazy loading is automatically disabled, and fetchpriority="high" is added to the image.
   * You should use the priority property on any image detected as the Largest Contentful Paint (LCP) element. It may be appropriate to have multiple priority images, as different images may be the LCP element for different viewport sizes.
   * Should only be used when the image is visible above the fold.
   **/
  priority?: boolean;
  /** Whether the component should use a blurred image placeholder */
  usePlaceholder?: boolean;
  /**
   * The HTML5 `sizes` attribute for the image
   *
   * Learn more about srcset and sizes:
   * -> https://web.dev/learn/design/responsive-images/#sizes
   * -> https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes
   **/
  sizes?: HTMLImageElement['sizes'];
  /**
   * If `data` does not contain `srcSet`, the candidates for the `srcset` of the image will be auto-generated based on these width multipliers
   *
   * Default candidate multipliers are [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4]
   **/
  srcSetCandidates?: number[];
  /**
   * Defines which referrer is sent when fetching the image
   * Read more: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#referrerpolicy
   *
   * Defaults to `no-referrer-when-downgrade` to give more useful stats in DatoCMS Project Usages
   **/
  referrerPolicy?: JSX.HTMLAttributeReferrerPolicy;
};

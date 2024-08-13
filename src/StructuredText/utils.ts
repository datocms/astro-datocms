import {
  type Block,
  type InlineItem,
  type ItemLink,
  type Node,
  RenderError,
  type StructuredText,
  isBlock,
  isBlockquote,
  isCode,
  isHeading,
  isInlineItem,
  isItemLink,
  isLink,
  isList,
  isListItem,
  isParagraph,
  isRoot,
  isSpan,
  isThematicBreak,
} from 'datocms-structured-text-utils';

import Blockquote from './nodes/Blockquote.astro';
import Code from './nodes/Code.astro';
import Heading from './nodes/Heading.astro';
import Link from './nodes/Link.astro';
import List from './nodes/List.astro';
import ListItem from './nodes/ListItem.astro';
import Paragraph from './nodes/Paragraph.astro';
import Root from './nodes/Root.astro';
import Span from './nodes/Span.astro';
import ThematicBreak from './nodes/ThematicBreak.astro';

import type { PredicateComponentTuple } from './types';

export const defaultComponents: PredicateComponentTuple[] = [
  [isParagraph, Paragraph],
  [isRoot, Root],
  [isSpan, Span],
  [isLink, Link],
  [isList, List],
  [isHeading, Heading],
  [isBlockquote, Blockquote],
  [isListItem, ListItem],
  [isThematicBreak, ThematicBreak],
  [isCode, Code],
];

export const throwRenderErrorForMissingComponent = (node: Node) => {
  if (isInlineItem(node)) {
    throw new RenderError(
      `The Structured Text document contains an 'inlineItem' node, but no component for rendering is specified!`,
      node,
    );
  }

  if (isItemLink(node)) {
    throw new RenderError(
      `The Structured Text document contains an 'itemLink' node, but no component for rendering is specified!`,
      node,
    );
  }

  if (isBlock(node)) {
    throw new RenderError(
      `The Structured Text document contains a 'block' node, but no component for rendering is specified!`,
      node,
    );
  }
};

export const throwRenderErrorForMissingBlock = (node: Block) => {
  throw new RenderError(
    `The Structured Text document contains a 'block' node, but cannot find a record with ID ${node.item} inside data.blocks!`,
    node,
  );
};

export const throwRenderErrorForMissingLink = (node: ItemLink | InlineItem) => {
  throw new RenderError(
    `The Structured Text document contains an 'itemLink' node, but cannot find a record with ID ${node.item} inside data.links!`,
    node,
  );
};

export const findBlock = (node: Block, blocks: StructuredText['blocks']) =>
  (blocks || []).find(({ id }) => id === node.item);

export const findLink = (node: ItemLink | InlineItem, links: StructuredText['links']) =>
  (links || []).find(({ id }) => id === node.item);

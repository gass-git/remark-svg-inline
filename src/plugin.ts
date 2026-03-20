import type { Plugin } from 'unified';
import type { Root, Image } from 'mdast';
import path from 'node:path';
import fs from 'node:fs';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';
import { optimize } from 'svgo';
import type { Output } from 'svgo';
import type { Options } from './types';

/**
 * Transforms image nodes that match the given suffix (default: .svg) into inline SVG.
 *
 * @param options - Plugin configuration
 * @param options.suffix - File extension to match (default: '.svg')
 * @param options.assetsDir - Optional base directory for resolving SVG paths (default: undefined)
 * @param options.wrapper - Optional HTML wrapper for the inline SVG (default: `<figure class="inline-svg"></figure>`)
 * @param options.svgo - Whether to optimize SVG using SVGO (default: true)
 */
const inlineSvg: Plugin<[Options], Root, Root> = ({
  suffix = '.svg',
  assetsDir = undefined,
  wrapper = '<figure class="inline-svg"></figure>',
  svgo = true,
}) => {
  return function transformer(tree: Root, file: VFile): void {
    visit(tree, 'image', (node, i, parent) => {
      if (!node.url?.endsWith(suffix) || !parent) return;

      try {
        const svgPath = resolvePath(assetsDir, node, path.dirname(file.history[0]));
        const svgString = processSvg(svgPath, svgo);

        parent.children[i] = {
          type: 'html',
          value: wrapper ? wrap(svgString, wrapper) : svgString,
        };
      } catch (error) {
        console.warn(error);
      }
    });
  };
};

/**
 * Reads an SVG file and optionally optimizes it with SVGO.
 */
function processSvg(path: string, svgo: boolean): string {
  const svgString = fs.readFileSync(path, 'utf8');

  return svgo ? optimizeSvg(svgString).data : svgString;
}

/**
 * Injects SVG markup into an HTML wrapper before its closing tag.
 */
function wrap(svgString: string, htmlWrapper: string): string {
  const i = htmlWrapper.lastIndexOf('</');

  if (i === -1) {
    throw new Error(`Invalid HTML wrapper`);
  }

  return htmlWrapper.slice(0, i) + svgString + htmlWrapper.slice(i);
}

/**
 * Resolves the final SVG file path based on:
 * 1) absolute URL → from project root
 * 2) `assetsDir` → relative to it
 * 3) fallback → relative to Markdown file directory
 */
function resolvePath(
  assetsDir: string | undefined,
  node: Image,
  markdownFileDir: string,
): string {
  if (path.isAbsolute(node.url)) {
    return path.resolve(process.cwd(), node.url);
  } else if (assetsDir) {
    return path.resolve(process.cwd(), assetsDir, node.url);
  } else {
    return path.resolve(markdownFileDir, node.url);
  }
}
/**
 * Optimizes SVG content using predefined SVGO plugins.
 */
function optimizeSvg(svgString: string): Output {
  return optimize(svgString, {
    plugins: ['preset-default', 'removeXMLNS', 'removeDimensions'],
  });
}

export { inlineSvg };

import type { Plugin } from 'unified';
import type { Root, Image } from 'mdast';
import path from 'node:path';
import fs from 'node:fs';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';
import { optimize } from 'svgo';
import type { Output } from 'svgo';
import type { Options } from './types';

const inlineSvg: Plugin<[Options], Root, Root> = ({
  suffix = '.svg',
  assetsDir = undefined,
  wrapper = '<figure class="inline-svg"></figure>',
  svgo = true,
}) => {
  const options: Options = { suffix, assetsDir, wrapper, svgo };

  return function transformer(tree: Root, file: VFile): void {
    visit(tree, 'image', (node, i, parent) => {
      if (!node.url?.endsWith(suffix) || !parent) return;

      const markdownFileDir = path.dirname(file.history[0]);

      try {
        const svgPath = resolvePath(options.assetsDir, node, markdownFileDir);
        const svgString = fs.readFileSync(svgPath, 'utf8');
        const svgStringToWrap = svgo ? optimizeSvg(svgString).data : svgString;

        parent.children[i] = {
          type: 'html',
          value: wrap(svgStringToWrap, wrapper),
        };
      } catch (error) {
        console.warn(error);
      }
    });
  };
};

function wrap(content: string, customHtmlWrapper: string): string {
  const i = customHtmlWrapper.lastIndexOf('</');
  const w = customHtmlWrapper;

  if (i === -1) {
    throw new Error(`Invalid HTML wrapper`);
  }

  return w.slice(0, i) + content + w.slice(i);
}

function resolvePath(assetsDir: string, node: Image, markdownFileDir: string): string {
  if (path.isAbsolute(node.url)) {
    // Treat as relative to project root.
    return path.resolve(process.cwd(), node.url);
  } else if (assetsDir) {
    // If path is not absolute, use the assets directory provided in options.
    return path.resolve(process.cwd(), assetsDir, node.url);
  } else {
    // Treat as relative to markdown file directory.
    return path.resolve(markdownFileDir, node.url);
  }
}

function optimizeSvg(svgString: string): Output {
  return optimize(svgString, {
    plugins: ['preset-default', 'removeXMLNS', 'removeDimensions'],
  });
}

export { inlineSvg };

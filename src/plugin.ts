import type { Plugin } from 'unified';
import type { Root, Image } from 'mdast';
import path from 'node:path';
import fs from 'node:fs';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';
import { optimize } from 'svgo';
import type { Output } from 'svgo';

type Options = {
  assetsDir: string | undefined;
  wrapper: string;
};

const inlineSvg: Plugin<[string?, string?], Root, Root> = (
  assetsDir = undefined,
  wrapper = `<figure class="inline-svg"></figure>`,
) => {
  const options: Options = { assetsDir, wrapper };

  return function transformer(tree: Root, file: VFile): void {
    visit(tree, 'image', (node: Image, index: number, parent: any | undefined) => {
      if (!node.url?.endsWith('.svg') || index == null || !parent) return;

      const markdownFileDir = path.dirname(file.history[0]);

      try {
        const svgPath = resolvePath(options, node, markdownFileDir);
        const svgString = fs.readFileSync(svgPath, 'utf8');
        const optimizedSvgString = optimizeSvg(svgString).data;

        parent.children[index] = {
          type: 'html',
          value: wrap(optimizedSvgString, wrapper),
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

function resolvePath(options: Options, node: Image, markdownFileDir: string): string {
  if (path.isAbsolute(node.url)) {
    // Treat as relative to project root.
    return path.resolve(process.cwd(), node.url);
  } else if (options.assetsDir) {
    // If path is not absolute, use the assets directory provided in options.
    return path.resolve(process.cwd(), options.assetsDir, node.url);
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

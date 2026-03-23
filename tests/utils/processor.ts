import { remark } from 'remark';
import remarkParse from 'remark-parse';
import { inlineSvg } from '../../src/plugin';
import type { Options } from '../../src/types';
import { VFile } from 'vfile';
import path from 'node:path';

function processMarkdown(md: string, options?: Options): Promise<VFile> {
  const processor = remark().use(remarkParse);

  if (options) {
    processor.use(inlineSvg, options);
  } else {
    processor.use(inlineSvg);
  }

  /**
   * Create a virtual file with markdown content and a file
   * path (used for resolving relative assets)
   */
  const Vfile = new VFile({
    value: md,
    path: path.resolve(__dirname, '../fixtures/input.md'),
  });

  return processor.process(Vfile);
}

export { processMarkdown };

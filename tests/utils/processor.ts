import { remark } from 'remark';
import remarkParse from 'remark-parse';
import { inlineSvg } from '../../src/plugin';
import type { Options } from '../../src/types';

function processMarkdown(md: string, options: Options | {} = {}) {
  return remark()
    .use(remarkParse)
    .use(inlineSvg, options)
    .process({ value: md, path: './tests/fixtures/alien.svg' });
}

export { processMarkdown };

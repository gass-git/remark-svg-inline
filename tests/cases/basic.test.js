import { processMarkdown } from '../utils/processor';
import { describe, it, expect } from 'vitest';

describe('inline svg - basic', () => {
  it('replaces svg image with inline svg', async () => {
    const file = await processMarkdown('![some svg](alien.svg)');
    expect(String(file)).toContain('<svg');
  });

  it('does not mutate non-svg images', async () => {
    const file = await processMarkdown('![some png](some.png)');
    expect(String(file)).toContain('![some png](some.png)');
  });
});

import { processMarkdown } from '../utils/processor';
import { describe, it, expect } from 'vitest';

describe('inline svg - basic', () => {
  it('replaces svg image with inline svg', async () => {
    const file = await processMarkdown('![some svg](alien.svg)');
    expect(String(file)).toContain('<svg');
  });

  it('does not mutate a non-svg image', async () => {
    const file = await processMarkdown('![some png](some.png)');
    expect(String(file)).toContain('![some png](some.png)');
  });

  it('optimizes svg if svgo is enabled', async () => {
    const file = await processMarkdown('![some svg](alien.svg)');
    const stringFile = String(file);

    expect(stringFile).not.toContain('<!--');
    expect(stringFile).not.toContain('<?xml');
    expect(stringFile).not.toContain('xmlns');
    expect(stringFile).not.toContain('height');
    expect(stringFile).not.toContain('width');
  });

  it('does not optimize svg if svgo is disabled', async () => {
    const file = await processMarkdown('![some svg](alien.svg)', { svgo: false });
    const stringFile = String(file);

    expect(stringFile).toContain('<!--');
    expect(stringFile).toContain('<?xml');
    expect(stringFile).toContain('xmlns');
    expect(stringFile).toContain('height');
    expect(stringFile).toContain('width');
  });
});

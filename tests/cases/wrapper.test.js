import { processMarkdown } from '../utils/processor';
import { describe, it, expect } from 'vitest';

describe('custom wrapper', () => {
  it('wraps svg content correctly', async () => {
    const file = await processMarkdown('![some svg](alien.svg)', {
      wrapper: `<div class="center-h"></div>`,
    });
    expect(String(file)).toContain('<div class="center-h"><svg');
  });

  it('does not wrap if wrapper option is an empty string', async () => {
    const file = await processMarkdown('![some svg](alien.svg)', { wrapper: '' });
    expect(String(file)).toContain('<svg');
  });
});

describe('default wrapper', () => {
  it('wraps svg content correctly', async () => {
    const file = await processMarkdown('![some svg](alien.svg)');
    expect(String(file)).toContain('<figure class="inline-svg"><svg');
  });
});

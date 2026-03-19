import { processMarkdown } from '../utils/processor';
import { describe, it, expect } from 'vitest';

describe('custom wrapper', async () => {
  it('wraps svg content correctly', async () => {
    const file = await processMarkdown('![some svg](alien.svg)', {
      wrapper: `<div class="center-h"></div>`,
    });
    expect(String(file)).toContain('<div class="center-h"><svg');
  });
});

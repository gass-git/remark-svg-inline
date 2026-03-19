import { processMarkdown } from '../utils/processor';
import { describe, it, expect, vi } from 'vitest';

describe('error handling', () => {
  it('warns if file is missing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await processMarkdown('![icon](missing.svg)');

    expect(warn).toHaveBeenCalled();
  });
});

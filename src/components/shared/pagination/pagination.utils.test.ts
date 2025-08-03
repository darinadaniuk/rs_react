import { describe, it, expect } from 'vitest';

import { getVisiblePages } from './pagination.utils';

describe('getVisiblePages', () => {
  it('should return all pages when total <= PAGES_TO_SHOW (3)', () => {
    expect(getVisiblePages(1, 1)).toEqual([1]);
    expect(getVisiblePages(2, 1)).toEqual([1, 2]);
    expect(getVisiblePages(3, 2)).toEqual([1, 2, 3]);
  });

  it('should not repeat page numbers or separators', () => {
    const result = getVisiblePages(7, 1);
    const hasDuplicates = new Set(result).size !== result.length;
    expect(hasDuplicates).toBe(false);
  });

  it('should not include separator if no skipped pages', () => {
    expect(getVisiblePages(5, 3)).toEqual([1, 2, 3, 4, 5]);
  });
});

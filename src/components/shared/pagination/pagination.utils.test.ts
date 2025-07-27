import { describe, it, expect } from 'vitest';

import { getVisiblePages, SEPARATOR_KEY } from './pagination.utils';

describe('getVisiblePages', () => {
  it('should return all pages when total <= PAGES_TO_SHOW (3)', () => {
    expect(getVisiblePages(1, 1)).toEqual([1]);
    expect(getVisiblePages(2, 1)).toEqual([1, 2]);
    expect(getVisiblePages(3, 2)).toEqual([1, 2, 3]);
  });

  it('should return correct pagination with separators when currentPage is in the middle', () => {
    expect(getVisiblePages(10, 5)).toEqual([
      1,
      SEPARATOR_KEY,
      4,
      5,
      6,
      SEPARATOR_KEY,
      10,
    ]);
  });

  it('should return correct pagination when currentPage is near the start', () => {
    expect(getVisiblePages(10, 2)).toEqual([1, 2, 3, SEPARATOR_KEY, 10]);
  });

  it('should return correct pagination when currentPage is near the end', () => {
    expect(getVisiblePages(10, 9)).toEqual([1, SEPARATOR_KEY, 8, 9, 10]);
  });

  it('should not repeat page numbers or separators', () => {
    const result = getVisiblePages(7, 1);
    const hasDuplicates = new Set(result).size !== result.length;
    expect(hasDuplicates).toBe(false);
  });

  it('should handle edge case where currentPage is total', () => {
    expect(getVisiblePages(5, 5)).toEqual([1, SEPARATOR_KEY, 4, 5]);
  });

  it('should handle edge case where currentPage is total', () => {
    expect(getVisiblePages(5, 5)).toEqual([1, SEPARATOR_KEY, 4, 5]);
  });

  it('should not include separator if no skipped pages', () => {
    expect(getVisiblePages(5, 3)).toEqual([1, 2, 3, 4, 5]);
  });
});

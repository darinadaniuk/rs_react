import { PAGES_TO_SHOW, SEPARATOR_KEY } from '@rs-react/constants';

export function getVisiblePages(
  total: number,
  currentPage: number,
): (number | typeof SEPARATOR_KEY)[] {
  const pages: (number | typeof SEPARATOR_KEY)[] = [];

  if (total <= PAGES_TO_SHOW) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  const half = Math.floor(PAGES_TO_SHOW / 2);
  let start = Math.max(2, currentPage - half);
  let end = Math.min(total - 1, currentPage + half);

  if (currentPage <= half + 1) {
    start = 2;
    end = PAGES_TO_SHOW - 1;
  }

  if (currentPage >= total - half) {
    start = total - (PAGES_TO_SHOW - 2);
    end = total - 1;
  }

  pages.push(1);

  if (start > 2) {
    pages.push(SEPARATOR_KEY);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total - 1) {
    pages.push(SEPARATOR_KEY);
  }

  pages.push(total);

  return pages;
}

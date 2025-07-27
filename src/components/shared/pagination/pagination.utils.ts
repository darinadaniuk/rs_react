const PAGES_TO_SHOW = 3;
export const SEPARATOR_KEY = 'separator';

export function getVisiblePages(
  total: number,
  currentPage: number
): (number | typeof SEPARATOR_KEY)[] {
  const pages: (number | typeof SEPARATOR_KEY)[] = [];

  if (total <= PAGES_TO_SHOW) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(total - 1, currentPage + 1);

    if (start > 2) {
      pages.push(SEPARATOR_KEY);
    }

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (end < total - 1) {
      pages.push(SEPARATOR_KEY);
    }

    pages.push(total);
  }

  return pages;
}

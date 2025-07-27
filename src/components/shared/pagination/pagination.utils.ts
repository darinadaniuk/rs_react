const PAGES_TO_SHOW = 3;
const PAGES_TO_SHOW_MIDDLE = Math.ceil(PAGES_TO_SHOW / 2);
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

    if (currentPage > PAGES_TO_SHOW_MIDDLE) {
      pages.push(SEPARATOR_KEY);
    }

    const middlePages = [currentPage - 1, currentPage, currentPage + 1].filter(
      (page) => page > 1 && page < total
    );

    for (const page of middlePages) {
      if (!pages.includes(page)) {
        pages.push(page);
      }
    }

    if (currentPage < total - 2) {
      pages.push(SEPARATOR_KEY);
    }

    pages.push(total);
  }

  return pages;
}

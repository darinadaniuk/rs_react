import { vi, describe, it, expect, beforeEach } from 'vitest';

import { getCards } from './cards-service';

const mockSuccessResponse = {
  info: { pages: 3 },
  results: [
    { id: 1, name: 'Rick Sanchez' },
    { id: 2, name: 'Morty Smith' },
  ],
};

describe('Cards service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch cards with search term and page', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockSuccessResponse),
    });

    global.fetch = mockFetch as unknown as typeof fetch;

    const data = await getCards('morty', 2);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character?name=morty&page=2'
    );
    expect(data).toEqual(mockSuccessResponse);
  });

  it('should fetch cards without search term', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockSuccessResponse),
    });

    global.fetch = mockFetch as unknown as typeof fetch;

    const data = await getCards();

    expect(mockFetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character?page=1'
    );
    expect(data).toEqual(mockSuccessResponse);
  });

  it('should throw an error on network failure', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));

    global.fetch = mockFetch as unknown as typeof fetch;
    await expect(getCards('rick', 1)).rejects.toThrow('Network error');
  });
});

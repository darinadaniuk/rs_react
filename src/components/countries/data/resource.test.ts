import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { normalize, createDataResource } from './resource';

describe('normalize', () => {
  it('should return empty result for non-object JSON root', () => {
    const result = normalize('[]');
    expect(result.countries).toEqual([]);
    expect(result.availableFields).toEqual([]);
  });

  it('should parse, sort, compute isoCode and latestPopulation, and list available fields', () => {
    const payload = JSON.stringify({
      Canada: {
        iso_code: 'CAN',
        country: 'Canada',
        data: [
          { year: 2021, population: 38300000 },
          { year: 2020, population: 38000000, methane: 1.2 },
        ],
      },
      France: [{ year: 2021, population: 67000000, iso_code: 'FRA', oil_co2: 12.3 }],
    });

    const { countries, availableFields } = normalize(payload);

    expect(countries.map((c) => c.name).sort()).toEqual(['Canada', 'France']);

    const ca = countries.find((c) => c.name === 'Canada');
    if (!ca) throw new Error('Canada not found');
    expect(ca.rows.map((r) => r.year)).toEqual([2020, 2021]);
    expect(ca.isoCode).toBe('CAN');
    expect(ca.latestPopulation).toBe(38300000);

    const fr = countries.find((c) => c.name === 'France');
    if (!fr) throw new Error('France not found');
    expect(fr.isoCode).toBe('FRA');
    expect(fr.latestPopulation).toBe(67000000);

    expect(availableFields).toEqual(['methane', 'oil_co2']);
  });
});

describe('createDataResource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should fetch, normalize, and return data via read()', async () => {
    const url = 'https://example.com/data.json';
    const payload = {
      Canada: { data: [{ year: 2021, population: 38300000, iso_code: 'CAN' }] },
    };
    type MockResponse = { ok: boolean; status: number; text: () => Promise<string> };
    const mockFetch = vi.fn(async (...args: unknown[]): Promise<MockResponse> => {
      void args.length;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify(payload),
      };
    });
    vi.stubGlobal('fetch', mockFetch as unknown as typeof fetch);

    const resource = createDataResource(url);

    let thrown: unknown;
    try {
      resource.read();
    } catch (e) {
      thrown = e;
    }
    expect(thrown instanceof Promise).toBe(true);

    await (thrown as Promise<unknown>);

    const data = resource.read();
    expect(data.countries.length).toBe(1);
    expect(data.countries[0].name).toBe('Canada');
    expect(data.countries[0].latestPopulation).toBe(38300000);
  });

  it('should throw an error from read() when the fetch response is not ok', async () => {
    const url = 'https://example.com/missing.json';
    type MockResponse = { ok: boolean; status: number; text: () => Promise<string> };
    const mockFetch = vi.fn(async (...args: unknown[]): Promise<MockResponse> => {
      void args.length;
      return {
        ok: false,
        status: 404,
        text: async () => '',
      };
    });
    vi.stubGlobal('fetch', mockFetch as unknown as typeof fetch);

    const resource = createDataResource(url);

    let suspender: unknown;
    try {
      resource.read();
    } catch (e) {
      suspender = e;
    }
    expect(suspender instanceof Promise).toBe(true);

    await (suspender as Promise<unknown>).catch(() => undefined);

    let err: unknown;
    try {
      resource.read();
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(Error);
    expect((err as Error).message).toContain('HTTP 404');
  });
});

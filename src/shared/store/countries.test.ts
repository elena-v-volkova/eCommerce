import { describe, expect, test } from 'vitest';

import {
  CountryName,
  SelectCountryRule,
  getCountryInfo,
  COUNTRIES,
} from './countries';

describe('getCountryInfo', () => {
  test.each([
    ['Russia', { code: 'RU', regex: /^\d{6}$/ }],
    ['Japan', { code: 'JP', regex: /^\d{3}-\d{4}$/ }],
    ['Canada', { code: 'CA', regex: /[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d/ }],
    [
      'UnitedKingdom',
      { code: 'GB', regex: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/ },
    ],
  ] as [CountryName, SelectCountryRule][])(
    'returns correct info for %s',
    (country, expected) => {
      const result = getCountryInfo(country);

      expect(result).toEqual({
        code: expected.code,
        regex: expect.any(RegExp),
      });
      expect(result!.regex.source).toBe(expected.regex.source);
    },
  );

  test('returns null for empty string', () => {
    expect(getCountryInfo('')).toBeNull();
  });

  test('COUNTRIES contains all expected keys', () => {
    expect(COUNTRIES).toEqual(
      expect.arrayContaining(['Russia', 'Japan', 'Canada', 'UnitedKingdom']),
    );
  });

  test('CountryName type is correct', () => {
    const testCountry: CountryName = 'Japan';

    expect(testCountry).toBeDefined();
  });

  test('throws error for unknown country', () => {
    expect(() => getCountryInfo('China')).toThrow();
  });
});

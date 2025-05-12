const COUNTRY_DEF: Record<string, string> = {
  UnitedStates: '{"code":"US","validate":"\\\\d{5}(-\\\\d{4})?"}',
  Canada: '{"code":"CA","validate":"[A-Za-z]\\\\d[A-Za-z] \\\\d[A-Za-z]\\\\d"}',
  Germany: '{"code":"DE","validate":"\\\\d{5}"}',
  France: '{"code":"FR","validate":"\\\\d{5}"}',
  UnitedKingdom:
    '{"code":"GB","validate":"[A-Z]{1,2}\\\\d[A-Z\\\\d]? \\\\d[A-Z]{2}"}',
  Japan: '{"code":"JP","validate":"\\\\d{3}-\\\\d{4}"}',
  Australia: '{"code":"AU","validate":"\\\\d{4}"}',
  Russia: '{"code":"RU","validate":"\\\\d{6}"}',
};

export type CountryName = keyof typeof COUNTRY_DEF;
export const COUNTRIES = Object.keys(COUNTRY_DEF);

interface SelectCountryRule {
  code: string;
  regex: RegExp;
}

export function getCountryInfo(country: string): SelectCountryRule | null {
  if (country === null) return null;
  const data: SelectCountryRule = JSON.parse(COUNTRY_DEF[country]);

  return {
    code: data.code,
    regex: new RegExp(data.regex),
  };
}

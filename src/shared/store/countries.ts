const COUNTRY_DEF: Record<string, string> = {
  Russia: '{"code":"RU","validate":"^\\\\d{6}$"}',
  Japan: '{"code":"JP","validate":"^\\\\d{3}-\\\\d{4}$"}',
  Canada: '{"code":"CA","validate":"[A-Za-z]\\\\d[A-Za-z] \\\\d[A-Za-z]\\\\d"}',
  UnitedKingdom:
    '{"code":"GB","validate":"^[A-Z]{1,2}\\\\d[A-Z\\\\d]? \\\\d[A-Z]{2}$"}',
};

export type CountryName = keyof typeof COUNTRY_DEF;
export const COUNTRIES = Object.keys(COUNTRY_DEF);

export interface SelectCountryRule {
  code: string;
  regex: RegExp;
}

export function getCountryInfo(country: string): SelectCountryRule | null {
  if (country === '') return null;
  const data = JSON.parse(COUNTRY_DEF[country]);

  return {
    code: data.code,
    regex: new RegExp(data.validate),
  };
}

const base_api_url = `https://disease.sh`;

export const CoronaRoutes = {
  global: `${base_api_url}/v2/all`,
  sortCountries: (sort: any[]) => `${base_api_url}/v2/countries?sort=${sort ? (Array.isArray(sort) ? sort.join(',') : sort) : "cases"}`,
  historical: (param: any) => `${base_api_url}/v2/historical/${param}`,
  country: (c: any) => `${base_api_url}/v2/countries/${c}`,
  newsTimeline: () => `https://2019ncov-api.now.sh/api/timeline`
};

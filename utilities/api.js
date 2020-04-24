const base_api_url = `https://corona.lmao.ninja`;
export const CoronaRoutes = {
    global: `${base_api_url}/v2/all`,
    sortCountries: (sort) => `${base_api_url}/v2/countries?sort=${sort ? (Array.isArray(sort) ? sort.join(',') : sort) : "cases"}`,
    historical: (param) => `${base_api_url}/v2/historical/${param}`,
    country: (c) => `${base_api_url}/v2/countries/${c}`
};
//# sourceMappingURL=api.js.map
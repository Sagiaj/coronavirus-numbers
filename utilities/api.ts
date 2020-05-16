const base_api_url = `https://disease.sh`;
const getFormattedDate = () => {
  let tenDaysMs = 84600000 * 10;
  let d = new Date(+new Date() - tenDaysMs);
  let mm: any = d.getMonth() + 1, dd: any = d.getDate(), yyyy: any = d.getFullYear();
  mm = mm < 10 ? ("0" + mm) : ("" + mm);
  dd = dd < 10 ? ("0" + dd) : ("" + dd);
  return `${yyyy}-${mm}-${dd}`;
}
export const CoronaRoutes = {
  global: `${base_api_url}/v2/all`,
  sortCountries: (sort: any[]) => `${base_api_url}/v2/countries?sort=${sort ? (Array.isArray(sort) ? sort.join(',') : sort) : "cases"}`,
  historical: (param: any) => `${base_api_url}/v2/historical/${param}`,
  country: (c: any) => `${base_api_url}/v2/countries/${c}`,
  newsTimeline: () => `https://newsapi.org/v2/everything?q="coronavirus%20reports"&from=${getFormattedDate()}&sortBy=publishedAt&apiKey=73dd82c7c6064a38917f99ba04e41183`
};

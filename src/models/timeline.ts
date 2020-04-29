export interface CountryHistoricalData {
  country: string;
  provinces: string[];
  timeline: CountryTimeline;
}

export interface CountryTimeline {
  cases: Cases;
  deaths: Cases;
  recovered: Cases;
}

export interface Cases {
  [key: string]: number;
}

export interface SeriesResults {
  country: string;
  cases: { data: Array<any> };
  deaths: { data: Array<any> };
  recovered: { data: Array<any> };
}

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

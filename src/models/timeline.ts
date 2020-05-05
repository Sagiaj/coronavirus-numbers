export interface DateValueRecord {
  [date: string]: number;
}

export interface CountryHistoricalData {
  country: string;
  provinces: string[];
  timeline: CountryTimeline;
}

export interface CountryTimeline {
  cases: TimelineProp;
  deaths: TimelineProp;
  recovered: TimelineProp;
  [key: string]: any;
}

export interface TimelineProp {
  [key: string]: { [key: string]: number }[];
}

export interface LineSeries {
  country: string;
  data: {
    [P in keyof CountryTimeline]: DateValueRecord[]
  }
}

export interface ColumnSeries {
  country: string;
  cases: Array<DateValueRecord>;
  deaths: Array<DateValueRecord>;
  recovered: Array<DateValueRecord>;
}

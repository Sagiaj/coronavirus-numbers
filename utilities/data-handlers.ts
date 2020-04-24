import { CountryTimeline } from "~/src/models/timeline";

export const transformTimelineToSeries = (_timeline: CountryTimeline, country: string) => ({ ...(country ? {country} : {}), data: Object.keys(_timeline.cases).map((date, i) => ({ date: date.slice(0, -3), cases: _timeline.cases[date]}) );

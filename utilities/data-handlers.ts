import { CountryTimeline, LineSeries, ColumnSeries } from "~/src/models/timeline";
import { Trie, TrieSearchResult } from "~/src/models/trie";

export const transformTimelineToSeries = (_timeline: CountryTimeline, country: string): LineSeries => {
  let countryFill = { ...(country ? {country} : {}) };
  let data = Object.keys(_timeline).reduce((ds: any, key) => ({ ...ds, 
    ...({ [key]: { data: Object.keys(_timeline[<keyof typeof _timeline>key]).map((date, i) => ({ date: date.slice(0, -3), [key]: _timeline[<keyof typeof _timeline>key][date] }) ) } }) 
  }), {});
  return { ...countryFill, ...data };
};

export const transformTimelineToGrowthSeries = (_timeline: CountryTimeline, country: string) => {
  let countryFill = { ...(country ? {country} : {}) };
  let growthSeries: any = {};
  let properties = Object.keys(_timeline)
  for (let property of properties) {
    growthSeries[property] = {data: []};
    let prevVal = 0;
    let i = 0;
    for (let date in _timeline[property]) {
      if (i !== 0) {
        growthSeries[property].data.push({ date: date.slice(0, -3), [property]: _timeline[property][date] - prevVal });
      }
      prevVal = _timeline[property][date];
      i++;
    }
  }
  return { ...countryFill, ...growthSeries };
}

export const groupSeriesByProp = (_lineSeries: LineSeries, prop: keyof CountryTimeline) => {
  _lineSeries.data[prop]
}

export const transformTimelineToRateSeries = (_timeline: CountryTimeline, country: string) => {
  let dates = Object.keys(_timeline.cases);
  let rateSeries: any= { country, data: [] };
  let ratio = 100;
  let prevRatio = ratio;
  let prevVal = _timeline.cases[dates[0]];
  for (let i = 1; i < dates.length; i++) {
    let val = _timeline.cases[dates[i]];
    ratio = (parseInt("" + val) / parseInt("" + prevVal)) * 100;
    rateSeries.data.push({date: dates[i].slice(0, -3), cases: Math.ceil((ratio / prevRatio) * 100 ) });
    prevVal = val;
    prevRatio = ratio;
  }
  return rateSeries;
}

export const parseStructureToTrie = (arr: Array<{[key:string]: any}>, keyIndicator: string, callback?: ((currentNode: any) => {})) => {
  const nester = keyIndicator.split('.');
  const trie: Trie = { isWord: false };

  for (let struct of arr) {
    let word = nester.reduce((a, key) => (a && a[key]) ? a[key] : "", struct).split('');
    let currentNode: Trie = trie;
    let char;

    while ((char = word.shift())) {
      char = char.toLowerCase();
      if (currentNode["child"] && currentNode["child"][char] !== undefined) {
        currentNode = currentNode["child"][char];
      } else {
        if (!currentNode["child"]) currentNode["child"] = {};
        currentNode["child"][char] = {};
        currentNode = currentNode["child"][char];
      }
    }
    currentNode["isWord"] = true;
    currentNode["context"] = struct;
    if (callback) {
      callback(currentNode);
    }
  }

  return trie;
};

export const findWordsByPrefix = (trie: Trie, prefix: string) => {
  let prefixArr = prefix.toLowerCase().split('');
  let currentNode: Trie = trie;
  let char;
  while ( (char = prefixArr.shift()) ) {
    if (!currentNode || !currentNode["child"]) return [];
    currentNode = currentNode["child"][char];
  }

  return findAllSubTrieWords(currentNode, prefix);
}

export const findAllSubTrieWords = (trie: Trie, prefix: string = ''): TrieSearchResult[] => {
  if (!trie) return [];
  let words: TrieSearchResult[] = [];
  const { child, context } = trie;
  if (trie.isWord) { words.push({ word: prefix, context }); }
  if (!child) return words;

  const { isWord: childIsWord, ...children } = child;
  let letters = Object.keys(children);
  let char;
  while ( (char = letters.shift()) ) {
    let appendedPrefix = prefix + char;
    words.push(...findAllSubTrieWords(children[char], appendedPrefix));
  }

  return words;
}

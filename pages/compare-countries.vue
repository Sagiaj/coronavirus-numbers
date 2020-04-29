<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <v-card style="max-height: 80vh; overflow-y: scroll;">
          <v-container class="py-0">
            <v-row
              align="center"
              justify="start"
            >
              <v-col
                v-for="(selection, i) in selections"
                :key="selection.country"
                class="shrink"
              >
                <v-chip
                  :disabled="loadingData"
                  close
                  @click:close="selected.splice(i, 1); removeCountryFromChart(selection, i);"
                >
                  <v-avatar left v-if="selection && selection.countryInfo">
                    <v-img :src="selection.countryInfo.flag"></v-img>
                  </v-avatar>
                  {{ selection.country }}
                </v-chip>
              </v-col>

              <v-col v-if="!allSelected" cols="12">
                <v-text-field
                  ref="search"
                  v-model="search"
                  full-width
                  hide-details
                  label="Search"
                  single-line
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>

          <v-divider v-if="!allSelected"></v-divider>

          <v-list>
            <template v-for="(item, i) in filteredCountries">
              <v-list-item
                v-if="!selected.includes(i)"
                :key="i"
                :disabled="loadingData"
                @click="selected.push(i); addCountryToChart(item, i);"
              >
                <v-list-item-avatar>
                  <v-avatar left v-if="item && item.countryInfo">
                    <v-img :src="item.countryInfo.flag"></v-img>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-title v-text="item.country"></v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-card>        
      </v-col>
      <v-col cols="8">
        <!-- {{comparedCountries}} -->
        <TimeSeries
          :providedSeries="comparedCountries.map(({ country, ...series }) => series)"
          seriesTitle="Comparison chart"
          :externalIndicatorChoices="comparedCountries.map(c => Object.keys(c.country))"
        />
        <v-btn color="info" class="mt-3" @click.native="clearChart" v-if="selected.length > 1">
          <v-icon>mdi-delete</v-icon>
          <span>CLEAR ALL</span>
        </v-btn>
      </v-col>      
    </v-row>
  </v-container>
</template>

<script>
import { CoronaRoutes } from '../utilities/api';
import TimeSeries from "~/components/TimeSeries";
import { transformTimelineToSeries, parseStructureToTrie, findWordsByPrefix, transformTimelineToRateSeries } from "~/utilities/data-handlers";

export default {
  name: "CompareCountries",
  components: {
    TimeSeries
  },
  computed: {
    filteredCountries () {
      return findWordsByPrefix(this.countriesTrie, this.search).map((v) => v.context);
    },
    selections () {
      const selections = [];

      for (const selection of this.selected) {
        selections.push(this.countries[selection])
      }

      return selections;
    },
    allSelected () {
      return this.selected.length === this.countries.length;
    }
  },
  methods: {
    clearChart (event) {
      this.search = '';
      this.selected = [];
      this.comparedCountries = [];
    },
    async getCountriesData() {
      this.startFetching();
      let { data: countries } = await this.$axios(CoronaRoutes.sortCountries());
      this.countriesTrie = parseStructureToTrie(countries, 'country');
      this.countries = countries;
      this.finishFetching();
    },
    async getCountryTimeline(country) {      
      let { data: countryTimeline } = await this.$axios(CoronaRoutes.historical(country));
      return countryTimeline;
    },
    removeTimeSeries(item, i) {
      this.comparedCountries.splice(i, 1);
    },
    async addCountryToChart(country, idx) {
      this.startFetching();
      const countryTimeline = await this.getCountryTimeline(country.country);
      const series = transformTimelineToSeries(countryTimeline.timeline, country);
      console.log("returning this series:", series);
      // keys should be countries
      // series[country].data = [{date: "/d..", prop: ""}]
      // let rate = transformTimelineToRateSeries(countryTimeline, country.country);
      this.comparedCountries.splice(idx, 0, series);
      this.finishFetching();
    },
    removeCountryFromChart(country, idx) {
      this.comparedCountries.splice(idx, 1);
    },
    startFetching() {
      this.fetchersQueue++;
      this.loadingData = true;
    },
    finishFetching() {
      this.fetchersQueue--;
      this.finalizeFetch();
    },
    finalizeFetch() {
      if (this.fetchersQueue < 1) {
        this.fetchersQueue = 0;
        this.loadingData = false;
        this.finishedLoading = true;
      } else {
        this.loadingData = true;
        this.finishedLoading = false;
      }
    }
  },
  beforeMount() {
     this.getCountriesData();
  },
  data () {
    return {
      countries: [],
      comparedCountries: [],
      fetchersQueue: 0,
      loadingData: false,
      finishedLoading: true,
      countriesList: [],
      search: "",
      countriesTrie: [],
      selected: [],
      comparisonModel: "",
      labelFormat: "y%"
    }
  }
}
</script>

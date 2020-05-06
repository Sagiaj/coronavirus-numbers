<template>
  <v-container fluid>
    <v-row justify="center">
      
      <v-col cols="8" align="center">
        <v-autocomplete
          v-model="countriesList"
          :items="filteredCountries"
          :loading="loadingData"
          :search-input.sync="search"
          cache-items
          hide-no-data
          solo
          chips
          color="blue-grey lighten-2"
          label="Select countries to compare"
          item-text="country"
          item-value="name"
          return-object
          multiple
          @focus="getCountriesData"
        >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              :disabled="loadingData"
              @click:close="toggleCountry(data.item)"
            >
              <v-avatar left v-if="data.item && data.item.countryInfo">
                <v-img :src="data.item.countryInfo.flag"></v-img>
              </v-avatar>
              {{ data.item.country }}
            </v-chip>
          </template>
          <template v-slot:item="data" v-bind="data.attrs" :input-value="data.selected">
            <v-list-item @click="toggleCountry(data.item);">
              <v-list-item-avatar left v-if="data.item && data.item.countryInfo">
                <v-img :src="data.item.countryInfo.flag"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title> {{ data.item.country }} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="12">
        <MultipleSeries
          :givenId="'chartcontainer-1'"
          :providedSeries="comparedCountries.map(({country, ...all}) => ({ data: all, country }) )"
        />
        <!-- <TimeSeries
          :providedSeries="comparedCountries.map(({ country, ...series }) => series)"
          seriesTitle="Comparison chart"
          :externalIndicatorChoices="comparedCountries.map(c => Object.keys(c.country))"
        /> -->
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
// import TimeSeries from "~/components/TimeSeries";
import MultipleSeries from "~/components/MultipleSeries";
import { transformTimelineToSeries, parseStructureToTrie, findWordsByPrefix, transformTimelineToGrowthSeries } from "~/utilities/data-handlers";

export default {
  name: "CompareCountries",
  components: {
    // TimeSeries,
    MultipleSeries
  },
  watch: {
    search(text) {
      this.filterCountries(text);
    }
  },
  computed: {
    // filteredCountries () {
    //   if (this.countriesTrie.length > 1) return findWordsByPrefix(this.countriesTrie, this.search || "").map((v) => v.context);
    //   return [];
    // },
    // selections () {
    //   const selections = [];

    //   for (const selection of this.selected) {
    //     selections.push(this.countries[selection])
    //   }

    //   return selections;
    // },
    allSelected () {
      return this.selected.length === this.countries.length;
    }
  },
  methods: {
    doit(a,b,c) {
      console.log(a,b,c)
    },
    filterCountries (text) {
      if (this.countriesTrie !== null) {
        this.filteredCountries = findWordsByPrefix(this.countriesTrie, text || "").map((v) => v.context);
      }
    },
    clearChart (event) {
      this.search = '';
      this.selected = [];
      this.comparedCountries = [];
    },
    async getCountriesData() {
      if (this.countries.length > 0) {
        return;
      }
      this.startFetching();
      let { data: countries } = await this.$axios(CoronaRoutes.sortCountries());
      this.countriesTrie = parseStructureToTrie(countries, 'country');
      this.countries = countries;
      this.filterCountries("");
      this.finishFetching();
    },
    async getCountryTimeline(country) {      
      let { data: countryTimeline } = await this.$axios(CoronaRoutes.historical(country));
      return countryTimeline;
    },
    removeTimeSeries(item, i) {
      this.comparedCountries.splice(i, 1);
    },
    async toggleCountry(item) {
      let { country } = item;
      let idx = this.comparedCountries.findIndex((v) => v.country === country);
      let listIdx = this.countriesList.findIndex(v => v.country === country);
      if (idx > -1) {
        this.removeCountryFromChart(idx);
        this.countriesList.splice(listIdx, 1);
      } else {
        await this.addCountryToChart(item);
        this.countriesList.splice(listIdx, 0, item);
      }
    },
    async addCountryToChart(item) {
      this.startFetching();
      const countryTimeline = await this.getCountryTimeline(item.country);
      const series = transformTimelineToGrowthSeries(countryTimeline.timeline, item.country);
      this.comparedCountries.push(series);
      this.finishFetching();
    },
    removeCountryFromChart(idx) {
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
  data () {
    return {
      countries: [],
      comparedCountries: [],
      filteredCountries: [],
      fetchersQueue: 0,
      loadingData: false,
      finishedLoading: true,
      countriesList: [],
      search: "",
      countriesTrie: null,
      selected: [],
      comparisonModel: "",
      labelFormat: "y%"
    }
  }
}
</script>

<template>
  <v-container fluid>
    <v-row>      
      <v-col cols="4">
        <v-card style="max-height: 80vh; overflow-y: scroll;">
          <v-card-title>
            <h2 class="title">Click on any country to see it on the graph</h2>
            <v-text-field
              ref="search"
              v-model="search"
              full-width
              hide-details
              clearable
              label="Search"
              single-line
              class="mb-2"
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-chip-group
              v-model="countriesList"
              column
              multiple
              v-if="countries.length > 0"
            >
              <v-chip v-for="(country, idx) in filteredCountries" :key="idx"
              filter
              outlined
              :disabled="loadingData === true || finishedLoading === false"
              @input="handleCountryClick(country, idx, $event)"
              >
                <v-avatar left v-if="country && country.countryInfo">
                  <v-img :src="country.countryInfo.flag"></v-img>
                </v-avatar>
              {{ country.country }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>        
      </v-col>
      <v-col cols="8">
        <TimeSeries
          :seriesArray="comparedCountries"
          xName="date"
          yName="cases"
          seriesType="Line"
          seriesTitle="Comparison chart"
        />
        <v-btn color="info" class="mt-3" @click.native="clearChart" v-if="countriesList.length > 1">
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
import { transformTimelineToSeries } from "~/utilities/data-handlers";

export default {
  name: "CompareCountries",
  components: {
    TimeSeries
  },
  computed: {
    filteredCountries() {
      if (!this.search) return this.countries;
      const search = this.search.toLowerCase();

      if (!search || search.length < 1) return this.countries;

      return this.countries.filter(item => {
        const text = item.country.toLowerCase();

        return text.indexOf(search) > -1;
      });
    }
  },
  methods: {
    clearChart(event) {
      this.search = '';
      this.countriesList = [];
      this.comparedCountries = [];
    },
    async getCountriesData() {
      this.startFetching();
      let { data: countries } = await this.$axios(CoronaRoutes.sortCountries());
      this.countries = countries;
      this.finishFetching();
    },
    async getCountryTimeline(country) {
      let { data: countryTimeline } = await this.$axios(CoronaRoutes.historical(country));
      return countryTimeline.timeline;
    },
    handleCountryClick(country, idx, active) {
      if (!active) { this.removeCountryFromChart(country) }
      else { this.addCountryToChart(country, idx); }
    },
    async addCountryToChart(country, idx) {
      const countryTimeline = await this.getCountryTimeline(country.country);
      const countrySeries = transformTimelineToSeries(countryTimeline, country.country);
      this.comparedCountries.push(countrySeries);
    },
    removeCountryFromChart(country) {
      let foundIdx = this.comparedCountries.findIndex(c => c.country == country.country)
      if (foundIdx !== -1) this.comparedCountries.splice(foundIdx, 1);      
    },
    timestampToDate(ts) {
      return new Date(ts).toLocaleString();
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
      search: ""
    }
  }
}
</script>

<template>
  <v-container fluid>
    <v-row class="mb-10" justify="center">
      <div class="text-center">
        <logo class="mb-10" />
      </div>
    </v-row>
    <TimeSeries
        :seriesArray="globalSeries"
        xName="date"
        yName="cases"
        seriesType="Line"
        seriesTitle="Worldwide Coronavirus Statistics"
      />
    <GoogleAdsense :mobile="true" />
    <v-row justify="center" v-if="countries.length > 2">
      <v-col align="center">
        <v-card>
          <v-row justify="space-around">
            <v-col cols="6">
              <h3 style="font-weight: 500;">Real time country statistics</h3>
            </v-col>
          </v-row>
          <v-data-table
          :headers="tableHeaders"
          :items="tableItems"
          :items-per-page="10"
          class="elevation-3"
          @click:row="goToCountryPage">
            <template v-slot:item.cases="{ item }">
              <v-chip :color="getColor(item.cases, 'cases')" dark>{{ item.cases }}</v-chip>
            </template>
            <template v-slot:item.testsPerOneMillion="{ item }">
              <v-chip :color="getReverseColor(item.testsPerOneMillion, 'testsPerOneMillion')" dark>{{ item.testsPerOneMillion }}</v-chip>
            </template>
            <template v-slot:item.casesPerOneMillion="{ item }">
              <v-chip :color="getColor(item.casesPerOneMillion, 'casesPerOneMillion')" dark>{{ item.casesPerOneMillion }}</v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-5"
    justify="center" v-else>
      <v-col align="center" class="mt-5">
        <v-progress-circular color="info" size="200" indeterminate>
          <h2>Loading...</h2>
        </v-progress-circular>
      </v-col>
    </v-row>


    <!-- <SparklineGraph
    :caseDates="globalCasesDates"
    :caseValues="globalCasesValues"
    :lastUpdated="timestampToDate(globalTimeline.updated)"
    cardTitle="Worldwide cases over time"
    subTitle="By Date" /> -->

    <GoogleAdsense :mobile="true" />
  </v-container>
</template>

<script>
import Logo from '~/components/Logo.vue'
import { CoronaRoutes } from "~/utilities/api";
import SparklineGraph from "~/components/SparklineGraph";
import GoogleAdsense from "~/components/GoogleAdsense";
import TimeSeries from "~/components/TimeSeries";
import { transformTimelineToSeries } from '../utilities/data-handlers';

export default {
  components: {
    Logo,
    SparklineGraph,
    GoogleAdsense,
    TimeSeries
  },
  head() {
    return "HAHA :D"
  },
  methods: {
    getColor (value, prop) {
      let mean = this.getMeanByProp(prop);
      if (value > 0.8 * mean) return 'red'
      else if (value > 0.51 * mean) return 'orange'
      else return 'green'
    },
    getReverseColor(value, prop) {
      let color = this.getColor(value, prop);
      if (color === "green") return "red";
      if (color === "red") return "green";
      return "orange";
    },
    getMeanByProp(prop) {
      return Math.ceil(this.countries.reduce((acc, c) => acc + parseInt(c[prop]) , 0)/this.countries.length);
    },
    async getCountriesData() {
      this.startFetching();
      let { data: countries } = await this.$axios(CoronaRoutes.sortCountries(this.currentSortParam));
      this.countries = countries;
      this.meanCases = Math.ceil(countries.reduce((acc, c) => acc + parseInt(c.cases), 0)/countries.length);
      this.tableHeaders = Object.keys(this.displayableHeaders).map(h => ({
        text: h.replace(/([A-Z])/g, ' $1'),
        value: h,
        align: "center"
      }));
      this.tableItems = this.countries.map(c => (Object.keys(this.displayableHeaders).reduce((acc, h) => ({ ...acc, [h]: c[h] }), {})))
      this.finishFetching();
    },
    async getGlobalData() {
      this.startFetching();
      const { data: global } = await this.$axios(CoronaRoutes.global);
      this.global = global;
      const { data: globalTimeline } = await this.$axios(CoronaRoutes.historical(this.currentHistoricalParam));
      this.globalSeries.push(transformTimelineToSeries(globalTimeline, "Global"));
      this.finishFetching();
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
    },
    goToCountryPage(country) {
      let givenCountry = Object(country) === country ? country.country : country;
      this.$nuxt.$router.push({
        path: `/countries/${givenCountry}`,
        params: {
          givenCountry
        }
      })
    }
  },
  head () {
    const title = "Worldwide Data"
    return {
      title
    }
  },
  beforeMount() {
     this.getCountriesData();
     this.getGlobalData();
  },
  data () {
    return {
      countries: [0],
      global: {0: 0},
      globalSeries: [],
      currentSortParam: "cases",
      currentHistoricalParam: "all",
      globalCasesDates: [],
      globalCasesValues: [],
      loadingData: false,
      finishedLoading: true,
      fetchersQueue: 0,
      tableHeaders: [],
      displayableHeaders: {
        "country": true,
        "cases": true,
        "deaths": true,
        "recovered": true,
        "casesPerOneMillion": true,
        "deathsPerOneMillion": true,
        "testsPerOneMillion": true
      }
    }
  }
}
</script>

<style>
.v-data-table tr:hover {
  cursor: pointer;
}
</style>

<style>
#chartcontainer_ChartTitle {
  font-family: Roboto sans-serif;
  font-size: 20px;
  font-weight: bold;
}
</style>

<template>
  <v-container fluid>
    <v-row class="mb-10" justify="center">
      <div class="text-center">
        <logo class="mb-10" />
      </div>
    </v-row>
    <v-row class="mb-10" justify="center">
      <v-col align="center" align-self="center">

        REPLACE WITH MAP
        <div id="map-wrap" style="height: 50vh; width: 80vw;">
          <no-ssr>
            <l-map :zoom="3" :center="[47.413220, -1.219482]">
              <l-tile-layer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"></l-tile-layer>
              <l-marker :lat-lng="[47.413220, -1.219482]"></l-marker>
            </l-map>
          </no-ssr>
          </div>
      </v-col>
    </v-row>
    <v-row justify="center" v-if="countries.length > 2">
      <v-col cols="12" align="center">
        <TimeSeries
          :providedSeries="globalSeriesGrowth"
          :givenId="`chartcontainer-1`"
          seriesType="Line"
          seriesTitle="Worldwide Coronavirus Infection Rate"
        />
      </v-col>
      <v-col cols="12" align="center">
        <TimeSeries
          :providedSeries="globalSeries"
          :givenId="`chartcontainer-2`"
          seriesType="Line"
          seriesTitle="Worldwide Coronavirus Statistics"
        />
      </v-col>
      <v-col align="center">
        <v-data-table
          :headers="tableHeaders"
          :items="tableItems"
          :items-per-page="10"
          class="elevation-3"
          :search="search"
          :custom-filter="filterTableCountry"
          @click:row="goToCountryPage"
        >
          <template v-slot:top>
            <v-row justify="space-around">
              <v-col cols="6">
                <h1 style="font-weight: 500;">Real time country statistics</h1>
              </v-col>
              <v-col cols="12">
                <v-row justify="center">
                  <v-col cols="12" sm="6" align="center">
                    <v-text-field prepend-icon="mdi-magnify" color="deep-orange" v-model="search" label="Search" class="mx-4"></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-divider></v-divider>
          </template>
          <template v-slot:item.cases="{ item }">
            <v-chip :color="getColor(item.cases, 'cases')" dark>{{ item.cases }}</v-chip>
          </template>
          <template v-slot:item.testsPerOneMillion="{ item }">
            <v-chip
              :color="getReverseColor(item.testsPerOneMillion, 'testsPerOneMillion')"
              dark
            >{{ item.testsPerOneMillion }}</v-chip>
          </template>
          <template v-slot:item.casesPerOneMillion="{ item }">
            <v-chip
              :color="getColor(item.casesPerOneMillion, 'casesPerOneMillion')"
              dark
            >{{ item.casesPerOneMillion }}</v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row class="mt-5" justify="center" v-else>
      <v-col align="center" class="mt-5">
        <v-progress-circular color="info" size="200" indeterminate>
          <h2>Loading...</h2>
        </v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Logo from '~/components/Logo.vue'
import { CoronaRoutes } from '~/utilities/api'
import GoogleAdsense from '~/components/GoogleAdsense'
import TimeSeries from '~/components/TimeSeries'
import { transformTimelineToSeries, transformTimelineToGrowthSeries } from '../utilities/data-handlers'

export default {
  components: {
    Logo,
    GoogleAdsense,
    TimeSeries
  },
  head() {
    return 'HAHA :D'
  },
  methods: {
    zoomUpdated (zoom) {
      this.zoom = zoom;
    },
    centerUpdated (center) {
      this.center = center;
    },
    boundsUpdated (bounds) {
      this.bounds = bounds;
    },
    filterTableCountry(v, s, item) {
      return v !== null &&
      s !== null &&
      typeof v === 'string' &&
      v.toString().toLowerCase().indexOf(s.toLowerCase()) !== -1;
    },
    getColor(value, prop) {
      let mean = this.getMeanByProp(prop)
      if (value > 0.8 * mean) return 'red'
      else if (value > 0.51 * mean) return 'orange'
      else return 'green'
    },
    getReverseColor(value, prop) {
      let color = this.getColor(value, prop)
      if (color === 'green') return 'red'
      if (color === 'red') return 'green'
      return 'orange'
    },
    getMeanByProp(prop) {
      return Math.ceil(
        this.countries.reduce((acc, c) => acc + parseInt(c[prop]), 0) /
          this.countries.length
      )
    },
    async getCountriesData() {
      this.startFetching()
      let { data: countries } = await this.$axios(
        CoronaRoutes.sortCountries(this.currentSortParam)
      )
      this.countries = countries
      this.meanCases = Math.ceil(
        countries.reduce((acc, c) => acc + parseInt(c.cases), 0) /
          countries.length
      )
      this.tableHeaders = Object.keys(this.displayableHeaders).map(h => ({
        text: ((s) => s.charAt(0).toUpperCase() + s.slice(1))(h.replace(/([A-Z])/g, ' $1')),
        value: h,
        align: 'center'
      }));
      this.tableItems = this.countries.map(c =>
        Object.keys(this.displayableHeaders).reduce(
          (acc, h) => ({ ...acc, [h]: c[h] }),
          {}
        )
      );
      this.finishFetching();
    },
    async getGlobalData() {
      this.startFetching()
      const { data: globalTimeline } = await this.$axios(CoronaRoutes.historical(this.currentHistoricalParam));
      const { country, ...series } = transformTimelineToSeries(globalTimeline, "Global");
      const { country: c2, ...growthSeries } = transformTimelineToGrowthSeries(globalTimeline, "Global");
      this.globalSeries = series;
      this.globalSeriesGrowth = growthSeries;
      this.finishFetching()
    },
    timestampToDate(ts) {
      return new Date(ts).toLocaleString()
    },
    startFetching() {
      this.fetchersQueue++
      this.loadingData = true
    },
    finishFetching() {
      this.fetchersQueue--
      this.finalizeFetch()
    },
    finalizeFetch() {
      if (this.fetchersQueue < 1) {
        this.fetchersQueue = 0
        this.loadingData = false
        this.finishedLoading = true
      } else {
        this.loadingData = true
        this.finishedLoading = false
      }
    },
    goToCountryPage(country) {
      let givenCountry = Object(country) === country ? country.country : country
      this.$nuxt.$router.push({
        path: `/countries/${givenCountry}`,
        params: {
          givenCountry
        }
      })
    }
  },
  head() {
    const title = 'Worldwide Data'
    return {
      title
    }
  },
  beforeMount() {
    this.getCountriesData()
    this.getGlobalData()
  },
  data() {
    return {
      zoom: 3,
      center: [47.413220, -1.219482],
      bounds: null,
      countries: [0],
      globalSeries: [],
      globalSeriesGrowth: [],
      currentSortParam: 'cases',
      currentHistoricalParam: 'all',
      globalCasesDates: [],
      globalCasesValues: [],
      loadingData: false,
      search: "",
      finishedLoading: true,
      fetchersQueue: 0,
      tableHeaders: [],
      displayableHeaders: {
        country: true,
        cases: true,
        deaths: true,
        recovered: true,
        casesPerOneMillion: true,
        deathsPerOneMillion: true,
        testsPerOneMillion: true
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

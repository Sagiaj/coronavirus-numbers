<template>
  <v-container fluid>
    <v-row class="pb-5" justify="center">
      <div class="text-center">
        <logo class="mb-5" />
      </div>
    </v-row>
    <v-row class="mb-10" justify="start">
      <v-col cols="12" lg="8" align="center" align-self="center" v-if="countries.length > 2">
        <div v-if="circles.length < 1">
          <v-boilerplate
            class="mb-6"
            type="card-avatar, article, actions"
          ></v-boilerplate>

          <v-boilerplate type="date-picker"></v-boilerplate>
        </div>
        <CountriesMap
        :circles="circles"
        v-else />
        
      </v-col>
      <v-col cols="12" lg="4" align="start" align-self="center">
        <v-card>
          <v-card-title>
            <h2>Recent News</h2>
          </v-card-title>
          <v-card-text>
            <v-container style="max-height: 55vh;" class="overflow-y-auto">
              <v-timeline dense clipped>
                <v-slide-x-transition group>
                  <v-timeline-item v-for="(feed, idx) in newsFeed" :key="`timeline-${idx}`" small>
                    <v-row justify="space-between">
                      <v-col cols="7" v-text="feed.title"></v-col>
                      <v-col cols="5" class="text-right" v-text="feed.description.slice(0, 20)"></v-col>
                    </v-row>
                  </v-timeline-item>
                </v-slide-x-transition>
              </v-timeline>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col align="center">
        <CountriesTable
        :finishedLoading="finishedLoading"
        :tableHeaders="tableHeaders"
        :tableItems="tableItems"
        :countries="countries"
        />
      </v-col>
    </v-row>
    <!-- <v-row class="mt-5" justify="center" v-else>
      <v-col align="center" class="mt-5">
        <v-progress-circular color="info" size="200" indeterminate>
          <h2>Loading...</h2>
        </v-progress-circular>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
import Logo from '~/components/Logo.vue'
import { CoronaRoutes } from '~/utilities/api'
import GoogleAdsense from '~/components/GoogleAdsense'
import TimeSeries from '~/components/TimeSeries'
import { transformTimelineToSeries, transformTimelineToGrowthSeries } from '../utilities/data-handlers'
import CountriesMap from "~/components/CountriesMap";
import CountriesTable from "~/components/CountriesTable";

export default {
  inject: ['theme'],
  components: {
    Logo,
    GoogleAdsense,
    TimeSeries,
    CountriesMap,
    CountriesTable
  },
  computed: {
    circles() {
      return this.countries.map(country => {
        if (country && country.countryInfo && country.countryInfo.lat && country.countryInfo.long) {}
          return {
            radius: country.cases,
            lat: country.countryInfo.lat,
            long: country.countryInfo.long,
            country
          }
      })
    }
  },
  methods: {
    async getNewsFeed() {
      let { data: newsFeed } = await this.$axios(CoronaRoutes.newsTimeline());
      this.newsFeed = newsFeed.articles.slice(0, 100);
    },
    async getCountriesData() {
      this.startFetching()
      let { data: countries } = await this.$axios(
        CoronaRoutes.sortCountries(this.currentSortParam)
      )
      this.countries = countries;
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
    }
  },
  head() {
    const title = 'Worldwide Data'
    return {
      title
    }
  },
  beforeMount() {
    this.getCountriesData();
    this.getNewsFeed();
  },
  data() {
    return {
      newsFeed: null,
      countries: [0],
      calledCountry: null,
      loadingData: false,
      finishedLoading: true,
      fetchersQueue: 0,
      tableHeaders: [],
      tableItems: [],
      displayableHeaders: {
        country: true,
        cases: true,
        deaths: true,
        recovered: true,
        casesPerOneMillion: true,
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

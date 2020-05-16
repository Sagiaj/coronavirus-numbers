<template>
  <v-container fluid>
    <v-row class="pb-5" justify="center">
      <div class="text-center">
        <logo />
      </div>
    </v-row>
    <v-row class="mb-10" justify="start">
      <v-col cols="12" lg="8" align="center" align-self="center">
        <v-card>
          <!-- <CountriesMap
          :circles="circles"/> -->
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" align="start" align-self="center">
        <v-boilerplate
          class="mb-6"
          type="heading, list, list-item-avatar, text@2, list-item-avatar, text@2, list-item-avatar, text@2, actions"
          :loading="true"
          height="60vh"
        ></v-boilerplate>
        <v-card v-if="newsFeed && newsFeed.length">
          <v-card-title>
            <h2>Recent News</h2>
          </v-card-title>
          <v-card-text>
            <v-container style="max-height: 55vh;" class="overflow-y-auto">
              <v-timeline dense clipped>
                <v-slide-x-transition group>
                  <v-timeline-item v-for="(feed, idx) in newsFeed" :key="`timeline-${idx}`" small>
                    <v-row justify="space-between">
                      <v-col cols="12">
                        <v-col cols="12">
                          {{ feed.title }}
                        </v-col>
                        <v-col cols="12">
                          {{ feed.description ? feed.description.slice(0, 20) : '' }}
                        </v-col>
                        <!-- <v-expansion-panel>
                          <v-expansion-panel-header>
                            {{ feed.title }}
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            {{ feed.description }}
                          </v-expansion-panel-content>
                        </v-expansion-panel> -->
                      </v-col>
                    </v-row>
                  </v-timeline-item>
                </v-slide-x-transition>
              </v-timeline>
            </v-container>
          </v-card-text>
        </v-card>
        <v-boilerplate v-else
          class="mb-6"
          type="heading, v-divider, card, list, list-item-avatar"
          :loading="true"
          height="60vh"
        ></v-boilerplate>
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
    CountriesTable,
    VBoilerplate: {
      functional: true,

      render (h, { data, props, children }) {
        return h('v-skeleton-loader', {
          ...data,
          props: {
            boilerplate: true,
            elevation: 2,
            ...props,
          },
        }, children)
      },
    }
  },
  computed: {
    circles() {
      if (!this.countries || this.countries.length < 1) return [];
      return this.countries.map(country => {
        if (country && country.countryInfo && country.countryInfo.lat && country.countryInfo.long) {
          return {
            radius: country.cases,
            lat: country.countryInfo.lat,
            long: country.countryInfo.long,
            country
          }
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

<template>
  <v-container fluid>
    <v-row justify="center" v-if="finishedLoading">
      <v-col cols="12" lg="6" align="center">
        <TimeSeries
          :providedSeries="globalSeriesGrowth"
          :givenId="`chartcontainer-1`"
          seriesType="Line"
          seriesTitle="Worldwide Coronavirus Daily Infections"
        />
      </v-col>
      <v-col cols="12" lg="6" align="center">
        <TimeSeries
          :providedSeries="globalSeries"
          :givenId="`chartcontainer-2`"
          seriesType="Line"
          seriesTitle="Worldwide Coronavirus Statistics"
        />
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
import { CoronaRoutes } from '~/utilities/api'
import GoogleAdsense from '~/components/GoogleAdsense'
import TimeSeries from '~/components/TimeSeries'
import { transformTimelineToSeries, transformTimelineToGrowthSeries } from '../utilities/data-handlers'

export default {
  name: "WorldwideStatistics",
  components: { TimeSeries },
  methods: {
    async getGlobalData() {
      this.startFetching()
      const { data: globalTimeline } = await this.$axios(CoronaRoutes.historical(this.currentHistoricalParam));
      const { country, ...series } = transformTimelineToSeries(globalTimeline, "Global");
      const { country: c2, ...growthSeries } = transformTimelineToGrowthSeries(globalTimeline, "Global");
      this.globalSeries = series;
      this.globalSeriesGrowth = growthSeries;
      this.finishFetching()
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
  beforeMount() {
    this.getGlobalData();
  },
  data () {
    return {
      globalSeries: [],
      globalSeriesGrowth: [],
      currentSortParam: 'cases',
      currentHistoricalParam: 'all',
      loadingData: true,
      finishedLoading: false,
      fetchersQueue: 0
    }
  }
}
</script>

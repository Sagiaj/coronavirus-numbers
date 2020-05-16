<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="9" md="6">
        <h1>{{ currentCountry }} Coronavirus Numbers</h1>
        <v-row justify="center">
          <v-col cols="6" align-self="center">
            <v-img responsive small :src="countryFlag"></v-img>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" lg="6" align="center" align-self="center">
        <TimeSeries
          :providedSeries="countrySeriesGrowth"
          :givenId="`chartcontainer-1`"
          seriesType="Line"
          :seriesTitle="`Daily Statistics`"
        />
      </v-col>
      <v-col cols="12" lg="6" align="center" align-self="center">
        <TimeSeries
          :providedSeries="countrySeries"
          :givenId="`chartcontainer-2`"
          providedSeriesType="Column"
          :seriesTitle="`Statistics Over Time`"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { CoronaRoutes } from '../../utilities/api'
import TimeSeries from "@/components/TimeSeries";
import { transformTimelineToSeries, transformTimelineToGrowthSeries } from '../../utilities/data-handlers';

export default {
  name: "Country",
  components: { TimeSeries },
  methods: {
    async getCountryTimeline() {
      const { data: countryTimeline } = await this.$axios(CoronaRoutes.historical(this.currentCountry));
      const { country, ...series } = transformTimelineToSeries(countryTimeline.timeline, this.currentCountry);
      const { country: c2, ...growthSeries } = transformTimelineToGrowthSeries(countryTimeline.timeline, this.currentCountry);
      this.countrySeriesGrowth = growthSeries;
      this.countrySeries = series;
    },
    async getCountryData() {
      const { data: countryData } = await this.$axios(CoronaRoutes.country(this.currentCountry));
      this.countryData = countryData;
      this.countryFlag = countryData.countryInfo ? countryData.countryInfo.flag : "";
    },
    timestampToDate(ts) {
      return new Date(ts).toLocaleString();
    }
  },
  mounted() {
    this.getCountryTimeline();
    this.getCountryData();
  },
  data() {
    return {
      currentCountry: this.$route.params.country,
      countryTimeline: [],
      countryData: {updated: ""},
      caseValues: [],
      caseDates: [],
      countrySeries: [],
      countrySeriesGrowth: [],
      countryFlag: ""
    }
  }
}
</script>

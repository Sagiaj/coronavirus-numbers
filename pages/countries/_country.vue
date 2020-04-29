<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="3">
        <h1>{{ currentCountry }}</h1>
        <v-row justify="center">
          <v-col cols="6" align-self="center">
            <v-img responsive small :src="countryFlag"></v-img>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <TimeSeries
      :providedSeries="countrySeries"
      seriesType="Line"
      :seriesTitle="`${currentCountry}`"
    />
      
  </v-container>
</template>

<script>
import { CoronaRoutes } from '../../utilities/api'
import TimeSeries from "@/components/TimeSeries";
import { transformTimelineToSeries } from '../../utilities/data-handlers';

export default {
  name: "Country",
  components: { TimeSeries },
  methods: {
    async getCountryTimeline() {
      const { data: countryTimeline } = await this.$axios(CoronaRoutes.historical(this.currentCountry));
      const { country, ...series } = transformTimelineToSeries(countryTimeline.timeline, this.currentCountry);
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
      countryFlag: ""
    }
  }
}
</script>

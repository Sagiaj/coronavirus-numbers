<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="3" align="end">
        <h1>{{ currentCountry }}</h1>
      </v-col>
      <v-col cols="1" align-self="center" align="start">
        <v-img responsive small :src="countryFlag"></v-img>
      </v-col>
    </v-row>
    <SparklineGraph 
    :caseDates="caseDates"
    :caseValues="caseValues"
    :lastUpdated="timestampToDate(countryData.updated)"
    :cardTitle="`Cases over time in ${currentCountry}`"
    subTitle="By Date" />
      
  </v-container>
</template>

<script>
import { CoronaRoutes } from '../../utilities/api'
import SparklineGraph from "~/components/SparklineGraph";
export default {
  name: "Country",
  components: { SparklineGraph },
  methods: {
    async getCountryTimeline() {
      let { data: countryTimeline } = await this.$axios(CoronaRoutes.historical(this.currentCountry));
      this.countryTimeline = countryTimeline.timeline;
      const casesDates = Object.keys(this.countryTimeline.cases);
      this.caseDates = casesDates.map((d, i) => ( (i+1) % Math.ceil(casesDates.length/4-1) ) ? ' ' : d  )
      this.caseValues = Object.values(this.countryTimeline.cases);
    },
    async getCountryData() {
      let { data: countryData } = await this.$axios(CoronaRoutes.country(this.currentCountry));
      this.countryData = countryData;
      this.countryFlag = countryData.countryInfo ? countryData.countryInfo.flag : "";
    },
    timestampToDate(ts) {
      return new Date(ts).toLocaleString();
    }
  },
  created() {
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
      countryFlag: ""
    }
  }
}
</script>

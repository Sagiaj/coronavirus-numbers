<template>
  <v-card
    class="mt-4 mx-auto"
    max-width="80vw"
  >
    <v-sheet
      style="top: -1em; position: relative;"
      class="v-sheet--offset mx-auto"
      color="primary"
      elevation="1"
      max-width="75vw"
    >
      <v-sparkline
        v-if="hasCases"
        :labels="caseDates"
        :value="caseValues"
        color="black"
        line-width="2"
        label-size="6"
        padding="16"
      ></v-sparkline>
      <v-row 
      justify="center" v-else>
        <v-col align="center">
          <v-progress-circular color="white" size="100" indeterminate>
            Loading...
          </v-progress-circular>
        </v-col>
      </v-row>
    </v-sheet>

    <v-card-text class="pt-0">
      <div class="title font-weight-light mb-2">{{ cardTitle }}</div>
      <div class="subheading font-weight-light grey--text">{{ subTitle }}</div>
      <v-divider class="my-2"></v-divider>
      <v-icon
        class="mr-2"
        small
      >
        mdi-clock
      </v-icon>
      <span class="caption grey--text font-weight-light">Last updated - {{ lastUpdated }}</span>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "SparklineGraph",
  props: ["caseDates", "caseValues", "cardTitle", "subTitle", "lastUpdated"],
  computed: {
    hasCases() {
      return this.caseDates.length && this.caseDates.length;
    }
  }
}
</script>

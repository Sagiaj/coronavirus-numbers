<template>
  <v-row justify="center" v-if="breakpointSatisfied">
    <v-col align="center">
      <adsbygoogle />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "GoogleAdsense",
  props: ["mobile", "desktop", "only"],
  computed: {
    breakpointSatisfied() {
      if (this.mobile === true) {
        return this.$vuetify.breakpoint.smAndDown;
      } else if (this.desktop === true) {
        return this.$vuetify.breakpoint.mdAndUp;
      } else if (this.tablet === true) {
        return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md;
      } else if (this.only) {
        return (this.$vuetify.breakpoint[this.only] || this.$vuetify.breakpoint.name == this.only) || false;
      }

      return true;
    }
  }
}
</script>

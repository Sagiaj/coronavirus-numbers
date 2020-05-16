<template>
  <div id="map-wrap" style="height: 60vh; width: 100%;">
    <client-only v-if="circles && circles.length > 2">
        <l-map :zoom="5" :center="center" :style="'z-index: 0;'">
          <l-tile-layer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"></l-tile-layer>
          <l-circle
            :stroke="false"
            :fillOpacity="0.6"
            :fillColor="fillColor"
            v-for="(circle, idx) in circles"
            :key="idx"
            :lat-lng="circle ? [circle.lat, circle.long] : center"
            :radius="circle ? circle.radius : 0"
            @click="openPopUp([circle.lat, circle.long], circle)"
          />
      </l-map>
    </client-only>
    <v-boilerplate v-else
      class="mb-6"
      type="image"
      :loading="true"
      transition="fade-transition"
      height="100%"
    ></v-boilerplate>
    <v-dialog v-model="openDialog" color="red" v-if="calledCountry !== null" max-width="50vw">
      <v-lazy v-model="calledCountry" transition="slide-y-transition" group>
        <transition name="slide-y-transition" mode="out-in">
          <v-card>
            <v-card-title primary-title>
              <h2>{{ calledCountry.country.country }}</h2>
            </v-card-title>
            <v-card-text v-if="calledCountry">
              <v-row justify="space-between">
                <v-col cols="8" align="start"> <h3>Active:</h3> </v-col>
                <v-col cols="4" align="end"> <strong>{{ calledCountry.country.active }}</strong> </v-col>
              </v-row>
              <v-row justify="space-between">
                <v-col cols="8" align="start"> <h3>Recovered:</h3> </v-col>
                <v-col cols="4" align="end"> <strong>{{ calledCountry.country.recovered }}</strong> </v-col>
              </v-row>
              <v-row justify="space-between">
                <v-col cols="8" align="start"> <h3>Deaths:</h3> </v-col>
                <v-col cols="4" align="end"> <strong>{{ calledCountry.country.deaths }}</strong> </v-col>
              </v-row>
              <v-row justify="space-between">
                <v-col cols="8" align="start"> <h3>Critical:</h3> </v-col>
                <v-col cols="4" align="end"> <strong>{{ calledCountry.country.critical }}</strong> </v-col>
              </v-row>
            </v-card-text>
            <v-btn @click="openDialog = false; calledCountry = null;" icon absolute right top color="secondary">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-card-actions>
              <v-btn @click="openDialog = false; calledCountry = null;" outlined color="primary">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </transition>
      </v-lazy>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "CountriesMap",
  props: ["circles"],
  components: {
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
    fillColor() {
      return this.$vuetify.theme.currentTheme.warning;
    }
  },
  methods: {
    openPopUp (latLng, calledCountry) {
      this.calledCountry = calledCountry;
      this.openDialog = true;
      this.centerUpdated(latLng);
    },
    zoomUpdated (zoom) {
      this.zoom = zoom;
    },
    centerUpdated (center) {
      this.center = center;
    },
    boundsUpdated (bounds) {
      this.bounds = bounds;
    }
  },
  data () {
    return {
      calledCountry: null,
      openDialog: false,
      zoom: 3,
      center: [47.413220, -1.219482],
      bounds: null
    }
  }
}
</script>
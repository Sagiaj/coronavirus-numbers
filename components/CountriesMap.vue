<template>
  <div id="map-wrap" style="height: 60vh; width: 100%;">
    <client-only>
      <l-map :zoom="5" :center="center" :style="'z-index: 0;'">
        <l-tile-layer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"></l-tile-layer>
        <l-circle
          :stroke="false"
          :fillOpacity="0.6"
          :fillColor="fillColor"
          v-for="(circle, idx) in circles"
          :key="idx"
          :lat-lng="[circle.lat, circle.long]"
          :radius="circle.radius"
          @click="openPopUp([circle.lat, circle.long], circle)"
        />
      </l-map>
    </client-only>
    <v-dialog v-model="openDialog" color="red">
      <v-lazy v-model="calledCountry" transition="slide-y-transition" group>
        <transition name="slide-y-transition" mode="out-in">
          <v-card>
            <v-card-title primary-title>
              <h2>Overall Cases</h2>
            </v-card-title>
            <v-card-text>
              cases::: {{ calledCountry }}
            </v-card-text>
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
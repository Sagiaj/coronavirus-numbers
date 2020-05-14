<template>
  <div>
    <v-data-table v-if="tableItems && tableHeaders && countries && finishedLoading"
      :headers="tableHeaders"
      :items="tableItems"
      :items-per-page="10"
      class="elevation-3"
      :search="search"
      :custom-filter="filterTableCountry"
      @click:row="goToCountryPage"
    >
      <template v-slot:top>
        <v-row justify="space-around">
          <v-col cols="6">
            <h1 style="font-weight: 500;">Real time country statistics</h1>
          </v-col>
          <v-col cols="12">
            <v-row justify="center">
              <v-col cols="12" sm="6" align="center">
                <v-text-field prepend-icon="mdi-magnify" color="deep-orange" v-model="search" label="Search" class="mx-4"></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </template>
      <template v-slot:footer>
        <v-row justify="center">
          <v-col cols="10" align-self="center" align="center">
            <v-alert class="py-2 my-2" outlined :value="true">
              <h4 class="py-2">Color map</h4>
              <v-row justify="center">
                <v-col v-for="(severity, idx) in [{text: 'Bad', color: 'error'}, {text: 'Medium', color: 'warning'}, {text: 'Good', color: 'success'}]" :key="`severity-${idx}`">
                  <v-chip :color="severity.color">{{ severity.text }}</v-chip>
                </v-col>
              </v-row>
            </v-alert>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.cases="{ item }">
        <v-chip :color="getColor(item.cases, 'cases')">{{ item.cases }}</v-chip>
      </template>
      <template v-slot:item.testsPerOneMillion="{ item }">
        <v-chip
          :color="getReverseColor(item.testsPerOneMillion, 'testsPerOneMillion')"
        >{{ item.testsPerOneMillion }}</v-chip>
      </template>
      <template v-slot:item.casesPerOneMillion="{ item }">
        <v-chip
          :color="getColor(item.casesPerOneMillion, 'casesPerOneMillion')"
        >{{ item.casesPerOneMillion }}</v-chip>
      </template>
    </v-data-table>
    <v-boilerplate v-else>

    </v-boilerplate>
  </div>
</template>

<script>
export default {
  name: "CountriesTable",
  props: ["tableItems", "tableHeaders", "countries", "finishedLoading"],
  inject: ['theme'],
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

  },
  methods: {
    filterTableCountry(v, s, item) {
      return v !== null &&
      s !== null &&
      typeof v === 'string' &&
      v.toString().toLowerCase().indexOf(s.toLowerCase()) !== -1;
    },
    getColor(value, prop) {
      let mean = this.getMeanByProp(prop)
      if (value > 0.8 * mean) return 'red'
      else if (value > 0.51 * mean) return 'orange'
      else return 'green'
    },
    getReverseColor(value, prop) {
      let color = this.getColor(value, prop)
      if (color === 'green') return 'red'
      if (color === 'red') return 'green'
      return 'orange'
    },
    getMeanByProp(prop) {
      return Math.ceil(
        this.countries.reduce((acc, c) => acc + parseInt(c[prop]), 0) /
          this.countries.length
      )
    },
    goToCountryPage(country) {
      let givenCountry = Object(country) === country ? country.country : country
      this.$nuxt.$router.push({
        path: `/countries/${givenCountry}`,
        params: {
          givenCountry
        }
      })
    }
  },
  data () {
    return {
      search: "",
    }
  }
}
</script>

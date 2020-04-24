<template>
  <v-app>
    <Header />
    <v-content style="background-color: #cecece;">
      <v-row justify="center">
        <v-col 
          cols="12"
          md="10"
          lg="8"
          xl="7"
          align="center"
          align-self="center">
          <nuxt />
        </v-col>
      </v-row>
      <Footer />
    </v-content>
  </v-app>
</template>

<script>
import Header from "@/components/partials/Header";
import Footer from "@/components/partials/Footer";

export default {
  components: { Header, Footer }
}
</script>

<style>
@font-face {
  font-family: 'Pacifico';
  font-style: normal;
  font-weight: 400;
  src: local('Pacifico Regular'), local('Pacifico-Regular'), url(https://fonts.gstatic.com/s/pacifico/v12/FwZY7-Qmy14u9lezJ-6H6MmBp0u-.woff2) format('woff2');
  font-display: swap;
  font-display: "swap";
}
</style>

import colors from 'vuetify/es5/util/colors'

export default {
  breakpoint: {},
  icons: {},
  lang: {},
  rtl: false,
  theme: {
    light: true,
    themes: {
      // dark: {
      //   primary: colors.deepOrange.base,
      //   accent: colors.grey.darken3,
      //   secondary: colors.amber.darken3,
      //   info: colors.teal.lighten1,
      //   warning: colors.amber.base,
      //   error: colors.deepOrange.accent4,
      //   success: colors.green.accent3,
      //   background: colors.grey.darken4
      // }
      light: {
        primary: "#C26700", // Alloy Orange
        secondary: "#1E1C1C", // Eerie Black
        background: "#FDF7F6", // Snow(white)
        error: "#C40000", // Red
        warning: colors.deepOrange.base,
        success: "#00C281", // Ocean green
        red: "#C40000" // Red
      }
    }
  }
}

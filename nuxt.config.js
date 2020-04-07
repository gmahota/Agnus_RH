import VuetifyLoaderPlugin from "vuetify-loader/lib/plugin";
import pkg from "./package";
import serveStatic from "serve-static";

const bodyParser = require('body-parser');

export default {
  serverMiddleware: [
    bodyParser.json(),
    '~/api/logger',
    '~/api'
  ],

  mode: "universal",

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons",
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },

  /*
   ** Global CSS
   */
  css: ["~/assets/style/index.scss"],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~/plugins/vuetify",
    { src: "~/plugins/chartist", mode: "client" },
    { src: "~/plugins/google-maps" },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios","@nuxtjs/dotenv"
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  buildModules: ["@nuxtjs/vuetify"],

  /*
   ** Build configuration
   */
  build: {
    transpile: ["vuetify/lib"],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {},
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
    },
  },

  env: {
    baseUrl: process.env.BASE_URL || 'https://localhost:5001/api',
    VUE_APP_GOOGLE_MAPS_API_KEY: process.env.VUE_APP_GOOGLE_MAPS_API_KEY
  }
};

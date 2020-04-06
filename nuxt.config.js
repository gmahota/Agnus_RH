import pkg from "./package";
import serveStatic from "serve-static";
require('dotenv').config();

export default {
  serverMiddleware: [
    // Will register redirect-ssl npm package
    "~/api/logger",

    // Will register file from project api directory to handle /api/* requires
    { path: "/api", handler: "~/api/index.js" },

    // We can create custom instances too
    //{ path: '/static2', handler: serveStatic(__dirname + '/static2') }
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
  plugins: [
    { src: "~/plugins/chartist", mode: "client" },
    { src: "~/plugins/google-maps" },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/dotenv",
    [
      "@nuxtjs/firebase",
      {
        config: {
          apiKey: process.env.Firebase_apiKey ,
          authDomain: process.env.Firebase_authDomain,
          databaseURL: process.env.Firebase_databaseURL,
          projectId: process.env.Firebase_projectId,
          storageBucket: process.env.Firebase_storageBucket,
          messagingSenderId: process.env.Firebase_messagingSenderId,
          appId: process.env.Firebase_appId,
          measurementId: process.env.Firebase_measurementId,
        },
        services: {
          auth: true, // Just as example. Can be any other service.
        },
      },
    ],
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
    loaders: {},
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },

  env: {
    baseUrl: process.env.BASE_URL || "https://localhost:5001/api",
    VUE_APP_GOOGLE_MAPS_API_KEY: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
    Firebase_apiKey: process.env.Firebase_apiKey,
    Firebase_authDomain: process.env.Firebase_authDomain,
    Firebase_databaseURL: process.env.Firebase_databaseURL,
    Firebase_projectId: process.env.Firebase_projectId,
    Firebase_storageBucket: process.env.Firebase_storageBucket,
    Firebase_messagingSenderId: process.env.Firebase_messagingSenderId,
    Firebase_appId: process.env.Firebase_appId,
    Firebase_measurementId: process.env.Firebase_measurementId,
  },
};

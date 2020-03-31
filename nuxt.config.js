import VuetifyLoaderPlugin from "vuetify-loader/lib/plugin";
import pkg from "./package";
import serveStatic from "serve-static";

export default {
  serverMiddleware: [
    // Will register redirect-ssl npm package
    "~/api/logger",

    // Will register file from project api directory to handle /api/* requires
    { path: "/api", handler: "~/api/index.js" }

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
      { hid: "description", name: "description", content: pkg.description }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"
      }
    ]
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
  plugins: ["~/plugins/vuetify", { src: "~/plugins/chartist", mode: "client" }],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    [
      "@nuxtjs/firebase",
      {
        config: {
          apiKey: "AIzaSyDeQxXFQ4sH0yL4_nF4bK2YuR3AQ2liQPA",
          authDomain: "mahotacrm.firebaseapp.com",
          databaseURL: "https://mahotacrm.firebaseio.com",
          projectId: "mahotacrm",
          storageBucket: "mahotacrm.appspot.com",
          messagingSenderId: "703802478357",
          appId: "1:703802478357:web:67d8f480e01044fa",
          measurementId: "G-7PRWY44TTV"
        },
        services: {
          auth: true // Just as example. Can be any other service.
        }
      }
    ]
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

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
    extend(config, ctx) {}
  }
};

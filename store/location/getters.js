export default {
  getLocation(state,code) {
    return state?.locations.filters(p=> p.code ==code )[0];
  },

  getLocations(state){
    return state?.locations;
  }
}

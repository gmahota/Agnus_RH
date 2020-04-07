export default {
  getLocation(code) {
    return state?.locations.filters(p=> p.code ==code )[0];
  }
}

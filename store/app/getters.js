export default {
  getImage(state) {
    return state.image;
  },

  getColor(state) {
    return state.color;
  },

  getDrawer(state) {
    return state.drawer;
  },

  getStatus(state){
    return state.status;
  },
  getError(state){
    return state.error;
  }
}

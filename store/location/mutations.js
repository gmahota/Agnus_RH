export default {
  SET_Locations(state, Locations) {
    state.Locations = Locations;
  },

  SET_Location(state, location) {
    state.Locations.push(location);
  },

  SET_Employee(state, { locationId, employee }) {

    const index = state.Locations.findIndex(item => {
      return (locationId == item.id)
    })

    if (index< 0) return;

    state.Locations[index].Employees.push(employee);
    state.Locations[index].employees ++;
  },

  setLocation(state, location) {
    state.location = location;
  },

  removeLocation(state, location) {
    state.Locations.splice(this.Locations.indexOf(location), 1);
  }
};

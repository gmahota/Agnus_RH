export default {
  async loadAllLocations({ commit }) {

    await this.$fireDb.ref("location").once("value", function(snapshot) {

      commit("SET_Locations",[]);

      snapshot.forEach(function(childSnapshot) {
        try {
          let loc= deserializeLocation(childSnapshot)

          commit("SET_Location", loc);
        } catch (e) {
          console.log(e);
          commit("app/setStatus", "failure");
          commit("app/setError", e.message);
        }
      });
    });
  },

  async getAllEmployee({ commit }, { locationId ,Employees}) {
    try {
      var ref = this.$fireDb.ref("employee");
      Employees = [];
      await ref
        .orderByChild("location")
        .equalTo(locationId)
        .once("value", function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            let emp =deserializeEmployee(childSnapshot)
            console.log(emp)
            Employees.push(emp);

            commit("SET_Employee", {
              locationId: emp.employee.location,
              employee: emp
            });
          });
        });
    } catch (e) {
      console.log(e);
    }
  },

  setLocations({ commit }, Locations) {
    this.$fireDb.ref("location").once("value", function(snapshot) {
      let returnArr = [];
      snapshot.forEach(function(childSnapshot) {
        try {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();

          var item = {
            id: childKey,
            employees: 0,
            clockIn: 0,
            location: childData
          };

          returnArr.push(item);
        } catch (e) {
          console.log(e);
        }
      });

      commit("SET_Locations", Locations);
    });
  },

  addLocation({ commit }, location) {
    try {
      commit("app/setStatus", "loading");

      const locationRef = this.$fireDb.ref("location");

      var newChildRef = locationRef.push();

      newChildRef.set(location);

      let newLocation = {
        id: newChildRef.newChildRef.key,
        location: location
      };

      this.locationKey = commit("SET_addLocation", newLocation);

      commit("app/setStatus", "sucess");
    } catch (e) {
      commit("app/setStatus", "failure");
      commit("app/setError", e.message);
    }
  },

  setStatus({ commit }, status) {
    commit(SET_STATUS, status);
  },

  deleteLocation({ commit }, location) {}
};

const deserializeLocation = function(childSnapshot) {
  var item = {
    id: childSnapshot.key,
    employees: 0,
    Employees: [],
    clockIn: 0,
    location: childSnapshot.val()
  };
  return item;
};

const deserializeEmployee = function(childSnapshot) {
  var item = {
    id: childSnapshot.key,
    employee: childSnapshot.val()
  };
  return item;
};

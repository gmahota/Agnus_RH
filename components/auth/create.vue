<template>
  <v-btn small style="height:24px" color="primary" @click="createUser">Update</v-btn>
</template>
<script>
export default {
  methods: {
    async createUser() {
      try {
        console.log("Foo");
        await this.$fireAuth.createUserWithEmailAndPassword(
          "foo@foo.foo",
          "test"
        );
      } catch (e) {
        handleError(e);
      }
    }
  }
};
</script>

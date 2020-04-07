<template>
  <v-container  fluid grid-list-xs>
    <v-layout justify-center wrap>
      <material-card color="success" title="Employee creation">
        <v-form>
            <v-layout mx wrap>
              <v-flex xs12 md4>
                <v-text-field label="Company (disabled)" disabled />
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field class="purple-input" label="User Name" />
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field label="Email Address" class="purple-input" />
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field label="First Name" class="purple-input" />
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field label="Last Name" class="purple-input" />
              </v-flex>
              <v-flex xs12 md12>
                <v-text-field label="Adress" class="purple-input" />
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field label="City" class="purple-input" />
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field label="Country" class="purple-input" />
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field class="purple-input" label="Postal Code" type="number" />
              </v-flex>
              <v-flex xs12>
                <v-textarea
                  class="purple-input"
                  label="About Me"
                  value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                />
              </v-flex>
              <v-flex xs12 >
                <v-btn class="mx-0 font-weight-light" small="" color="success">Save</v-btn>
              </v-flex>
            </v-layout>
        </v-form>
      </material-card>
      <v-flex xs12 md4></v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import materialCard from "~/components/material/AppCard";

export default {
  layout: "dashboard",
  components: {
    materialCard
  },
  computed: {
    ...mapGetters({
      user: "user/getUser",
      fullname: "user/getFullname"
    })
  }
};
</script>

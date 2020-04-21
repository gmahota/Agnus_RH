<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <material-card
            color="success"
            elevation="12"
            title="Sign In into your account"
          >
            <v-card-text>
              <v-form>
                <v-text-field type="email" v-model="email" prepend-icon="person" name="email" label="Login" placeholder="your@email.com"></v-text-field>
                <v-text-field type="password" v-model="password" prepend-icon="lock" name="password" label="Password" placeholder="password"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-layout justify-center align-center>
                <v-btn color="success" :disabled="isDisabled" @click.prevent="authenticate">Sign In</v-btn>
              </v-layout>
            </v-card-actions>
          </material-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import { mapActions } from 'vuex'
  import materialCard  from '~/components/material/AppCard'

  export default {
    components: {
      materialCard
    },
    data() {
      return {
        email: null,
        password: null,
        defaultUserPassword: 'admin'
      }
    },
    computed: {
      isDisabled() {
        return (this.email && this.password) ? false : true
      }
    },
    methods: {
      ...mapActions({
        setEmail: 'user/setUsername'
      }),

      async authenticate() {
        if (!this.isDisabled) {
          //this.$router.push({ path: 'dashboard' });
          this.$fireAuth.signInWithEmailAndPassword(this.email, this.password)
          .then(async credentials => {             
            console.log(credentials.user)
            await this.setEmail(credentials.user.email); 
            this.$router.push({ name:'dashboard' }, () => this.$router.go(0));
            this.$forceUpdate();
          })
        }
      }
    }
  }
</script>

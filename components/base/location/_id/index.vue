<template>
  <v-card class="mx-auto">
    <v-card-title>
      <v-icon>mdi-map-marker</v-icon>
      <h6>{{location.location.name}}</h6>
      <v-spacer></v-spacer>

      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon color="primary">more_vert</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item-group>
            <v-list-item v-for="(item, i) in items" :key="i" @click="menuAction(item,location)">
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-divider></v-divider>
    <v-list>
      <v-list-item-group>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Funcionarios</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            {{getCountEmployee(location.id)}}
            <!-- <v-icon >chat_bubble</v-icon> -->
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Clock-In</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            {{location.clockIn}}
            <!-- 10 <v-icon :color="item.active ? 'deep-purple accent-4' : 'grey'">chat_bubble</v-icon> -->
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: ["location"],
  head: {
    title: "Watch"
  }
};
</script>

<style lang="scss" scoped>
</style>

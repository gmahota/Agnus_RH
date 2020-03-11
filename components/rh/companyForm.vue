<template>
  <v-card>
    <v-card-title>
      <h1>New Company</h1>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-text-field v-model="name" label="Company Name"></v-text-field>
      </v-row>
      <v-row>
        <v-select :items="Type"  v-model="size" label="Company Type"></v-select>
      </v-row>
      <v-row>
        <v-select :items="Size"  v-model="size" label="Company Size"></v-select>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data: () =>({
    name: "",
    type: null,
    size:null,
    logo:null,
    Types:[],
    Size:[]
  })
}
</script>

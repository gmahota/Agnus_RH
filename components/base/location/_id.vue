<template>
  <div>
    <nuxt-child :location="location" />
  </div>
</template>
<script>
export default {
    async asyncData({$axios, params}) {
      let response = await $axios.get(`/videos/${params.id}`)
      let video = response.data.data.attributes;
      return {
        video
      }
    }
}
</script>

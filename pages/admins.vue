<template>
  <adminsForm></adminsForm>
</template>
<script>
import adminsForm from "@/components/auth/admins.vue";

export default {
  layout: "dashboard",
  components: {
    adminsForm
  },
  data() {
    return {
      menu: false
    };
  }
};
</script>

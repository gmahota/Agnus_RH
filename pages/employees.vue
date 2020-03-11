<template>
  <employForm></employForm>
</template>
<script>
import employForm from "@/components/rh/employee/List.vue";

export default {
  layout: "dashboard",
  components: {
    employForm
  },
  data() {
    return {
      menu: false
    };
  }
};
</script>

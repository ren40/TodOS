<template>
  <v-app>
    <to-do></to-do>
  </v-app>
</template>

<script>
import ToDo from "./views/ToDoViews.vue";

export default {
  name: "App",

  components: {
    ToDo,
  },

  data: () => ({
    //
  }),
};
</script>

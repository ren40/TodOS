<template>
  <v-app>
    <v-main>
      <to-do></to-do>
    </v-main>
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

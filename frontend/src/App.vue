<template>
  <v-app>
    <v-main>
      <ErrorBoundary>
      <ToDo/>
      </ErrorBoundary>
    </v-main>
  </v-app>
</template>

<script>
import ErrorBoundary from './components/ErrorBoundary.vue';
import ToDo from "./views/ToDoViews.vue";

export default {
  name: "App",

  components: {
    ToDo,
    ErrorBoundary,
  },

  data: () => ({
    //
  }),
};
</script>

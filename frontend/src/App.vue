<template>
  <v-app>
    <v-main>
      <ErrorBoundary>
        <ToDo />
      </ErrorBoundary>
    </v-main>
  </v-app>
</template>

<script>
import ErrorBoundary from "./components/ErrorBoundary.vue";
import ToDo from "./views/ToDoViews.vue";

export default {
  name: "App",

  components: {
    ToDo,
    ErrorBoundary,
  },

  data: () => ({
    onLine: navigator.onLine,
  }),
  methods: {
    isOnLine(new_value) {
      if (!new_value) {
        this.$toast.error("Упс...Интернет соединение потеряно");
      } else {
        this.$toast.info("Интернет соединение восстановлено");
      }
    },
  },
  watch: {
    onLine: 'isOnLine'
  },
  mounted() {
    window.addEventListener("online", () => (this.onLine = true));
    window.addEventListener("offline", () => (this.onLine = false));
  },
};
</script>

<template>
  <div class="todo__item__find">
    <h2 class="todo__find_header">
      <v-icon>{{ icons.mdiMagnify }}</v-icon> Search
    </h2>
    <v-container class="todo__find_container align-center">
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-model.trim="todoTitle"
            label="Title todo"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mdiMagnify } from "@mdi/js";
import debounce from "lodash.debounce";

export default {
  name: "ToDoFind",
  data() {
    return {
      todoTitle: "",
      icons: {
        mdiMagnify,
      },
    };
  },
  computed: {
    isActive() {
      return this.todoTitle.length > 0 ? true : false;
    },
  },
  methods: {
    handlerActive(new_value) {
      this.$emit("changeActive", "Find", new_value);
    },
  },
  watch: {
    isActive: "handlerActive",
    todoTitle(...args) {
      this.debounceWatch(...args);
    },
  },
  created() {
    this.debounceWatch = debounce((new_value) => {
      this.$emit("search", new_value);
    }, 500);
  },
  beforeUnmount() {
    this.debounceWatch.cancel();
  },
};
</script>

<style scoped>
.todo__find_header {
  font-weight: 300;
}
.todo__find_container {
  position: relative;
}
.todo__find_btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>
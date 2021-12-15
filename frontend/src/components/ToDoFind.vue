<template>
  <div class="todo__item__find">
    <h2 class="todo__find_header">
      <v-icon>{{ icons.mdiMagnify }}</v-icon> Search ToDo
    </h2>
    <v-container class="todo__find_container align-center">
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-model.trim="todoTitle"
            label="Title todo"
          ></v-text-field>
        </v-col>
        <v-col cols="4" class="d-flex justify-end">
          <!-- <v-btn
            class="todo__find_btn"
            text
            :disabled="!isActive"
            @click="$emit('find', todoTitle)"
            >Apply</v-btn
          > -->

          <slot name="btn"></slot>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mdiMagnify } from "@mdi/js";

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
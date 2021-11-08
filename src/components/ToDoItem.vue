<template>
  <div class="todo__item__wrapper">
    <li
      @mouseover="visible = true"
      @mouseleave="visible = false"
      class="d-flex justify-space-between align-center"
    >
      <v-checkbox 
      class="todo__item__checkbox"
      v-model="selected"
      color="red"
      >
        <template 
        v-slot:label
        >
          <span
          class="checkbox__label"
          :class="{ select: selected }"
          >{{ task }}
          </span>
        </template>
      </v-checkbox>
      <v-btn 
      class="todo__item__delete"
      :class="{ visible: !visible }" 
      text 
      @click="$emit('delete', index)"
      >
        <v-icon>
          {{ icons.mdiDelete }}
        </v-icon>
        Delete
      </v-btn>
    </li>
    <v-divider></v-divider>
  </div>
</template>

<script>
import { mdiDelete } from "@mdi/js";

export default {
  name: "ToDoItem",
  props: ["task", "index"],
  data: () => ({
    selected: false,
    visible: false,
    icons: {
      mdiDelete,
    },
  }),
};
</script>

<style scoped>
.todo__item__checkbox:hover {
  color: #f7b7b7;
}
.todo__item__checkbox .checkbox__label {
  color: rgb(0, 0, 0);
  font-weight: 600;
}
.todo__list > div:last-child > hr.v-divider {
  display: none;
}
.todo__item__delete {
  font-weight: 600;
}
.select {
  text-decoration: line-through;
}
.visible {
  visibility: hidden;
}
</style>
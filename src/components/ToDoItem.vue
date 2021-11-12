<template>
  <div
    class="todo__item__wrapper"
    draggable
    @dragover.prevent
    @dragstart="$emit('dragstart', $event, index)"
    @drop="$emit('drop', $event, index)"
  >
    <div
      @mouseover="visible = true"
      @mouseleave="visible = false"
      class="d-flex justify-space-between align-center"
    >
      <v-checkbox
        class="todo__item__checkbox"
        v-model="localSelected"
        color="red"
        @click="$emit('changeSelect', index, localSelected)"
      >
        <template v-slot:label>
          <span class="checkbox__label" :class="{ select: localSelected }"
            >{{ task.task["title"] }}
          </span>
        </template>
      </v-checkbox>
      <v-btn
        class="todo__item__delete"
        text
        :class="{ visible: !visible }"
        @click="$emit('delete', index)"
      >
        <v-icon>
          {{ icons.mdiDelete }}
        </v-icon>
        Delete
      </v-btn>
    </div>
    <v-divider></v-divider>
  </div>
</template>

<script>
import { mdiDelete } from "@mdi/js";

export default {
  name: "ToDoItem",
  props: ["task", "index", "selected"],
  data: () => ({
    localSelected: false,
    visible: false,
    icons: {
      mdiDelete,
    },
  }),
  mounted() {
    this.localSelected = this.selected;
  },
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
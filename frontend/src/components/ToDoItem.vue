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
      <span class="todo__item__info ml-auto">
        Date create: {{ task.date_create.substr(0, 10) }} Time:
        {{ formattedTime(task.date_create) }}
      </span>
      <v-btn
        class="todo__item__delete"
        text
        :class="{ visible: !visible }"
        @click.stop="deleteDialog = true"
      >
        <v-icon>
          {{ icons.mdiDelete }}
        </v-icon>
        Delete
      </v-btn>
      <DeleteDialog :dialog="deleteDialog" @delete="deleteTask">
        <template v-slot:title>
          <p>Delete this task</p>
        </template>
        <template v-slot:description>
          <p>Are you sure you want to delete this task ?</p>
        </template>
      </DeleteDialog>
    </div>
    <v-divider></v-divider>
  </div>
</template>

<script>
import { mdiDelete } from "@mdi/js";
import DeleteDialog from "./DeleteDialog.vue";

export default {
  name: "ToDoItem",
  props: ["task", "index", "selected"],
  components: {
    DeleteDialog,
  },
  data: () => ({
    localSelected: false,
    deleteDialog: false,
    visible: false,
    icons: {
      mdiDelete,
    },
  }),
  mounted() {
    this.localSelected = this.selected;
  },
  methods: {
    deleteTask(agree) {
      if(agree) {
        this.$emit('delete', this.index);
      }
      this.deleteDialog = false;
    },
    formattedTime: (time) => {
      return `${time.match(/(\d+:)/g)[0].replace(":", "")}:${time
        .match(/(\d+:)/g)[1]
        .replace(":", "")}`;
    },
  },
};
</script>

<style scoped>
.todo__item__info {
  font-size: 14px;
  font-weight: 300;
}
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
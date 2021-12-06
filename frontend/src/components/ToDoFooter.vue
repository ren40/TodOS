<template>
  <div class="todo__item__footer">
    <v-container class="d-flex justify-space-between">
      <div></div>
      <div>
        <v-btn class="todo__item__btn" text @click.stop="deleteDialog = true">
          <v-icon>
            {{ icons.mdiDelete }}
          </v-icon>
          Delete All
        </v-btn>
        <DeleteDialog :dialog="deleteDialog" @delete="deleteAllTask"
          ><template v-slot:title>
            <p>Delete all tasks</p>
          </template>
          <template v-slot:description>
            <p>Are you sure you want to delete everything?</p>
          </template></DeleteDialog
        >
      </div>
    </v-container>
  </div>
</template>

<script>
import DeleteDialog from "./DeleteDialog.vue";
import { mdiDelete } from "@mdi/js";

export default {
  name: "ToDoFoter",
  components: {
    DeleteDialog,
  },
  data: () => ({
    deleteDialog: false,
    icons: {
      mdiDelete,
    },
  }),
  methods: {
    deleteAllTask(agree) {
      if (agree === true) {
        this.$emit("deleteAll");
      }
      this.deleteDialog = false;
    },
  },
};
</script>

<style scoped>
.todo__item__btn {
  font-weight: 600;
}
</style>
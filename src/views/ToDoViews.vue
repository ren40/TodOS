<template>
  <v-container>
    <h1>Todos</h1>
    <v-row class="mt-3">
      <v-col>
        <v-sheet elevation="1" rounded>
          <v-form class="d-flex justify-space-between align-center px-2 mt-0">
            <v-text-field class="mt-0" v-model="task" required> </v-text-field>
            <v-btn text @click="addTask"> + ADD </v-btn>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet elevation="1" rounded>
          <ul class="todo__list px-3">
            <to-do-item
              v-for="(item, index) in taskList"
              v-bind:task="item.task"
              :selected="item.select"
              @changeSelect="selectTask"
              v-bind:index="index"
              v-bind:key="index*2"
              @delete="deleteTask"
            >
            </to-do-item>
          </ul>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ToDoItem from "../components/ToDoItem.vue";

export default {
  name: "ToDoViews",
  components: {
    ToDoItem,
  },
  data: () => ({
    task: "",
    taskList: [],
    //
  }),
  methods: {
    addTask() {
      let item = this.task;
      if (item != "") {
        this.taskList.push({ task: item, select: false });
        this.task = "";
      }
    },
    deleteTask(index) {
      delete this.taskList[index]
      this.taskList.splice(index, 1);
    },
    selectTask(index, inSelect) {
      this.taskList[index].select = inSelect
    }
  },
};
</script>

<style>
h1 {
  font-weight: 500;
}
</style>
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
            <li
              is="to-do-item"
              v-for="(item, index) in taskList"
              :task="item.task"
              :selected="item.select"
              :index="index"
              :key="item.id"
              @delete="deleteTask"
              @changeSelect="selectTask"
            ></li>
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
        let id = this.taskList.length * 24 * item.length;
        this.taskList.push({ id: id, task: item, select: false });
        this.task = "";
      }
    },
    deleteTask(index) {
      this.taskList.splice(index, 1);
    },
    selectTask(index, inSelect) {
      this.taskList[index].select = inSelect;
    },
  },
  async mounted() {
    await this.$http.get("/list").then((response) => {
      Array(...response.data).forEach((x) =>
        this.taskList.push({
          id: x.id,
          task: x.task["title"],
          select: x.complete,
        })
      );
    });
  },
};
</script>

<style>
h1 {
  font-weight: 500;
}
</style>
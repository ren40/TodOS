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
              :selected="item.complete"
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
        try {
          let id = this.taskList.length * 24 * item.length;
          let newTask = {
            id: id,
            task: {
              title: item,
            },
            complete: false,
          };
          this.$http.post("/list", newTask).then((res) => {
            if (res.status === 201) {
              this.taskList.push(newTask);
            } else {
              throw new Error(
                `Ошибка, таск не добавлен. Код ошибки ${res.status}`
              );
            }
          });
          this.task = "";
        } catch (ex) {
          alert(ex);
        }
      }
    },
    deleteTask(index) {
      try {
        let taskID = this.taskList[index].id;
        this.$http.delete(`/list/${taskID}`).then((res) => {
          if (res.status === 200) {
            this.taskList.splice(index, 1);
          } else {
            throw new Error(
              `Ошибка, не удалось удалить таск, id таска ${taskID}. Код ошибки ${res.status}`
            );
          }
        });
      } catch (ex) {
        alert(ex);
      }
    },
    selectTask(index, inSelect) {
      try {
        let taskID = this.taskList[index].id;
        this.$http
          .patch(`/list/${taskID}`, {
            complete: inSelect,
          })
          .then((res) => {
            if (res.status === 200) {
              this.taskList[index].complete = inSelect;
            } else {
              throw new Error(
                `Ошибка, не удалось изменить таск, id таска ${taskID}. Код ошибки ${res.status}`
              );
            }
          });
      } catch (ex) {
        alert(ex);
      }
    },
  },
  async mounted() {
    await this.$http.get("/list").then((response) => {
      Array(...response.data).forEach((x) =>
        this.taskList.push({
          id: x.id,
          task: x.task,
          complete: x.complete,
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
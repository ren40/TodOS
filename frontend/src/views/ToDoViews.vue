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
            <li class="todo__list_nav">
              <to-do-filter @filterDate="filterDate"></to-do-filter>
            </li>
            <li
              is="to-do-item"
              v-for="(item, index) in taskList"
              :task="item"
              :selected="item.complete"
              :index="index"
              :key="item.id"
              @dragover.prevent
              @delete="deleteTask"
              @changeSelect="selectTask"
              @dragstart="dragStart"
              @drop="dragFinish"
            ></li>
          </ul>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ToDoItem from "../components/ToDoItem.vue";
import ToDoFilter from "../components/ToDoFilter.vue";

export default {
  name: "ToDoViews",
  components: {
    ToDoItem,
    ToDoFilter,
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
            position: Number(this.taskList.length),
          };
          this.$http.post("/task", newTask).then((res) => {
            if (res.status === 201) {
              this.taskList.push({
                id: res.data._id,
                task: res.data.task,
                position: res.data.position,
                complete: res.data.complete,
              });
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
        this.$http.delete(`/task/${taskID}`).then((res) => {
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
          .patch(`/task/${taskID}`, {
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
    updatePositionTask(id, position) {
      try {
        let taskID = id;
        this.$http
          .patch(`/task/position`, {
            id: taskID,
            position: position,
          })
          .then((res) => {
            if (res.status !== 200) {
              throw new Error(
                `Ошибка, не удалось изменить таск, id таска ${taskID}. Код ошибки ${res.status}`
              );
            }
            return true;
          });
      } catch (ex) {
        console.log(ex);
      }
    },
    dragStart(event, index) {
      event.dataTransfer.setData("Text", index);

      event.dataTransfer.dropEffect = "move";
    },
    dragFinish(event, newIndex) {
      let _fromIndex = parseInt(event.dataTransfer.getData("Text"));

      this.updatePositionTask(this.taskList[_fromIndex].id, {
        fromIndex: _fromIndex,
        newPosition: newIndex,
      });

      this.taskList[newIndex] = this.taskList.splice(
        _fromIndex,
        1,
        this.taskList[newIndex]
      )[0];

      event.dataTransfer.clearData();
    },
    filterDate(_date_from, _date_to) {
      try {
        const filterDate = {
          date_from: _date_from ? _date_from : "",
          date_to: _date_to ? _date_to : "",
        };
        this.$http.post("/tasks/filter", filterDate).then((res) => {
          if (res.status !== 200) {
            throw new Error(
              `Ошибка, не получилось получить отфильтрованный список. Код ошибки ${res.status}`
            );
          }
          this.taskList = res.data;
        });
      } catch (ex) {
        alert(ex);
      }
    },
  },
  async mounted() {
    await this.$http.get("/tasks").then((response) => {
      Array(...response.data).forEach((x) =>
        this.taskList.push({
          id: x._id,
          task: x.task,
          position: x.position,
          complete: x.complete,
          date_create: x.date_create
        })
      );
    });
    this.taskList.sort((next, prev) => {
      if (next.position > prev.position) {
        return 1;
      }
      if (next.position < prev.position) {
        return -1;
      }
      return 0;
    });
  },
};
</script>

<style>
h1 {
  font-weight: 500;
}
ul {
  list-style: none;
}
</style>
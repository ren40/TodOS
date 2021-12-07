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
              <ToDoFilter ref="filter" @filterDate="filterDate"></ToDoFilter>
            </li>
            <ToDoItem
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
            ></ToDoItem>
            <li
              class="todo__list_footer"
              v-if="taskList.length > $appConfig.service.LIMIT_ELEMENT"
            >
              <ToDoFooter @deleteAll="deleteAllTask"></ToDoFooter>
            </li>
          </ul>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ToDoItem from "../components/ToDoItem.vue";
import ToDoFilter from "../components/ToDoFilter.vue";
import ToDoFooter from "../components/ToDoFooter.vue";

export default {
  name: "ToDoViews",
  components: {
    ToDoItem,
    ToDoFilter,
    ToDoFooter,
  },
  data: () => ({
    task: "",
    taskList: [],
    lastListSize: 0,
    //
  }),
  methods: {
    addTask() {
      let item = this.task;
      if (item != "") {
        let newTask = {
          task: {
            title: item,
          },
          complete: false,
          position: Number(this.taskList.length),
        };

        this.$http
          .post("/task", newTask)
          .then((res) => {
            switch (res.status) {
              case 200:
              case 201:
                this.taskList.push({
                  id: res.data._id,
                  task: res.data.task,
                  position: res.data.position,
                  complete: res.data.complete,
                  date_create: res.data.date_create,
                });
                this.handlerMessage(1, "Таск успешно добавлен");
                break;
              default:
                this.handlerMessage(
                  3,
                  `Ошибка, таск не добавлен. Код ошибки ${res.status}`
                );
            }
          })
          .catch((err) => {
            throw err.message;
          });
        this.task = "";
      }
    },
    deleteTask(index) {
      let taskID = this.taskList[index].id;
      this.$http
        .delete(`/task/${taskID}`)
        .then((res) => {
          switch (res.status) {
            case 200:
            case 201:
              this.taskList.splice(index, 1);
              this.handlerMessage(1, "Таск удален");
              break;
            default:
              this.handlerMessage(
                3,
                `Ошибка, не удалось удалить таск, id таска ${taskID}. 
                Код ошибки ${res.status}`
              );
          }
        })
        .catch((err) => {
          throw err.message;
        });
    },
    deleteAllTask() {
      this.$http
        .delete(`/tasks`)
        .then((res) => {
          switch (res.status) {
            case 200:
            case 201:
              this.handlerGetTaskList();
              this.handlerMessage(1, "Удалены все таски");
              break;
            default:
              this.handlerMessage(
                3,
                `Ошибка, не удалось удалить все таски. Код ошибки ${res.status}`
              );
          }
        })
        .catch((err) => {
          this.$toast.error(err.message, {
            position: "top-right",
          });
        });
    },
    selectTask(index, inSelect) {
      let taskID = this.taskList[index].id;
      this.$http
        .patch(`/task/${taskID}`, {
          complete: inSelect,
        })
        .then((res) => {
          switch (res.status) {
            case 200:
            case 201:
              this.taskList[index].complete = inSelect;
              this.handlerMessage(1, "Таск успешно изменен");
              break;
            default:
              this.handlerMessage(
                3,
                `Ошибка, не удалось изменить таск, id таска ${taskID}. Код ошибки ${res.status}`
              );
          }
        })
        .catch((err) => {
          throw err.message;
        });
    },
    updatePositionTask(id, position) {
      let taskID = id;
      this.$http
        .patch(`/task/position`, {
          id: taskID,
          position: position,
        })
        .then((res) => {
          switch (res.status) {
            case 200:
            case 201:
              this.handlerMessage(1, "Успешно изменено позиция таска")
              break;
            default:
              this.handlerMessage(
                3,
                `Ошибка, не удалось изменить таск, id таска ${taskID}. Код ошибки ${res.status}`
              );
          }
        })
        .catch((err) => {
          throw err.message;
        });
    },
    dragStart(event, index) {
      event.dataTransfer.setData("Text", index);

      event.dataTransfer.dropEffect = "move";
    },
    dragFinish(event, newIndex) {
      let _fromIndex = parseInt(event.dataTransfer.getData("Text"));
      if (this.taskList[_fromIndex].id != null) {
        this.updatePositionTask(this.taskList[_fromIndex].id, {
          fromIndex: _fromIndex,
          newPosition: newIndex,
        });

        this.taskList[newIndex] = this.taskList.splice(
          _fromIndex,
          1,
          this.taskList[newIndex]
        )[0];
      }

      event.dataTransfer.clearData();
    },
    filterDate(_date_from, _date_to) {
      const filterDate = {
        date_from: _date_from ? _date_from : "",
        date_to: _date_to ? _date_to : "",
      };
      this.$http
        .post("/tasks/filter", filterDate)
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(
              `Ошибка, не получилось получить отфильтрованный список. Код ошибки ${res.status}`
            );
          }
          this.taskList = res.data;
        })
        .catch((err) => {
          throw err.message;
        });
    },
    handlerGetTaskList() {
      this.$http
        .get("/tasks")
        .then((res) => {
          this.taskList = res.data;
          this.lastListSize = this.taskList.length;
        })
        .catch((err) => {
          throw err.message;
        });
    },
    handlerWatchFilter() {
      this.$watch("$refs.filter.isActive", (new_value) => {
        if (new_value === false && this.lastListSize != this.taskList.length) {
          this.handlerGetTaskList();
        }
      });
    },
    handlerMessage(mode, msg) {
      switch (mode) {
        case 0:
          this.$toast.info(msg, {
            position: "top-right",
          });
          break;
        case 1:
          this.$toast.success(msg, {
            position: "top-right",
          });
          break;
        case 2:
          this.$toast.warning(msg, {
            position: "top-right",
          });
          break;
        case 3:
          this.$toast.error(msg, {
            position: "top-right",
          });
          break;
        default:
          this.$toast(msg, {
            position: "top-right",
          });
      }
    },
  },
  mounted() {
    this.handlerGetTaskList();
    this.handlerWatchFilter();
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
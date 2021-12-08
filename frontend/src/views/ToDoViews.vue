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
            this.taskList.push({
              id: res.data._id,
              task: res.data.task,
              position: res.data.position,
              complete: res.data.complete,
              date_create: res.data.date_create,
            });
            this.handlerMessage(
              this.parseHttpStatus(res.status) === 2 ? 1 : 2,
              "Таск успешно добавлен"
            );
          })
          .catch((err) => {
            let mode = this.parseHttpStatus(
              err.toString().replace(/[^0-9]/g, "")
            );
            if (mode === 4 || mode === 5) {
              this.handlerMessage(
                3,
                `Ошибка, таск не добавлен. Код ошибки ${err
                  .toString()
                  .replace(/[^0-9]/g, "")}`
              );
            } else {
              throw err.message;
            }
          });
        this.task = "";
      }
    },
    deleteTask(index) {
      let taskID = this.taskList[index].id;
      this.$http
        .delete(`/task/${taskID}`)
        .then((res) => {
          this.taskList.splice(index, 1);
          this.handlerMessage(
            this.parseHttpStatus(res.status) === 2 ? 1 : 2,
            "Таск удален"
          );
        })
        .catch((err) => {
          let mode = this.parseHttpStatus(
            err.toString().replace(/[^0-9]/g, "")
          );
          if (mode === 4 || mode === 5) {
            this.handlerMessage(
              3,
              `Ошибка, не удалось удалить таск, id таска ${taskID}. 
                Код ошибки ${err.toString().replace(/[^0-9]/g, "")}`
            );
          } else {
            throw err.message;
          }
        });
    },
    deleteAllTask() {
      this.$http
        .delete(`/tasks`)
        .then((res) => {
          this.handlerGetTaskList();
          this.handlerMessage(
            this.parseHttpStatus(res.status) === 2 ? 1 : 2,
            "Удалены все таски"
          );
        })
        .catch((err) => {
          let mode = this.parseHttpStatus(
            err.toString().replace(/[^0-9]/g, "")
          );
          if (mode === 4 || mode === 5) {
            this.handlerMessage(
              3,
              `Ошибка, не удалось удалить все таски. Код ошибки ${err
                .toString()
                .replace(/[^0-9]/g, "")}`
            );
          } else {
            throw err.message;
          }
        });
    },
    selectTask(index, inSelect) {
      let taskID = this.taskList[index].id;
      this.$http
        .patch(`/task/${taskID}`, {
          complete: inSelect,
        })
        .then((res) => {
          this.taskList[index].complete = inSelect;
          this.handlerMessage(
            this.parseHttpStatus(res.status) === 2 ? 1 : 2,
            "Таск успешно изменен"
          );
        })
        .catch((err) => {
          let mode = this.parseHttpStatus(
            err.toString().replace(/[^0-9]/g, "")
          );
          if (mode === 4 || mode === 5) {
            this.handlerMessage(
              3,
              `Ошибка, не удалось изменить таск, id таска ${taskID}. Код ошибки ${err
                .toString()
                .replace(/[^0-9]/g, "")}`
            );
          } else {
            throw err.message;
          }
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
          this.handlerMessage(
            this.parseHttpStatus(res.status) === 2 ? 1 : 2,
            "Успешно изменено позиция таска"
          );
        })
        .catch((err) => {
          let mode = this.parseHttpStatus(
            err.toString().replace(/[^0-9]/g, "")
          );
          if (mode === 4 || mode === 5) {
            this.handlerMessage(
              3,
              `Ошибка, не удалось изменить таск, id таска ${taskID}. Код ошибки ${err
                .toString()
                .replace(/[^0-9]/g, "")}`
            );
          } else {
            throw err.message;
          }
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
          this.handlerMessage(
            this.parseHttpStatus(res.status) === 2 ? 1 : 2,
            "Фильтр успешно применен"
          );
          this.taskList = res.data;
        })
        .catch((err) => {
          let mode = this.parseHttpStatus(
            err.toString().replace(/[^0-9]/g, "")
          );
          if (mode === 4 || mode === 5) {
            this.handlerMessage(
              3,
              `Ошибка, не получилось получить отфильтрованный список. Код ошибки ${err
                .toString()
                .replace(/[^0-9]/g, "")}`
            );
          } else {
            throw err.message;
          }
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
          let mode = this.parseHttpStatus(
            err.toString().replace(/[^0-9]/g, "")
          );
          if (mode === 4 || mode === 5) {
            this.handlerMessage(
              3,
              `Ошибка, не удалось подгрузить список тасков. 
                Код ошибки ${err.toString().replace(/[^0-9]/g, "")}`
            );
          } else {
            throw err.message;
          }
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
          this.$toast.info(msg);
          break;
        case 1:
          this.$toast.success(msg);
          break;
        case 2:
          this.$toast.warning(msg);
          break;
        case 3:
          this.$toast.error(msg);
          break;
        default:
          this.$toast(msg);
      }
    },
    parseHttpStatus(status) {
      return status ? parseInt(status.toString().split("")[0]) : 0;
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
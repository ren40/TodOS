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
              <ToDoHeader
                @filterDate="filterDate"
                @returnList="returnLastList"
                @search="searchToDo"
              />
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
import ToDoFooter from "../components/ToDoFooter.vue";
import ToDoHeader from "../components/ToDoHeader.vue";

export default {
  name: "ToDoViews",
  components: {
    ToDoItem,
    ToDoFooter,
    ToDoHeader,
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
          })
          .catch((err) => {
            this.handlerErrorMessage(err.message);
          });
        this.task = "";
      }
    },
    deleteTask(index) {
      let taskID = this.taskList[index].id;
      this.$http
        .delete(`/task/${taskID}`)
        .then(() => {
          this.taskList.splice(index, 1);
        })
        .catch((err) => {
          this.handlerErrorMessage(err.message);
        });
    },
    deleteAllTask() {
      this.$http
        .delete(`/tasks`)
        .then(() => {
          this.handlerGetTaskList();
        })
        .catch((err) => {
          this.handlerErrorMessage(err.message);
        });
    },
    selectTask(index, inSelect) {
      let taskID = this.taskList[index].id;
      this.$http
        .patch(`/task/${taskID}`, {
          complete: inSelect,
        })
        .then(() => {
          this.taskList[index].complete = inSelect;
        })
        .catch((err) => {
          this.handlerErrorMessage(err.message);
        });
    },
    updatePositionTask(id, position) {
      let taskID = id;
      this.$http
        .patch(`/task/position`, {
          id: taskID,
          position: position,
        })
        .then(() => {})
        .catch((err) => {
          this.handlerErrorMessage(err.message);
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
    filterDate(_date_from, _date_to, parm) {
      const filterDate = {
        date_from: _date_from ? _date_from : "",
        date_to: _date_to ? _date_to : "",
      };
      this.$http
        .post("/tasks/filter", filterDate, { params: parm })
        .then((res) => {
          this.taskList = res.data;
        })
        .catch((err) => {
          this.handlerErrorMessage(err.message);
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
          this.handlerErrorMessage(err.message);
        });
    },
    returnLastList() {
      if (this.lastListSize != this.taskList.length) {
        this.handlerGetTaskList();
      }
    },
    handlerMessage(msg) {
      this.$toast.info(msg);
    },
    handlerErrorMessage(msg) {
      this.$toast.error(msg);
    },
    searchToDo(search_item, parm) {
      console.log(parm);
      this.$http
        .patch("/task/search", { search: search_item }, { params: parm })
        .then((res) => {
          this.taskList = res.data;
        })
        .catch((err) => {
          this.handlerMessage(true, err.message);
        });
    },
  },
  mounted() {
    this.handlerGetTaskList();
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
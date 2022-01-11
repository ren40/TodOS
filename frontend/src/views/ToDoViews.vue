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
                @searchAndFilter="searchAndFilter"
                @returnList="returnLastList"
              />
              <v-label>Total task: {{ totalTask }}</v-label>
              <v-divider></v-divider>
            </li>
            <v-virtual-scroll
              ref="scroll"
              :items="taskList"
              @scroll.native="scrolling"
              :item-height="66"
              :height="300"
              class="todo_list"
            >
              <template v-slot="{ item, index }">
                <ToDoItem
                  :task="item"
                  :selected="item.complete"
                  :index="index"
                  :key="item._id"
                  @dragover.prevent
                  @delete="deleteTask"
                  @changeSelect="selectTask"
                  @dragstart="dragStart"
                  @drop="dragFinish"
                ></ToDoItem>
              </template>
            </v-virtual-scroll>
          </ul>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ToDoItem from "../components/ToDoItem.vue";
import ToDoHeader from "../components/ToDoHeader.vue";

export default {
  name: "ToDoViews",
  components: {
    ToDoItem,
    ToDoHeader,
  },
  data: () => ({
    task: "",
    taskList: [],
    lastListSize: 0,
    totalTask: 0,
    page: 1,
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
            this.taskList.unshift({
              _id: res.data._id,
              task: res.data.task,
              position: res.data.position,
              complete: res.data.complete,
              date_create: res.data.date_create,
            });
            this.totalTask++;
          })
          .catch((err) => {
            this.handlerErrorMessage(err.message);
          });
        this.task = "";
      }
    },
    deleteTask(index) {
      let taskID = this.taskList[index]._id;
      this.$http
        .delete(`/task/${taskID}`)
        .then(() => {
          this.taskList.splice(index, 1);
          this.totalTask--;
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
      let taskID = this.taskList[index]._id;
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
      if (this.taskList[_fromIndex]._id != null) {
        this.updatePositionTask(this.taskList[_fromIndex]._id, {
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
    handlerGetTaskList() {
      this.$http
        .get("/tasks", {
          params: {
            limit: this.$appConfig.service.LIMIT_ELEMENT,
            page: this.page,
          },
        })
        .then((res) => {
          this.taskList = res.data.tasks;
          this.totalTask = res.data.totalElement;
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
    handlerErrorMessage(msg) {
      this.$toast.error(msg);
    },
    searchAndFilter(parm) {
      parm.limit = this.$appConfig.service.LIMIT_ELEMENT;
      parm.page = this.page;
      this.$http
        .patch("/task", null, { params: parm })
        .then((res) => {
          this.taskList = res.data;
        })
        .catch((err) => {
          this.handlerErrorMessage(err.message);
        });
    },
    scrolling(event) {
      const element = event.currentTarget || event.target;
      if (
        element &&
        element.scrollHeight - element.scrollTop === element.clientHeight &&
        this.page < this.totalTask / this.$appConfig.service.LIMIT_ELEMENT
      ) {
        if (
          this.page <
          this.totalTask / this.$appConfig.service.LIMIT_ELEMENT
        ) {
          this.page++;

          this.$http
            .get("/tasks", {
              params: {
                limit: this.$appConfig.service.LIMIT_ELEMENT,
                page: this.page,
              },
            })
            .then((result) => {
              this.taskList = [...this.taskList, ...result.data.tasks];
              this.lastListSize = this.taskList.length;
            })
            .catch((err) => {
              this.handlerErrorMessage(err.message);
            });
        }
      }
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
.todo_list {
  overflow: scroll !important;
}
</style>

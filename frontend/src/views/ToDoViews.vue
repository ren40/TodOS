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
    queryParm: {},
    pageMutationLists: 1,
    totalMutationLists: 0,
    isFindOrFilter: false,
    //
  }),
  methods: {
    addTask() {
      let item = this.task;
      let position = this.totalTask++;
      if (item != "") {
        let newTask = {
          task: {
            title: item,
          },
          complete: false,
          position: position,
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
          fromIndex: this.taskList[_fromIndex].position,
          newPosition: this.taskList[newIndex].position,
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
        this.page = 1;
        this.pageMutationLists = 1;
        this.totalMutationLists = 0;
        this.handlerGetTaskList();
        this.isFindOrFilter = false;
      }
    },
    handlerErrorMessage(msg) {
      this.$toast.error(msg);
    },
    searchAndFilter(parm) {
      parm.limit = this.$appConfig.service.LIMIT_ELEMENT;
      let isNewQuery =
        Object.keys(this.queryParm).length - 1 === Object.keys(parm).length;
      let isNewDate =
        this.queryParm.date_from != parm.date_from ||
        this.queryParm.date_to != parm.date_to;

      this.queryParm = parm;
      if (isNewQuery && !isNewDate) {
        this.sendQuery();
      } else {
        this.pageMutationLists = 1;
        this.totalMutationLists = 0;
        this.sendQuery();
      }
    },
    sendQuery() {
      this.queryParm.page = this.pageMutationLists;
      if (this.totalMutationLists === 0) {
        this.getMutationTasks(this.queryParm);
      } else if (this.isOutOfRangePageMutationList) {
        this.loadMoreMutationTasks(this.queryParm);
      }
      this.isFindOrFilter = true;
    },
    scrolling(event) {
      const element = event.currentTarget || event.target;
      const collision = this.isCollisionScrollElement(element);
      if (collision) {
        if (!this.isFindOrFilter && this.isOutOfRangePage) {
          this.page++;
          this.loadMoreTasks();
        } else if (this.isFindOrFilter) {
          this.sendQuery();
        }
      }
    },
    isCollisionScrollElement(element) {
      return (
        element &&
        element.scrollHeight - element.scrollTop === element.clientHeight
      );
    },
    loadTaskSmallLimit() {
      window.onscroll = () => {
        let currentScroll = Math.round(
          document.documentElement.scrollTop +
            document.documentElement.clientHeight
        );
        let isCollisionWindow =
          currentScroll === document.documentElement.offsetHeight;
        if (isCollisionWindow && this.taskList.length < 5) {
          if (!this.isFindOrFilter) {
            if (this.isOutOfRangePage) {
              this.page++;
              this.loadMoreTasks();
            }
          } else {
            this.sendQuery();
          }
        }
      };
    },
    loadMoreTasks() {
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
    },
    loadMoreMutationTasks(parm) {
      this.$http
        .patch("/task", null, { params: parm })
        .then((res) => {
          this.taskList = [...this.taskList, ...res.data.tasks];
          this.pageMutationLists++;
        })
        .catch((err) => {
          this.handlerErrorMessage(err.message);
        });
    },
    getMutationTasks(parm) {
      this.$http
        .patch("/task", null, { params: parm })
        .then((res) => {
          this.pageMutationLists++;
          this.taskList = res.data.tasks;
          this.totalMutationLists = res.data.totalElement;
        })
        .catch((err) => {
          this.handlerErrorMessage(err.message);
        });
    },
  },
  mounted() {
    this.handlerGetTaskList();
    this.loadTaskSmallLimit();
  },
  computed: {
    isOutOfRangePage: function () {
      return this.page < this.totalTask / this.$appConfig.service.LIMIT_ELEMENT;
    },
    isOutOfRangePageMutationList: function () {
      return (
        this.pageMutationLists <=
        this.totalMutationLists / this.$appConfig.service.LIMIT_ELEMENT
      );
    },
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

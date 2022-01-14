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
            <v-progress-circular
              v-if="!isLoad"
              indeterminate
              :size="100"
              :width="10"
              color="red"
            ></v-progress-circular>
            <v-virtual-scroll
              ref="scroll"
              :key="scrollKey"
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
            <li
              v-if="$appConfig.service.LIMIT_ELEMENT < 5 && taskList.length < 5"
              class="d-flex justify-center"
              @click="loadTaskSmallLimit"
            >
              <v-btn text :disabled="isDisabled"> Download more </v-btn>
            </li>
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
    load: false,
    scrollKey: 0,
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
      this.load = false;
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
          this.load = true;
        })
        .catch((err) => {
          this.handlerErrorMessage(err.message);
        })
        .finally(() => {
          this.load = true;
        });
    },
    returnLastList() {
      if (this.lastListSize != this.taskList.length || this.isFindOrFilter) {
        this.queryParm = {};
        this.page = 1;
        this.pageMutationLists = 1;
        this.totalMutationLists = 0;
        this.handlerGetTaskList();
        this.isFindOrFilter = false;
        this.forceRerenderScroll();
      }
    },
    handlerErrorMessage(msg) {
      this.$toast.error(msg);
    },
    searchAndFilter(parm) {
      parm.limit = this.$appConfig.service.LIMIT_ELEMENT;

      let isOldQuery =
        Object.keys(this.queryParm).length - 1 === Object.keys(parm).length;

      let isOldDate =
        this.queryParm.date_from && this.queryParm.date_to
          ? this.queryParm.date_from === parm.date_from &&
            this.queryParm.date_to === parm.date_to
          : false;

      let isOldSearchItem =
        this.queryParm.searchItem && !parm.searchItem
          ? this.queryParm.searchItem === parm.searchItem
          : false;

      let isOverloadedList = this.totalTask === this.taskList.length;

      this.queryParm = parm;

      if (isOverloadedList) {
        this.forceRerenderScroll();
      }

      if (isOldQuery) {
        if (isOldDate && isOldSearchItem) {
          this.sendQuery();
        } else if (isOldSearchItem) {
          this.sendQuery();
        } else {
          this.newQuery();
        }
      } else {
        this.newQuery();
      }
    },
    newQuery() {
      this.pageMutationLists = 1;
      this.totalMutationLists = 0;
      this.sendQuery();
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
      let bottom = element.scrollHeight - Math.round(element.scrollTop);
      return element && bottom === element.clientHeight;
    },
    loadTaskSmallLimit() {
      if (!this.isFindOrFilter) {
        if (this.isOutOfRangePage) {
          this.page++;
          this.loadMoreTasks();
        }
      } else {
        this.sendQuery();
      }
    },
    loadMoreTasks() {
      this.load = false;
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
          this.load = true;
        })
        .catch((err) => {
          this.handlerErrorMessage(err.message);
        })
        .finally(() => {
          this.load = true;
        });
    },
    loadMoreMutationTasks(parm) {
      this.load = false;
      this.$http
        .patch("/task", null, { params: parm })
        .then((res) => {
          this.taskList = [...this.taskList, ...res.data.tasks];
          this.pageMutationLists++;
          this.load = true;
        })
        .catch((err) => {
          this.handlerErrorMessage(err.message);
        })
        .finally(() => {
          this.load = true;
        });
    },
    getMutationTasks(parm) {
      this.load = false;
      this.$http
        .patch("/task", null, { params: parm })
        .then((res) => {
          this.pageMutationLists++;
          this.taskList = res.data.tasks;
          this.totalMutationLists = res.data.totalElement;
          this.load = true;
        })
        .catch((err) => {
          this.handlerErrorMessage(err.message);
        })
        .finally(() => {
          this.load = true;
        });
    },
    forceRerenderScroll() {
      this.scrollKey += 1;
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
        this.pageMutationLists <
        this.totalMutationLists / this.$appConfig.service.LIMIT_ELEMENT
      );
    },
    isLoad: function () {
      return this.load;
    },
    isDisabled: function () {
      // return this.totalMutationLists
      if (this.isFindOrFilter) {
        return this.totalMutationLists === this.taskList.length;
      }
      return this.totalTask === this.taskList.length;
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
.v-progress-circular {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
/* .todo_list {
  overflow-y: scroll !important;
} */
</style>

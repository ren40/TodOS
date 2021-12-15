<template>
  <div>
    <ToDoFilter
      ref="filter"
      @resetList="returnList"
      @changeActive="changeActive"
    >
      <v-btn
        slot="btn"
        class="todo__find_btn"
        text
        :class="{ visible: !isActiveFilter }"
        @click="handlerFilter"
        >Apply</v-btn
      >
    </ToDoFilter>
    <v-divider></v-divider>
    <ToDoFind
      ref="search"
      @resetList="returnList"
      @changeActive="changeActive"
    >
      <v-btn
        slot="btn"
        class="todo__find_btn"
        text
        :class="{ visible: !isActiveFind }"
        @click="handlerSearch"
        >Apply</v-btn
      >
    </ToDoFind>
    <v-col v-if="activeComponents.length > 1" class="d-flex justify-end">
      <v-btn @click="handlerMultipleRequest">apply</v-btn>
    </v-col>

    <v-divider></v-divider>
  </div>
</template>

<script>
import ToDoFilter from "./ToDoFilter.vue";
import ToDoFind from "./ToDoFind.vue";
export default {
  name: "ToDoHeader",
  components: {
    ToDoFilter,
    ToDoFind,
  },
  data() {
    return {
      activeComponents: [],
    };
  },
  computed: {
    isActiveFind() {
      return this.activeComponents.indexOf("Find") >= 0 &&
        this.activeComponents.length < 2
        ? true
        : false;
    },
    isActiveFilter() {
      return this.activeComponents.indexOf("Filter") >= 0 &&
        this.activeComponents.length < 2
        ? true
        : false;
    },
  },
  methods: {
    changeActive(componentName, status) {
      if (status) {
        this.activeComponents.push(componentName);
      } else {
        let index = this.activeComponents.indexOf(componentName);
        this.activeComponents.splice(index, 1);
        this.returnList();
      }
      console.log(this.activeComponents);
    },

    returnList() {
      this.$emit("returnList");
    },

    handlerSearch() {
      let searchTitle = this.$refs.search.todoTitle;
      if (searchTitle) {
        let params = null;
        this.$emit("search", searchTitle, params);
      }
    },

    handlerFilter() {
      const date_from = this.$refs.filter.date_from;
      const date_to = this.$refs.filter.date_to;
      if (date_from && date_to) {
        let params = null;
        this.$emit("filterDate", date_from, date_to, params);
      }
    },
    handlerMultipleRequest() {
      const searchTitle = this.$refs.search.todoTitle;
      const date_from = this.$refs.filter.date_from;
      const date_to = this.$refs.filter.date_to;
      if (this.activeComponents[0] === "Find") {
        let params = {
          filter: true,
          date_from: date_from,
          date_to: date_to,
        };
        this.$emit("search", searchTitle, params);
      } else {
        let params = {
          search: true,
          searchItem: searchTitle,
        };
        this.$emit("filterDate", date_from, date_to, params);
      }
    },
  },
};
</script>

<style>
.visible {
  visibility: hidden;
}
</style>
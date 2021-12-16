<template>
  <div>
    <ToDoFilter
      ref="filter"
      @resetList="returnList"
      @changeActive="changeActive"
      @filter="handlerFilter"
    >
    </ToDoFilter>
    <v-divider></v-divider>
    <ToDoFind
      ref="search"
      @resetList="returnList"
      @changeActive="changeActive"
      @search="handlerSearch"
    >
    </ToDoFind>
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
  methods: {
    changeActive(componentName, status) {
      if (status) {
        this.activeComponents.push(componentName);
      } else {
        let index = this.activeComponents.indexOf(componentName);
        this.activeComponents.splice(index, 1);
        this.returnList();
      }
    },

    returnList() {
      if (this.activeComponents.length === 0) {
        this.$emit("returnList");
      } else {
        if (this.activeComponents[0] === "Find") {
          this.handlerSearch(this.$refs.search.todoTitle);
        } else {
          this.handlerFilter(
            this.$refs.filter.date_from,
            this.$refs.filter.date_to
          );
        }
      }
    },

    handlerSearch(searchItem) {
      if (searchItem && this.activeComponents.length === 1) {
        let params = null;
        this.$emit("search", searchItem, params);
      } else if (searchItem && this.activeComponents.length > 1) {
        this.handlerMultipleRequest();
      } else {
        this.returnList();
      }
    },

    handlerFilter(from, to) {
      if (from && to && this.activeComponents.length === 1) {
        let params = null;
        this.$emit("filterDate", from, to, params);
      } else if (from && to && this.activeComponents.length > 1) {
        this.handlerMultipleRequest();
      } else {
        this.returnList();
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
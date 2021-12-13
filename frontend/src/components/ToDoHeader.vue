<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <ToDoFilter @filter="filter" @resetList="returnList" />
      </v-tab-item>
      <v-tab-item>
        <ToDoFind @find="searchToDo" @resetList="returnList" />
      </v-tab-item>
    </v-tabs-items>
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
      tab: null,
      items: ["filter", "search"],
    };
  },
  methods: {
    filter(from, to) {
      this.$emit("filterDate", from, to);
    },
    searchToDo(search_item) {
      if (search_item) {
        this.$emit("search", search_item);
      }
    },
    returnList(returnList) {
      if (returnList === true) {
        this.$emit("returnList", returnList);
      }
    },
  },
};
</script>

<style>
</style>
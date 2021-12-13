<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <ToDoFilter ref="filter" @filter="filter" />
      </v-tab-item>
      <v-tab-item>
        <ToDoFind @find="searchToDo" />
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
      items: ["filter", "find"],
    };
  },
  methods: {
    filter(from, to) {
      console.log(from, to);
      this.$emit("filterDate", from, to);
    },
    searchToDo(search_item){
        if(search_item) {
            this.$emit("search", search_item)
        }
    },
    handlerWatchFilter() {
      this.$watch("$refs.filter.isActive", (new_value) => {
        console.log(new_value);
        if (new_value === false) {
          this.$emit("returnList", true);
        }
      });
    },
    mounted() {
      this.handlerWatchFilter()
    },
  },
};
</script>

<style>
</style>
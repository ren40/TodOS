<template>
  <div class="todo__item__filter">
    <h2 class="todo__filter_header">Filter ToDo</h2>
    <v-container class="todo__filter_container align-center">
      <v-row>
        <v-col cols="1" class="todo__filter_container">
          <v-checkbox v-model="isActive" class="todo__filter_check">
            <template v-slot:label>
              <span class="checkbox__label"> Activate filter </span>
            </template>
          </v-checkbox>
        </v-col>
        <v-col>
          <v-menu
            v-model="menu_from"
            offset-y
            transition="scale-transition"
            :close-on-content-click="false"
            :nudge-right="40"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                label="From Date"
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
                :value="date_from"
                :disabled="!isActive"
              >
              </v-text-field>
            </template>
            <v-date-picker
              v-model="date_from"
              no-title
              :max="date_to"
              @input="menu_from = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <v-menu
            v-model="menu_to"
            offset-y
            transition="scale-transition"
            :close-on-content-click="false"
            :nudge-right="40"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                label="To Date"
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
                :value="date_to"
                :disabled="!isActive"
              >
              </v-text-field>
            </template>
            <v-date-picker
              v-model="date_to"
              no-title
              @input="menu_to = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="2" class="todo__filter_container">
          <v-btn
            class="todo__filter_btn"
            text
            :disabled="!isActive"
            @click="$emit('filterDate', date_from, date_to)"
          >
            Apply
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
  </div>
</template>

<script>
export default {
  name: "ToDoFilter",
  data() {
    return {
      date_from: new Date(),
      date_to: new Date().toISOString().substr(0, 10),
      menu_to: false,
      menu_from: false,

      isActive: false,
    };
  },
  mounted: function () {
    this.date_from.setDate(this.date_from.getDate() - 1);
    this.date_from = this.date_from.toISOString().substr(0, 10);
  },
};
</script>

<style scoped>
.todo__filter_header {
  font-weight: 300;
}
.todo__filter_container {
  position: relative;
}
.todo__filter_check {
  margin-top: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-39%);
}
.todo__filter_btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>
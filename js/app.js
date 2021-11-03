const Todo = {
  data() {
    return {
      todoItem: "",
      todoList: ["text"],
    };
  },
  methods: {
    addItem() {
      let item = this.todoItem;
      if (item != "") {
        this.todoList.push(item);
        this.todoItem = "";
      }
    },
    deleteItem(index) {
      this.todoList.splice(index, 1)
    },
  },
};

const app = Vue.createApp(Todo);

app.component("todo_item", {
  props: ["todo", "index"],
  data() {
    return {
      checked: false,
      visible: false
    };
  },
  template: `
  <li v-on:mouseover="visible = true" v-on:mouseleave="visible = false" class="row todo_item">
  <div class="col-auto">
    <input type="checkbox" class="item_check" v-model="checked" />
  </div>            
    <div  class="col-5 item_text" v-bind:class={check:checked}> {{ todo }} </div>
  <div class="col-3 offset-2">
    <button class="btn_item" v-bind:class={invisible:!visible}  @click="$emit('delete', index)"><i class="fa-solid fa-trash"></i> Delete</button>     
  </div>
            
  </li>
            
  <hr color="gray" width="98%">
            `,
});

app.mount("#app");

import ToDoItem from "@/components/ToDoItem";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuetify from "vuetify";

const localVue = createLocalVue();

function addElemWithDataAppToBody() {
  const app = document.createElement("div");
  app.setAttribute("data-app", true);
  document.body.append(app);
}

addElemWithDataAppToBody();

describe("ToDoItem.vue", () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("Testing the rendering of the TodoItem component", () => {
    const task = {
      _id: "123123123",
      task: {
        title: "Test",
      },
      position: 1,
      complete: false,
      date_create: new Date(Date.now()).toISOString(),
    };

    wrapper = mount(ToDoItem, {
      localVue,
      vuetify,
      propsData: { task },
    });
    wrapper.vm.$nextTick();

    expect(wrapper.find(".checkbox__label").text()).toBe(task.task.title);
  });

  it("Testing method formattedTime()", () => {
    const task = {
      date_create: "2022-01-14T18:25:22.429Z",
    };

    expect(wrapper.vm.formattedTime(task.date_create)).toBe("18:25");
  });

  it("Testing method deleteTask()", async () => {
    const task = {
      _id: "123123123",
      task: {
        title: "Test",
      },
      position: 1,
      complete: false,
      date_create: new Date(Date.now()).toISOString(),
    }; 
    const index = 1

    wrapper = mount(ToDoItem, {
      localVue,
      vuetify,
      propsData: { task, index },
    });

    wrapper.vm.deleteTask(true)

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().delete).toBeTruthy()

    expect(wrapper.emitted().delete[0]).toEqual([index])
  });
});

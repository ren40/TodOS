import ToDoFooter from "@/components/ToDoFooter";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuetify from "vuetify";

const localVue = createLocalVue();

function addElemWithDataAppToBody() {
  const app = document.createElement("div");
  app.setAttribute("data-app", true);
  document.body.append(app);
}

addElemWithDataAppToBody();

describe("ToDoFooter.vue", () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("Testing component rendering", () => {
    wrapper = mount(ToDoFooter, {
      localVue,
      vuetify,
    });

    expect(wrapper.find(".todo__item__btn").exists()).toBe(true);
  });

  it("Testing by pressing a button", async () => {
    wrapper = mount(ToDoFooter, {
      localVue,
      vuetify,
    });

    let button = wrapper.find(".v-btn");
    await button.trigger("click");

    expect(wrapper.vm.deleteDialog).toBe(true);
  });

  it("Testing the deleteAllTask method with the value true", async () => {
    wrapper = mount(ToDoFooter, {
      localVue,
      vuetify,
    });

    wrapper.vm.deleteAllTask(true);

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().deleteAll).toBeTruthy();
  });

  it("Testing the deleteAllTask method with the value false", async () => {
    wrapper = mount(ToDoFooter, {
      localVue,
      vuetify,
    });

    wrapper.vm.deleteAllTask(false);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.deleteDialog).toBe(false);
  });
});

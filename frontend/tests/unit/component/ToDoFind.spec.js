import ToDoFind from "@/components/ToDoFind";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuetify from "vuetify";

const localVue = createLocalVue();

describe("ToDoFind.vue", () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("Testing component rendering", () => {
    wrapper = mount(ToDoFind, {
      localVue,
      vuetify,
    });

    expect(wrapper.find(".todo__find_container").exists()).toBe(true);
  });

  it("Testing the input rendering", () => {
    wrapper = mount(ToDoFind, {
      localVue,
      vuetify,
    });

    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("Testing the isActive method with the value Test", () => {
    wrapper = mount(ToDoFind, {
      localVue,
      vuetify,
    });

    wrapper.setData({
      todoTitle: "Test",
    });
    expect(wrapper.vm.isActive).toBe(true);
  });

  it("Testing the isActive method with an empty value", () => {
    wrapper = mount(ToDoFind, {
      localVue,
      vuetify,
    });

    wrapper.setData({
      todoTitle: "",
    });
    expect(wrapper.vm.isActive).toBe(false);
  });

  it("Testing the input component", async () => {
    wrapper = mount(ToDoFind, {
      localVue,
      vuetify,
    });

    let input = wrapper.find("input");
    await input.setValue("Test");
    input.trigger("input");

    expect(wrapper.vm.todoTitle).toBe("Test");
  });

  it("Testing the changeActive event", async () => {
    wrapper = mount(ToDoFind, {
      localVue,
      vuetify,
    });

    wrapper.vm.handlerActive("Test");

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().changeActive).toBeTruthy();
  });

  it("Testing the changeActive event", async () => {
    wrapper = mount(ToDoFind, {
      localVue,
      vuetify,
    });

    wrapper.vm.handlerActive("Test");

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().changeActive[0][1]).toEqual("Test");
  });
});

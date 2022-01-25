import ToDoHeader from "@/components/ToDoHeader";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
const localVue = createLocalVue();

describe("ToDoHeader.vue", () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("Testing the rendering of the ToDoFilter component", () => {
    wrapper = mount(ToDoHeader, {
      localVue,
      vuetify,
    });

    expect(wrapper.find(".todo__item__filter").exists()).toBe(true);
  });

  it("Testing the rendering of the ToDoFind component", () => {
    wrapper = mount(ToDoHeader, {
      localVue,
      vuetify,
    });

    expect(wrapper.find(".todo__item__find").exists()).toBe(true);
  });

  it("Testing the changeActive method", () => {
    wrapper = mount(ToDoHeader, {
      localVue,
      vuetify,
    });
    wrapper.vm.changeActive("Find", true);

    expect(wrapper.vm.activeComponents.length).toBe(1);
  });

  it("Testing the changeActive method", () => {
    wrapper = mount(ToDoHeader, {
      localVue,
      vuetify,
    });
    wrapper.vm.changeActive("Find", true);

    expect(wrapper.vm.activeComponents[0]).toBe("Find");
  });

  it("Testing the changeActive method", () => {
    wrapper = mount(ToDoHeader, {
      localVue,
      vuetify,
    });
    wrapper.vm.changeActive("Find", true);
    wrapper.vm.changeActive("Find", false);

    expect(wrapper.vm.activeComponents.length).toBe(0);
  });

  it("Testing the returnList method", () => {
    wrapper = mount(ToDoHeader, {
      localVue,
      vuetify,
    });

    wrapper.vm.returnList();

    expect(wrapper.emitted().returnList).toBeTruthy();
  });

  it("Testing the handlerSearch method", () => {
    wrapper = mount(ToDoHeader, {
      localVue,
      vuetify,
    });

    wrapper.setData({
      activeComponents: ["Find"],
    });

    wrapper.vm.handlerSearch("Test");

    expect(wrapper.emitted().searchAndFilter).toBeTruthy();
  });

  it("Testing the handlerSearch method", () => {
    wrapper = mount(ToDoHeader, {
      localVue,
      vuetify,
    });

    wrapper.setData({
      activeComponents: ["Find"],
    });

    wrapper.vm.handlerSearch("Test");

    expect(wrapper.emitted().searchAndFilter[0][0].searchItem).toEqual("Test");
  });

  it("Testing the handlerFilter method", () => {
    wrapper = mount(ToDoHeader, {
      localVue,
      vuetify,
    });

    wrapper.setData({
      activeComponents: ["Filter"],
    });

    let day1 = new Date(2022, 0, 1).toLocaleString();
    let day2 = new Date(2022, 0, 2).toLocaleString();
    wrapper.vm.handlerFilter(day1, day2);

    expect(wrapper.emitted().searchAndFilter).toBeTruthy();
  });

  it("Testing the handlerFilter method", () => {
    wrapper = mount(ToDoHeader, {
      localVue,
      vuetify,
    });

    wrapper.setData({
      activeComponents: ["Filter"],
    });
    let day1 = new Date(2022, 0, 1).toLocaleString();
    let day2 = new Date(2022, 0, 2).toLocaleString();
    wrapper.vm.handlerFilter(day1, day2);

    expect(wrapper.emitted().searchAndFilter[0][0].date_from).toEqual(day1);
  });
});

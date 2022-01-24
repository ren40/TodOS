import Vuetify from "vuetify";

import ToDoFilter from "@/components/ToDoFilter";
import { createLocalVue, mount } from "@vue/test-utils";

const localVue = createLocalVue();

describe("ToDoFilter.vue", () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("Testing component rendering", () => {
    wrapper = mount(ToDoFilter, {
      localVue,
      vuetify,
    });

    expect(wrapper.find(".v-btn").exists()).toBe(true);
  });

  it("Testing the checkbox rendering", async () => {
    wrapper = mount(ToDoFilter, {
      localVue,
      vuetify,
    });

    expect(wrapper.find(".v-input--selection-controls__input").exists()).toBe(
      true
    );
  });

  it("Testing the checkbox", async () => {
    wrapper = mount(ToDoFilter, {
      localVue,
      vuetify,
    });

    let checkbox = wrapper.find(".v-input--selection-controls__input");

    await checkbox.trigger("click");

    expect(wrapper.vm.isActive).toBe(true);
  });

  it("Testing the filter event", async () => {
    wrapper = mount(ToDoFilter, {
      localVue,
      vuetify,
    });

    let checkbox = wrapper.find(".v-input--selection-controls__input");

    await checkbox.trigger("click");

    wrapper.vm.$nextTick();

    let button = wrapper.find(".v-btn");

    await button.trigger("click");

    expect(wrapper.emitted().filter).toBeTruthy();
  });

  it("Testing the filter event for the date_from value", async () => {
    wrapper = mount(ToDoFilter, {
      localVue,
      vuetify,
    });

    const date_from = wrapper.vm.date_from;

    let checkbox = wrapper.find(".v-input--selection-controls__input");

    await checkbox.trigger("click");

    wrapper.vm.$nextTick();

    let button = wrapper.find(".v-btn");

    await button.trigger("click");

    expect(wrapper.emitted().filter[0][0]).toBe(date_from);
  });

  it("Testing the filter event for the date_to value", async () => {
    wrapper = mount(ToDoFilter, {
      localVue,
      vuetify,
    });

    const date_to = wrapper.vm.date_to;

    let checkbox = wrapper.find(".v-input--selection-controls__input");

    await checkbox.trigger("click");

    wrapper.vm.$nextTick();

    let button = wrapper.find(".v-btn");

    await button.trigger("click");

    expect(wrapper.emitted().filter[0][1]).toBe(date_to);
  });
});

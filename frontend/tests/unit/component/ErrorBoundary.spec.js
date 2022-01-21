import { shallowMount, createLocalVue, mount } from "@vue/test-utils";
import Vuetify from "vuetify";

import ErrorBoundary from "@/components/ErrorBoundary.vue";

const localVue = createLocalVue();

function addElemWithDataAppToBody() {
  const app = document.createElement("div");
  app.setAttribute("data-app", true);
  document.body.append(app);
}

addElemWithDataAppToBody();

describe("ErrorBoundary.vue", () => {
  let wrapper;
  let vuetify;
  beforeEach(() => {
    vuetify = new Vuetify();
  });
  it("Testing the modal dialog with the value error=true", async () => {
    wrapper = mount(ErrorBoundary, {
      localVue,
      vuetify,
    });

    wrapper.setData({
      error: true,
      description: "Test:description",
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".v-dialog__container").exists()).toBe(true);
  });

  it("Testing the modal dialog with the value error=false", async () => {
    wrapper = mount(ErrorBoundary, {
      localVue,
      vuetify,
    });

    wrapper.setData({
      error: false,
      description: "Test:description",
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find("v-dialog__container").exists()).toBe(false);
  });

  it("Testing button rendering", async () => {
    wrapper = mount(ErrorBoundary, {
      localVue,
      vuetify,
    });

    wrapper.setData({
      error: true,
      description: "Test:description",
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(".v-btn").exists()).toBe(true);
  });

  it("Testing computed method getTitleError", async () => {
    let local = {
      description: "Test:description",
    };

    expect(ErrorBoundary.computed.getTitleError.call(local)).toBe(
      "An error of the following type:Test"
    );
  });

  it("Testing computed method getDescriptionError", () => {
    let local = {
      description: "Title:Test",
    };

    expect(ErrorBoundary.computed.getDescriptionError.call(local)).toBe(
      "Error description: Test"
    );
  });

  it("Testing by pressing a button", async () => {
    wrapper = mount(ErrorBoundary, {
      localVue,
      vuetify,
    });

    wrapper.setData({
      error: true,
      description: "Test:description",
    });

    await wrapper.vm.$nextTick();

    const button = wrapper.find(".v-btn");
    button.trigger("click");
    
    await wrapper.vm.$nextTick();

    expect(wrapper.find("v-dialog__container").exists()).toBe(false);
  });
});

import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuetify from "vuetify";

import ErrorBoundary from "@/components/ErrorBoundary.vue";

describe("ErrorBoundary.vue", () => {
  let wrapper;
  const localVue = createLocalVue();
  beforeEach(() => {
    localVue.use(Vuetify);
  });

  it("Testing the modal dialog with the value error=true", async () => {
    wrapper = shallowMount(ErrorBoundary, {
      localVue,
    });

    wrapper.setData({
      error: true,
      description: "Test:description",
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find("v-dialog-stub").exists()).toBe(true);
  });


  it("Testing the modal dialog with the value error=false", async () => {
    wrapper = shallowMount(ErrorBoundary, {
      localVue,
    });

    wrapper.setData({
      error: false,
      description: "Test:description",
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find("v-dialog-stub").exists()).toBe(false);
  });

  it("test btn", async () => {
    wrapper = shallowMount(ErrorBoundary, {
      localVue: localVue,
    });

    wrapper.setData({
      error: true,
      description: "Test:description",
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find("v-btn-stub").exists()).toBe(true);
  });

  it("test computed method getTitleError", async () => {
    let local = {
      description: "Test:description",
    };

    expect(ErrorBoundary.computed.getTitleError.call(local)).toBe(
      "An error of the following type:Test"
    );
  });

  it("test computed method getDescriptionError", () => {
    let local = {
      description: "Title:Test",
    };

    expect(ErrorBoundary.computed.getDescriptionError.call(local)).toBe(
      "Error description: Test"
    );
  });
});

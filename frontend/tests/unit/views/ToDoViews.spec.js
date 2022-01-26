import ToDoViews from "@/views/ToDoViews";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import http from "./__mocks__/ToDoViews.mock";

const localVue = createLocalVue();

const $appConfig = {
  service: {
    BASE_API: "localhost",
    LIMIT_ELEMENT: 5,
  },
};

const $toast = {
  error: (msg) => msg,
};

const $http = http;

describe("ToDoViews", () => {
  let wrapper;
  let vuetify;
  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("Testing the rendering of the ToDoViews component", async (done) => {
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });

  it("Testing the handleGetTaskList method", async (done) => {
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });
    await wrapper.vm.handleGetTaskList();

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.taskList[0].task.title).toBe("15678");
      done();
    });
  });

  it("Testing the rendering of the add button", async (done) => {
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });

    let button = wrapper.find(".v-btn");
    wrapper.vm.$nextTick(() => {
      expect(button.text().trim()).toBe("+ ADD");
      done();
    });
  });

  it("Testing for clicking the add button", async (done) => {
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });
    wrapper.setData({
      task: "Test",
    });
    let button = wrapper.find(".v-btn");
    await button.trigger("click");
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.taskList[0].task.title).toBe("Test");
      done();
    });
  });

  it("Testing the input component", async (done) => {
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });

    let input = wrapper.find("input");
    await input.setValue("Test");
    input.trigger("input");

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.task).toBe("Test");
      done();
    });
  });

  it("Testing the rendering of a new element after adding", async (done) => {
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });

    wrapper.setData({
      task: "Test",
    });

    let button = wrapper.find(".v-btn");
    await button.trigger("click");

    wrapper.vm.$nextTick(() => {
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });

  it("Testing the deleteTask method", async (done) => {
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.deleteTask(0);
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.taskList[0].task.title).toBe("у21у21у122112у");
      done();
    });
  });

  it("Testing the isOutOfRangePage method", async (done) => {
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.isOutOfRangePage).toBe(true);
      done();
    });
  });

  it("Testing the isOutOfRangePageMutationList method", async (done) => {
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.isOutOfRangePageMutationList).toBe(false);
      done();
    });
  });

  it("Testing the getCurrentDay method", async (done) => {
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });
    await wrapper.vm.$nextTick();
    let num1 = wrapper.vm.getCurrentDay();
    await wrapper.vm.$nextTick();
    let num2 = wrapper.vm.getCurrentDay();
    await wrapper.vm.$nextTick(() => {
      expect(num2).toBeGreaterThan(num1);
      done();
    });
  });

  it("Testing the deleteCount value after executing the deleteTask method", async (done) => {
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });
    wrapper.setData({
      deleteCount: 4,
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.deleteTask(0);
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.deleteCount).toBe(0);
      done();
    });
  });

  it("Testing the page value after executing the DeleteTask method", async (done) => {
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });
    wrapper.setData({
      deleteCount: 4,
      page: 2,
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.deleteTask(0);
    await wrapper.vm.deleteTask(0);
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.page).toBe(1);
      done();
    });
  });

  it("Testing the pageModifiedList value after executing the DeleteTask method", async (done) => {
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });
    wrapper.setData({
      deleteCount: 4,
      pageModifiedList: 2,
      isFindOrFilter: true,
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.deleteTask(0);
    await wrapper.vm.deleteTask(0);
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.pageModifiedList).toBe(1);
      done();
    });
  });

  it("Testing the isOutOfRangeOfNumbersDeleted method", async (done) => {
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });
    wrapper.setData({
      deleteCount: 5,
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.isOutOfRangeOfNumbersDeleted).toBe(false);
      done();
    });
  });
});

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
    wrapper = mount(ToDoViews, {
      localVue,
      vuetify,
      mocks: {
        $appConfig,
        $http,
        $toast,
      },
    });
  });

  it("Testing the rendering of the ToDoViews component", async (done) => {
    await wrapper.vm.$nextTick();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });

  it("Testing the handleGetTaskList method", async (done) => {
    await wrapper.vm.handleGetTaskList();

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.taskList[0].task.title).toBe("15678");
      done();
    });
  });

  it("Testing the rendering of the add button", async (done) => {
    let button = wrapper.find(".v-btn");
    wrapper.vm.$nextTick(() => {
      expect(button.text().trim()).toBe("+ ADD");
      done();
    });
  });

  it("Testing for clicking the add button", async (done) => {
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
    let input = wrapper.find("input");
    await input.setValue("Test");
    input.trigger("input");

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.task).toBe("Test");
      done();
    });
  });

  it("Testing the rendering of a new element after adding", async (done) => {
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
    await wrapper.vm.$nextTick();
    await wrapper.vm.deleteTask(0);
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.taskList[0].task.title).toBe("??21??21??122112??");
      done();
    });
  });

  it("Testing the isOutOfRangePage method", async (done) => {
    await wrapper.vm.$nextTick();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.isOutOfRangePage).toBe(true);
      done();
    });
  });

  it("Testing the isOutOfRangePageMutationList method", async (done) => {
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
    wrapper.setData({
      deleteCount: 5,
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.isOutOfRangeOfNumbersDeleted).toBe(false);
      done();
    });
  });

  it("Testing the rendering of the ToDoViews component with the LIMIT_ELEMENT = 1 configuration", async (done) => {
    $appConfig.service.LIMIT_ELEMENT = 1;

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

  it("Testing the isOutOfRangePageAddedList method", async (done) => {
    $appConfig.service.LIMIT_ELEMENT = 1;
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
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.isOutOfRangePageAddedList).toBe(true);
      done();
    });
  });

  it("Testing the input component at the keydown.enter event", async (done) => {
    let input = wrapper.find("input");
    await input.setValue("Test");
    await input.trigger("keydown.enter");

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.taskList[0].task.title).toBe("Test");
      done();
    });
  });

  it("Testing the getModifiedTasks method", async (done) => {
    await wrapper.vm.getModifiedTasks();
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.taskList[0].task.title).toBe("Test1");
      done();
    });
  });

  it("Testing the returnLastList method", async (done) => {
    wrapper.setData({
      lastListSize: 1,
      isFindOrFilter: true,
    });

    await wrapper.vm.returnLastList();

    await wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.pageModifiedList).toBe(1);
      done();
    });
  });
});

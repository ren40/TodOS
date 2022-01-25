import DeleteDialog from "@/components/DeleteDialog";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuetify from "vuetify";
const localVue = createLocalVue();

function addElemWithDataAppToBody() {
  const app = document.createElement("div");
  app.setAttribute("data-app", true);
  document.body.append(app);
}

addElemWithDataAppToBody();

describe("DeleteDialog.vue", () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("Testing the rendering of the DeleteDialog component", () => {
    wrapper = mount(DeleteDialog, {
      localVue,
      vuetify,
      propsData: {
        dialog: true,
      },
      slots: {
        title: "<div>Test</div>",
        description: "<div>Test</div>",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("Title slot is rendered withing .v-card__title", () => {
    wrapper = mount(DeleteDialog, {
      localVue,
      vuetify,
      propsData: {
        dialog: true,
      },
      slots: {
        title: "<div>Test</div>",
      },
    });
    expect(wrapper.find(".v-card__title").text().trim()).toBe("Test");
  });

  it("Description slot is rendered withing .v-card__text", () => {
    wrapper = mount(DeleteDialog, {
      localVue,
      vuetify,
      propsData: {
        dialog: true,
      },
      slots: {
        description: "<div>Test</div>",
      },
    });
    expect(wrapper.find(".v-card__text").text().trim()).toBe("Test");
  });

  it("", async () => {
    wrapper = mount(DeleteDialog, {
      localVue,
      vuetify,
      propsData: {
        dialog: true,
      },
      slots: {
        title: "<div>Test</div>",
        description: "<div>Test</div>",
      },
    });

    let button = wrapper.find(".v-btn.error--text");
    await button.trigger("click");
    expect(wrapper.emitted().delete).toBeTruthy();
  });

  it("", async () => {
    wrapper = mount(DeleteDialog, {
      localVue,
      vuetify,
      propsData: {
        dialog: true,
      },
      slots: {
        title: "<div>Test</div>",
        description: "<div>Test</div>",
      },
    });

    let button = wrapper.find(".v-btn.error--text");
    await button.trigger("click");
    expect(wrapper.emitted().delete[0][0]).toEqual(true);
  });
});

import DeleteDialog from "@/components/DeleteDialog";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuetify from "vuetify";
const localVue = createLocalVue();

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
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});

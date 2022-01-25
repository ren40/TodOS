import App from "@/App";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuetify from "vuetify";
const localVue = createLocalVue();

function addElemWithDataAppToBody() {
  const app = document.createElement("div");
  app.setAttribute("data-app", true);
  document.body.append(app);
}

addElemWithDataAppToBody();

describe("App.vue", () => {
  let wrapper;
  let vuetify;
  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("Testing the rendering of the App component", () => {
    wrapper = mount(App, {
      localVue,
      vuetify,
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});

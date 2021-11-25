import { mount, createLocalVue } from '@vue/test-utils'
import ToDoViewsVue from '../../../src/views/ToDoViews.vue'
import Vuetify from 'vuetify'
import * as axios from 'axios'
import jestConfig from '../../../jest.config'

jest.mock('axios')

describe('Views ToDo', () => {
  let localVue
  let vuetify
  let wrapper
  beforeEach(() => {
    localVue = createLocalVue()
    vuetify = new Vuetify()

    wrapper = mount(ToDoViewsVue, {
      localVue,
      vuetify
    })
  })

  it('test axios', () => {
    axios.get.mockImplementation(() =>
      Promise.resolve({
        data: {
          _id: 12312
        }
      })
    )
  })

  it('test add btn', () => {
    let button = wrapper.find('.v-btn')
    expect(button.text()).toMatch('+ ADD')
  })
})

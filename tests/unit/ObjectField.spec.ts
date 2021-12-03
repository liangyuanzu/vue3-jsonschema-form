import { mount } from '@vue/test-utils'
import JsonSchemaForm, { NumberField, StringField } from '../../lib'

describe('ObjectField', () => {
  let schema: any

  beforeEach(() => {
    schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        age: {
          type: 'number'
        }
      }
    }
  })

  it('should render properties to correct fields', () => {
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema,
        rootSchema: {},
        value: {},
        onChange: () => {
          // do nothing
        }
      }
    })

    const strField = wrapper.findComponent(StringField)
    const numField = wrapper.findComponent(NumberField)

    expect(strField.exists()).toBeTruthy()
    expect(numField.exists()).toBeTruthy()
  })

  it('should change value when sub fields trigger onChange', async () => {
    let value: any = {}
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema,
        rootSchema: {},
        value: value,
        onChange: (v: any) => {
          value = v
        }
      }
    })

    const strField = wrapper.findComponent(StringField)
    const numField = wrapper.findComponent(NumberField)

    await strField.props('onChange')('zs')
    expect(value.name).toEqual('zs')
    await numField.props('onChange')(20)
    expect(value.age).toEqual(20)
  })

  it('should change value when sub fields trigger onChange', async () => {
    let value: any = {
      name: 'zs'
    }
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema,
        rootSchema: {},
        value: value,
        onChange: (v: any) => {
          value = v
        }
      }
    })

    const strField = wrapper.findComponent(StringField)

    await strField.props('onChange')(undefined)
    expect(value.name).toBe(undefined)
  })
})

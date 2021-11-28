import { defineComponent, provide } from 'vue'
import { SchemaFormContextKey } from './context'
import SchemaItem from './SchemaItem'
import { FieldPropsDefine } from './types'

export default defineComponent({
  name: 'SchemaForm',
  props: FieldPropsDefine,

  setup(props) {
    const handleChange = (v: any) => {
      props.onChange(v)
    }

    const context = {
      SchemaItem
    }

    provide(SchemaFormContextKey, context)

    return () => {
      const { schema, rootSchema, value } = props

      return (
        <SchemaItem
          schema={schema}
          rootSchema={rootSchema}
          value={value}
          onChange={handleChange}
        />
      )
    }
  }
})

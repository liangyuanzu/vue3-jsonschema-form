import { defineComponent } from 'vue'
import { useVjsContext } from '../context'
// import SchemaItem from '../SchemaItem'
import { FieldPropsDefine } from '../types'
import { isObject } from '../utils'

export default defineComponent({
  name: 'ObjectField',
  props: FieldPropsDefine,

  setup(props) {
    const context = useVjsContext()

    const handleObjectFieldChange = (k: string, v: any) => {
      const value: any = isObject(props.value) ? props.value : {}

      if (v === undefined) {
        delete value[k]
      } else {
        value[k] = v
      }

      props.onChange(value)
    }

    return () => {
      const { SchemaItem } = context

      const { schema, rootSchema, uiSchema, errorSchema, value } = props
      const properties = schema.properties || {}
      const currentValue: any = isObject(value) ? value : {}

      return Object.keys(properties).map((k: string, i: number) => (
        <SchemaItem
          schema={properties[k]}
          rootSchema={rootSchema}
          uiSchema={uiSchema.properties ? uiSchema.properties[k] ?? {} : {}}
          errorSchema={errorSchema[k] ?? {}}
          value={currentValue[k]}
          key={i}
          onChange={(v: any) => handleObjectFieldChange(k, v)}
        />
      ))
    }
  }
})

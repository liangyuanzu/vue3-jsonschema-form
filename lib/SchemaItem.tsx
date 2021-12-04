import { computed, defineComponent } from 'vue'
import ArrayField from './fields/ArrayField'
import NumberField from './fields/NumberField'
import ObjectField from './fields/ObjectField'
import StringField from './fields/StringField'
import { FieldPropsDefine, SchemaTypes } from './types'
import { retrieveSchema } from './utils'

export default defineComponent({
  name: 'SchemaItem',
  props: FieldPropsDefine,

  setup(props) {
    const retrieveSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props
      return retrieveSchema(schema, rootSchema, value)
    })

    return () => {
      const { schema } = props
      const retrieveSchema = retrieveSchemaRef.value

      // TODO: 如果 type 没有指定，我们需要猜测这个 type
      const type = schema.type
      let Component: any

      switch (type) {
        case SchemaTypes.STRING:
          Component = StringField
          break
        case SchemaTypes.NUMBER:
          Component = NumberField
          break
        case SchemaTypes.OBJECT:
          Component = ObjectField
          break
        case SchemaTypes.ARRAY:
          Component = ArrayField
          break
        default:
          console.warn(`${type} is not supported`)
      }

      return <Component {...props} schema={retrieveSchema} />
    }
  }
})

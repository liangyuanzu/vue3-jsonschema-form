import { defineComponent } from 'vue'
import SchemaItem from './SchemaItem'
import { FieldPropsDefine } from './types'

export default defineComponent({
  name: 'SchemaForm',
  props: FieldPropsDefine,

  setup(props) {
    const handleChange = (v: any) => {
      props.onChange(v)
    }
    return () => {
      const { schema, value } = props

      return (
        <SchemaItem schema={schema} value={value} onChange={handleChange} />
      )
    }
  }
})

import { defineComponent } from 'vue'
import { getWidget } from '../theme'
import { CommonWidgetNames, FieldPropsDefine } from '../types'

export default defineComponent({
  name: 'NumberField',
  props: FieldPropsDefine,

  setup(props) {
    const handleChange = (v: string) => {
      const num = Number(v)
      if (Number.isNaN(num)) {
        props.onChange(undefined)
      } else {
        props.onChange(num)
      }
    }

    const NumberWidgetRef = getWidget(CommonWidgetNames.NumberWidget)

    return () => {
      const NumberWidget = NumberWidgetRef.value
      const { value, errorSchema, schema } = props

      return (
        <NumberWidget
          value={value}
          errors={errorSchema.__errors}
          schema={schema}
          onChange={handleChange}
        ></NumberWidget>
      )
    }
  }
})

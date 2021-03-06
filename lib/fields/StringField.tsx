import { computed, defineComponent } from 'vue'
import { getWidget } from '../theme'
import { CommonWidgetNames, FieldPropsDefine } from '../types'

export default defineComponent({
  name: 'StringField',
  props: FieldPropsDefine,

  setup(props) {
    const handleChange = (v: string) => {
      props.onChange(v)
    }

    const TextWidgetRef = computed(() => {
      const widgetRef = getWidget(CommonWidgetNames.TextWidget, props)
      return widgetRef.value
    })

    const widgetOptionsRef = computed(() => {
      const { widget, properties, items, ...rest } = props.uiSchema
      return rest
    })

    return () => {
      const TextWidget = TextWidgetRef.value
      const { value, errorSchema, schema } = props

      return (
        <TextWidget
          value={value}
          errors={errorSchema.__errors}
          schema={schema}
          options={widgetOptionsRef.value}
          onChange={handleChange}
        />
      )
    }
  }
})

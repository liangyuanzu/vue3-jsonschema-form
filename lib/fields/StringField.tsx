import { defineComponent } from 'vue'
import { getWidget } from '../theme'
import { CommonWidgetNames, FieldPropsDefine } from '../types'

export default defineComponent({
  name: 'StringField',
  props: FieldPropsDefine,

  setup(props) {
    const handleChange = (v: string) => {
      props.onChange(v)
    }

    const TextWidgetRef = getWidget(CommonWidgetNames.TextWidget)

    return () => {
      const TextWidget = TextWidgetRef.value
      const { value } = props

      return <TextWidget value={value} onChange={handleChange} />
    }
  }
})

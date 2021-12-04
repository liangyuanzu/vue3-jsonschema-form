import { defineComponent } from 'vue'
import { CommonWidgetDefine, CommonWidgetPropsDefine } from '../types'

const TextWidget = defineComponent({
  name: 'TextWidget',
  props: CommonWidgetPropsDefine,

  setup(props) {
    const handleChange = (e: any) => {
      const value = e.target.value
      e.target.value = props.value
      props.onChange(value)
    }

    return () => {
      return (
        <input type="text" value={props.value as any} onInput={handleChange} />
      )
    }
  }
}) as CommonWidgetDefine

export default TextWidget

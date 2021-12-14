import { computed, defineComponent } from 'vue'
import { CommonWidgetDefine, CommonWidgetPropsDefine } from '../types'
import { withFormItem } from './FormItem'

const TextWidget: CommonWidgetDefine = withFormItem(
  defineComponent({
    name: 'TextWidget',
    props: CommonWidgetPropsDefine,

    setup(props) {
      const handleChange = (e: any) => {
        const value = e.target.value
        e.target.value = props.value
        props.onChange(value)
      }

      const styleRef = computed(() => {
        return {
          color: props?.options?.color ?? 'black'
        }
      })

      return () => {
        return (
          <input
            type="text"
            value={props.value as any}
            style={styleRef.value}
            onInput={handleChange}
          />
        )
      }
    }
  })
)

export default TextWidget

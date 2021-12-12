import { defineComponent, ref, watch } from 'vue'
import { SelectionWidgetDefine, SelectionWidgetPropsDefine } from '../types'
import { withFormItem } from './FormItem'

const Selection: SelectionWidgetDefine = withFormItem(
  defineComponent({
    name: 'SelectionWidget',
    props: SelectionWidgetPropsDefine,

    setup(props) {
      const currentValueRef = ref(props.value)

      watch(currentValueRef, (newValue, oldValue) => {
        if (newValue !== props.value) {
          props.onChange(newValue)
        }
      })

      watch(
        () => props.value,
        (v) => {
          if (v !== currentValueRef.value) currentValueRef.value = v
        }
      )

      return () => {
        const { options } = props
        return (
          <select multiple={true} v-model={currentValueRef.value}>
            {options.map((op) => (
              <option value={op.value} key={op.key}>
                {op.value}
              </option>
            ))}
          </select>
        )
      }
    }
  })
)

export default Selection

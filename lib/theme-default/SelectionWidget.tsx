import { defineComponent, ref, watch } from 'vue'
import { SelectionWidgetDefine, SelectionWidgetPropsDefine } from '../types'

const Selection = defineComponent({
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
}) as SelectionWidgetDefine

export default Selection

import { defineComponent } from 'vue'
import { CommonWidgetDefine, CommonWidgetPropsDefine } from '../types'
import NumberWidget from './NumberWidget'
import SelectionWidget from './SelectionWidget'
import TextWidget from './TextWidget'

const CommonWidget = defineComponent({
  props: CommonWidgetPropsDefine,
  setup() {
    return () => null
  }
}) as CommonWidgetDefine

export default {
  widgets: {
    SelectionWidget,
    TextWidget: TextWidget,
    NumberWidget: NumberWidget
  }
}

<template>
  <input type="number" :value="value" @input="handleChange" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FieldPropsDefine } from '../types'

export default defineComponent({
  props: FieldPropsDefine,

  setup(props) {
    const handleChange = (e: any) => {
      const num = Number(e.target.value)
      if (Number.isNaN(num)) {
        props.onChange(undefined)
      } else {
        props.onChange(num)
      }
    }

    return { handleChange }
  }
})
</script>

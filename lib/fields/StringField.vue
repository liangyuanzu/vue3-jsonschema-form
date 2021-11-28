<template>
  <input type="text" :value="value" @input="handleChange" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FieldPropsDefine } from '../types'

export default defineComponent({
  props: FieldPropsDefine,

  setup(props) {
    const handleChange = (e: any) => {
      console.log(e)
      props.onChange(e.target.value)
    }

    return { handleChange }
  }
})
</script>

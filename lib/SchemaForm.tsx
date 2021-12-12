import Ajv, { Options } from 'ajv'
import {
  defineComponent,
  PropType,
  provide,
  ref,
  Ref,
  shallowRef,
  watch,
  watchEffect
} from 'vue'
import { SchemaFormContextKey } from './context'
import SchemaItem from './SchemaItem'
import { Schema } from './types'
import { ErrorSchema, validateFormData } from './validator'

const defaultAjvOptions: Options = {
  allErrors: true
}

export default defineComponent({
  name: 'SchemaForm',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    value: {
      required: true
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true
    },
    ajvOptions: {
      type: Object as PropType<Options>
    },
    locale: {
      type: String,
      default: 'zh'
    },
    customValidate: {
      type: Function as PropType<(data: any, errors: any) => void>
    }
  },

  setup(props) {
    const handleChange = (v: any) => {
      props.onChange(v)
    }

    const context = {
      SchemaItem
    }

    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({})

    const validatorRef: Ref<Ajv.Ajv> = shallowRef() as any

    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions
      })
    })

    const validateResolveRef = ref()
    const validateIndex = ref(0)

    watch(
      () => props.value,
      () => {
        if (validateResolveRef.value) useValidate()
      },
      {
        deep: true
      }
    )

    async function useValidate() {
      const index = (validateIndex.value += 1)

      const { value, schema, locale, customValidate } = props
      const result = await validateFormData(
        validatorRef.value,
        value,
        schema,
        locale,
        customValidate
      )

      if (index !== validateIndex.value) return

      errorSchemaRef.value = result.errorSchema
      validateResolveRef.value(result)

      validateResolveRef.value = undefined
    }

    const doValidate = () => {
      return new Promise((resolve) => {
        validateResolveRef.value = resolve
        useValidate()
      })
    }

    provide(SchemaFormContextKey, context)

    return { errorSchemaRef, handleChange, doValidate }
  },

  render() {
    const { schema, errorSchemaRef, value, handleChange } = this

    return (
      <SchemaItem
        schema={schema}
        rootSchema={schema}
        errorSchema={errorSchemaRef ?? {}}
        value={value}
        onChange={handleChange}
      />
    )
  }
})

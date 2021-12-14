import Ajv, { Options } from 'ajv'
import {
  computed,
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
import {
  CommonWidgetDefine,
  CustomFormat,
  CustomKeyword,
  Schema,
  UISchema
} from './types'
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
    uiSchema: {
      type: Object as PropType<UISchema>
    },
    value: {
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
    },
    customFormats: {
      type: [Array, Object] as PropType<CustomFormat[] | CustomFormat>
    },
    customKeywords: {
      type: [Array, Object] as PropType<CustomKeyword[] | CustomKeyword>
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true
    }
  },

  setup(props) {
    const handleChange = (v: any) => {
      props.onChange(v)
    }

    const formatMapRef = computed(() => {
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]

        return customFormats.reduce((result, format) => {
          result[format.name] = format.component
          return result
        }, {} as { [key: string]: CommonWidgetDefine })
      } else {
        return {}
      }
    })

    const transformSchemaRef = computed(() => {
      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords]

        return (schema: Schema) => {
          let newSchema = schema
          customKeywords.forEach((keyword) => {
            if ((newSchema as any)[keyword.name]) {
              newSchema = keyword.transformSchema(schema)
            }
          })
          return newSchema
        }
      } else {
        return (s: Schema) => s
      }
    })

    const context = {
      SchemaItem,
      formatMapRef,
      transformSchemaRef
    }

    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({})

    const validatorRef: Ref<Ajv.Ajv> = shallowRef() as any

    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions
      })

      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]

        customFormats.forEach((format) => {
          validatorRef.value.addFormat(format.name, format.definition)
        })
      }

      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords]

        customKeywords.forEach((keyword) => {
          validatorRef.value.addKeyword(keyword.name, keyword.definition)
        })
      }
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
    const { schema, uiSchema, errorSchemaRef, value, handleChange } = this

    return (
      <SchemaItem
        schema={schema}
        rootSchema={schema}
        uiSchema={uiSchema ?? {}}
        errorSchema={errorSchemaRef ?? {}}
        value={value}
        onChange={handleChange}
      />
    )
  }
})

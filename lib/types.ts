import { CompilationContext, FormatDefinition } from 'ajv'
import { DefineComponent, PropType } from 'vue'
import { ErrorSchema } from './validator'

export enum SchemaTypes {
  'NUMBER' = 'number',
  'INTEGER' = 'integer',
  'STRING' = 'string',
  'OBJECT' = 'object',
  'ARRAY' = 'array',
  'BOOLEAN' = 'boolean'
}

type SchemaRef = { $ref: string }

export type UISchema = {
  widget?: string | CommonWidgetDefine
  properties?: {
    [key: string]: UISchema
  }
  items?: UISchema | UISchema[]
} & {
  [key: string]: any
}

export interface VueJsonSchemaConfig {
  title?: string
  descrription?: string
  component?: string
  options?: {
    [key: string]: any
  }
  withFormItem?: boolean
  widget?: 'checkbox' | 'textarea' | 'select' | 'radio' | 'range' | string
  items?: UISchema | UISchema[]
  propertiesOrder?: string[]
  controls?: {
    sortable?: boolean
    removeable?: boolean
    addable?: boolean
  }
}

export interface Schema {
  type?: SchemaTypes | string
  const?: any
  format?: string

  title?: string
  default?: any

  properties?: {
    [key: string]: Schema
  }
  items?: Schema | Schema[] | SchemaRef
  uniqueItems?: any
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef
  }
  oneOf?: Schema[]
  anyOf?: Schema[]
  allOf?: Schema[]
  vjsf?: VueJsonSchemaConfig
  required?: string[]
  enum?: any[]
  enumNames?: any[]
  enumKeyValue?: any[]
  additionalProperties?: any
  additionalItems?: Schema

  minLength?: number
  maxLength?: number
  minimun?: number
  maximum?: number
  multipleOf?: number
  exclusiveMaximum?: number
  exclusiveMinimum?: number
}

export const FieldPropsDefine = {
  schema: {
    type: Object as PropType<Schema>,
    required: true
  },
  rootSchema: {
    type: Object as PropType<Schema>,
    required: true
  },
  uiSchema: {
    type: Object as PropType<UISchema>,
    required: true
  },
  errorSchema: {
    type: Object as PropType<ErrorSchema>,
    required: true
  },
  value: {
    required: true
  },
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true
  }
} as const

export type CommonFieldType = DefineComponent<typeof FieldPropsDefine>

export const CommonWidgetPropsDefine = {
  value: {},
  errors: {
    type: Array as PropType<string[]>
  },
  schema: {
    type: Object as PropType<Schema>,
    required: true
  },
  options: {
    type: Object as PropType<{ [key: string]: any }>
  },
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true
  }
} as const

export const SelectionWidgetPropsDefine = {
  ...CommonWidgetPropsDefine,
  options: {
    type: Array as PropType<
      {
        key: string
        value: any
      }[]
    >,
    required: true
  }
} as const

export type CommonWidgetDefine = DefineComponent<
  typeof CommonWidgetPropsDefine,
  {},
  {}
>

export type SelectionWidgetDefine = DefineComponent<
  typeof SelectionWidgetPropsDefine,
  {},
  {}
>

export enum SelectionWidgetNames {
  SelectionWidget = 'SelectionWidget'
}

export enum CommonWidgetNames {
  TextWidget = 'TextWidget',
  NumberWidget = 'NumberWidget'
}

export interface Theme {
  widgets: {
    [SelectionWidgetNames.SelectionWidget]: SelectionWidgetDefine
    [CommonWidgetNames.TextWidget]: CommonWidgetDefine
    [CommonWidgetNames.NumberWidget]: CommonWidgetDefine
  }
}

export interface CustomFormat {
  name: string
  definition: FormatDefinition
  component: CommonWidgetDefine
}

interface VjsfKeywordDefinition {
  type?: string | Array<string>
  async?: boolean
  $data?: boolean
  errors?: boolean | string
  metaSchema?: object
  // schema: false makes validate not to expect schema (ValidateFunction)
  schema?: boolean
  statements?: boolean
  dependencies?: Array<string>
  modifying?: boolean
  valid?: boolean
  // one and only one of the following properties should be present
  macro: (
    schema: any,
    parentSchema: object,
    it: CompilationContext
  ) => object | boolean
}

export interface CustomKeyword {
  name: string
  definition: VjsfKeywordDefinition
  transformSchema: (originSchema: Schema) => Schema
}

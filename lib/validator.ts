import Ajv from 'ajv'
import toPath from 'lodash.topath'
import { Schema } from './types'
import { isObject } from './utils'
const i18n = require('ajv-i18n')

interface TransformedErrorObject {
  name: string
  property: string
  message: string | undefined
  params: Ajv.ErrorParameters
  schemaPath: string
}

export type ErrorSchema = {
  [level: string]: ErrorSchema
} & {
  __errors?: string[]
}

function transformErrors(
  errors: Ajv.ErrorObject[] | null | undefined
): TransformedErrorObject[] {
  if (errors == undefined) return []

  return errors.map(({ message, dataPath, keyword, params, schemaPath }) => {
    return {
      name: keyword,
      property: `${dataPath}`,
      message,
      params,
      schemaPath
    }
  })
}

function toErrorSchema(errors: TransformedErrorObject[]) {
  if (errors.length === 0) return {}

  return errors.reduce((errorSchema, error) => {
    const { property, message } = error
    const path = toPath(property)
    let parent = errorSchema

    if (path.length > 0 && path[0] === '') {
      path.shift()
    }

    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        ;(parent as any)[segment] = {}
      }
      parent = parent[segment]
    }

    if (Array.isArray(parent.__errors)) {
      parent.__errors = parent.__errors.concat(message ?? '')
    } else {
      if (message) {
        parent.__errors = [message]
      }
    }

    return errorSchema
  }, {} as ErrorSchema)
}

export async function validateFormData(
  validator: Ajv.Ajv,
  formData: any,
  schema: Schema,
  locale = 'zh',
  customValidate?: (data: any, errors: any) => void
) {
  let validationError = null

  try {
    validator.validate(schema, formData)
  } catch (err) {
    validationError = err
  }

  i18n[locale](validator.errors)

  let errors = transformErrors(validator.errors)

  if (validationError) {
    errors = [
      ...errors,
      {
        message: (validationError as Error).message
      } as TransformedErrorObject
    ]
  }

  const errorSchema = toErrorSchema(errors)

  if (!customValidate) {
    return {
      errors,
      errorSchema,
      valid: errors.length === 0
    }
  }

  const customErrorSchemaProxy = createErrorProxy({})
  await customValidate(formData, customErrorSchemaProxy)

  const userErrorSchema = toRaw(customErrorSchemaProxy) as ErrorSchema
  const newErrorSchema = mergeObjects(errorSchema, userErrorSchema, true)

  return {
    errors,
    errorSchema: newErrorSchema,
    valid: errors.length === 0
  }
}

function toRaw(p: any) {
  return p.__get_raw__
}

function createErrorProxy(raw: object = {}) {
  return new Proxy(raw, {
    get(target, key, receiver) {
      if (key === 'addError') {
        return (message: string) => {
          const t: any = target
          if (t.__errors) t.__errors.push(message)
          else t.__errors = [message]
        }
      }

      if (key === '__get_raw__') {
        return raw
      }

      const res = Reflect.get(target, key, receiver)

      if (res === undefined) {
        const proxy: any = createErrorProxy({})
        ;(target as any)[key] = proxy
        return proxy
      }

      return res
    }
  })
}

export function mergeObjects(obj1: any, obj2: any, concatArrays = false) {
  const acc = Object.assign({}, obj1)

  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {},
      right = obj2[key]

    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeObjects(left, right, concatArrays)
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right)
    } else {
      acc[key] = right
    }

    return acc
  }, acc)
}

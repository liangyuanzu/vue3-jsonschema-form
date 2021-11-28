import { inject } from 'vue'
import { CommonFieldType } from './types'

export const SchemaFormContextKey = Symbol()

export function useVjsContext() {
  const context: { SchemaItem: CommonFieldType } | undefined = inject(
    SchemaFormContextKey
  )

  if (!context) throw new Error('SchemaForm should be used')

  return context
}

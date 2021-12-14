import { inject, Ref } from 'vue'
import { CommonFieldType, CommonWidgetDefine, Schema } from './types'

export const SchemaFormContextKey = Symbol()

export function useVjsContext() {
  const context:
    | {
        SchemaItem: CommonFieldType
        formatMapRef: Ref<{ [key: string]: CommonWidgetDefine }>
        transformSchemaRef: Ref<(schema: Schema) => Schema>
      }
    | undefined = inject(SchemaFormContextKey)

  if (!context) throw new Error('SchemaForm should be used')

  return context
}

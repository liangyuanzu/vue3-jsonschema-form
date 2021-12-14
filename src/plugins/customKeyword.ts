import { CustomKeyword, Schema } from '../../lib/types'

const keyword: CustomKeyword = {
  name: 'test',
  definition: {
    macro: () => {
      return {
        minLength: 10
      }
    }
  },
  transformSchema(schema: Schema): Schema {
    return {
      ...schema,
      minLength: 10
    }
  }
}

export default keyword

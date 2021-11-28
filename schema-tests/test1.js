const Ajv = require('ajv')
const localize = require('ajv-i18n')
const ajv = new Ajv({ allErrors: true, jsonPointers: true })
require('ajv-errors')(ajv)

ajv.addKeyword('test', {
  validate(schema, data) {
    console.log(schema, data)
    return true
  }
})

const schema = {
  type: 'object',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string' }
  },
  required: ['foo'],
  additionalProperties: false
}

const validate = ajv.compile(schema)

const data = {
  foo: 1,
  bar: 'abc'
}

const valid = validate(data)
if (!valid) localize.zh(validate.errors)

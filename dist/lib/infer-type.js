'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const ts_simple_type_1 = require('ts-simple-type')
function resolveType(type) {
  switch (type.kind) {
    case ts_simple_type_1.SimpleTypeKind.BOOLEAN:
    case ts_simple_type_1.SimpleTypeKind.BOOLEAN_LITERAL:
      return 'boolean'
    case ts_simple_type_1.SimpleTypeKind.NUMBER:
    case ts_simple_type_1.SimpleTypeKind.NUMBER_LITERAL:
    case ts_simple_type_1.SimpleTypeKind.BIG_INT:
    case ts_simple_type_1.SimpleTypeKind.BIG_INT_LITERAL:
      return 'number'
    case ts_simple_type_1.SimpleTypeKind.STRING:
    case ts_simple_type_1.SimpleTypeKind.STRING_LITERAL:
      return 'string'
    case ts_simple_type_1.SimpleTypeKind.ARRAY:
      return 'array'
    case ts_simple_type_1.SimpleTypeKind.DATE:
      return 'date'
    case ts_simple_type_1.SimpleTypeKind.NULL:
      return 'null'
    case ts_simple_type_1.SimpleTypeKind.ENUM:
      return 'enum'
    case ts_simple_type_1.SimpleTypeKind.ENUM_MEMBER:
      return resolveType(type.type)
    case ts_simple_type_1.SimpleTypeKind.UNION:
      return 'union'
    case ts_simple_type_1.SimpleTypeKind.INTERFACE:
      return 'interface'
    case ts_simple_type_1.SimpleTypeKind.TUPLE:
      return 'tuple'
    case ts_simple_type_1.SimpleTypeKind.UNDEFINED:
      return 'undefined'
    case ts_simple_type_1.SimpleTypeKind.NEVER:
      return 'never'
    case ts_simple_type_1.SimpleTypeKind.UNKNOWN:
      return 'unknown'
    case ts_simple_type_1.SimpleTypeKind.INTERSECTION:
      return 'intersection'
    case ts_simple_type_1.SimpleTypeKind.CLASS:
      return 'class'
    case ts_simple_type_1.SimpleTypeKind.ANY:
      return 'any'
  }
  return null
}
function inferType(expression, checker) {
  const type = ts_simple_type_1.toSimpleType(expression, checker)
  return resolveType(type)
}
exports.default = inferType
//# sourceMappingURL=infer-type.js.map

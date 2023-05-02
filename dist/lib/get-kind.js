'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tsserverlibrary_1 = require('typescript/lib/tsserverlibrary')
function getKind(type) {
  switch (type) {
    case 'keyword':
      return tsserverlibrary_1.ScriptElementKind.keyword
    case 'table':
      return tsserverlibrary_1.ScriptElementKind.classElement
    case 'column':
      return tsserverlibrary_1.ScriptElementKind.memberVariableElement
  }
}
exports.getKind = getKind
//# sourceMappingURL=get-kind.js.map

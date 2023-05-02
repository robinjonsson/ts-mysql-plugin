'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const ts_mysql_analyzer_1 = require('ts-mysql-analyzer')
const tsserverlibrary_1 = require('typescript/lib/tsserverlibrary')
function mapSeverity(severity) {
  switch (severity) {
    case ts_mysql_analyzer_1.DiagnosticSeverity.Error:
      return tsserverlibrary_1.DiagnosticCategory.Error
    case ts_mysql_analyzer_1.DiagnosticSeverity.Suggestion:
      return tsserverlibrary_1.DiagnosticCategory.Suggestion
    case ts_mysql_analyzer_1.DiagnosticSeverity.Warning:
      return tsserverlibrary_1.DiagnosticCategory.Warning
  }
}
exports.mapSeverity = mapSeverity
//# sourceMappingURL=map-severity.js.map

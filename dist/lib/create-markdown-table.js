'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const markdown_table_1 = __importDefault(require('markdown-table'))
function createMarkdownTable(columns) {
  const pad = '&nbsp;'.repeat(5)
  const tableHeader = ['Name', pad, 'SQL Type', pad, 'TS Type', pad, 'Optional']
  const rows = columns.map(column => [
    column.name,
    pad,
    column.sqlType,
    pad,
    column.tsType,
    pad,
    String(column.optional)
  ])
  const table = markdown_table_1.default([tableHeader, ...rows])
  return table
}
exports.createMarkdownTable = createMarkdownTable
//# sourceMappingURL=create-markdown-table.js.map

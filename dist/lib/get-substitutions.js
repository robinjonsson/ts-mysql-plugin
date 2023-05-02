'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const infer_type_1 = __importDefault(require('./infer-type'))
function resolveType(expression, checker) {
  const length = expression.getText().length
  const type = infer_type_1.default(expression, checker)
  // in order to preserve the length of the original string, we need to make
  // substitutions that add up to that length
  switch (type) {
    case 'string':
      return `"${'x'.repeat(length + 1)}"`
    case 'number':
      return '1'.repeat(length + 3)
    case 'boolean':
      return 'true'
    case 'date':
      return `"${new Date().toISOString()}"`
    case 'null':
      return 'null'
    default:
      return null
  }
}
function getSpans(node) {
  const spans = []
  const stringStart = node.getStart() + 1
  let nodeStart = node.head.end - stringStart - 2
  for (const templateSpan of node.templateSpans) {
    const literal = templateSpan.literal
    const start = literal.getStart() - stringStart + 1
    const expression = templateSpan.expression
    spans.push({ start: nodeStart, end: start, expression })
    nodeStart = literal.getEnd() - stringStart - 2
  }
  return spans
}
function getValue(expression, span, checker) {
  if (checker) {
    const value = resolveType(expression, checker)
    if (value) {
      return value
    }
  }
  const value = 'x'.repeat(span.end - span.start - 2)
  return `'${value}'`
}
function getTemplateSubstitutions(checker, node) {
  const contents = node.getText().slice(1, -1)
  const spans = getSpans(node)
  const parts = []
  let lastIndex = 0
  const substitutions = []
  for (const span of spans) {
    parts.push(contents.slice(lastIndex, span.start))
    const expression = span.expression
    const value = getValue(expression, span, checker)
    parts.push(value)
    substitutions.push({
      start: span.start,
      oldStop: span.end,
      newStop: span.end + Math.abs(expression.getText().length - value.length)
    })
    lastIndex = span.end
  }
  parts.push(contents.slice(lastIndex))
  return {
    text: parts.join(''),
    substitutions
  }
}
exports.default = getTemplateSubstitutions
//# sourceMappingURL=get-substitutions.js.map

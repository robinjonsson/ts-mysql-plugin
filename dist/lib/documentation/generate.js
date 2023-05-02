'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const help_1 = require('./help')
const topics = help_1.helpData.topics
const functions = topics.filter(t => t.type === 'function')
const keywords = topics.filter(t => t.type === 'keyword')
function code(str) {
  return '```sql\n' + str + '\n```'
}
function backtick(str) {
  return '`' + str + '`\n'
}
function generateDocumentation(word, type) {
  let topic
  if (type === 'function') {
    topic = functions.find(f => f.name === word.toUpperCase())
  } else if (type === 'keyword') {
    topic = keywords.find(k => k.name === word.toUpperCase())
  }
  if (!topic) {
    return ''
  }
  return [
    backtick(topic.category),
    topic.description,
    code(topic.codeExample),
    `[${topic.reference.name}](${topic.reference.url})`
  ].join('\n')
}
exports.generateDocumentation = generateDocumentation
//# sourceMappingURL=generate.js.map

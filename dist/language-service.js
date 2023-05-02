'use strict'
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k]
    result['default'] = mod
    return result
  }
Object.defineProperty(exports, '__esModule', { value: true })
const tsserverlibrary_1 = require('typescript/lib/tsserverlibrary')
const ts_mysql_autocomplete_1 = require('ts-mysql-autocomplete')
const ts_mysql_schema_fork_1 = require('ts-mysql-schema-fork')
const ts_mysql_analyzer_1 = require('ts-mysql-analyzer')
const ts_mysql_parser_1 = __importStar(require('ts-mysql-parser'))
const generate_1 = require('./lib/documentation/generate')
const create_markdown_table_1 = require('./lib/create-markdown-table')
const send_host_message_1 = require('./lib/send-host-message')
const map_severity_1 = require('./lib/map-severity')
const get_kind_1 = require('./lib/get-kind')
class MySqlLanguageService {
  constructor({ host, logger, config }) {
    this.config = config
    this.logger = logger
    this.host = host
    const parserOptions = {
      version: this.config.mySQLVersion
    }
    this.autocompleter = new ts_mysql_autocomplete_1.MySQLAutocomplete({ parserOptions })
    this.analyzer = new ts_mysql_analyzer_1.MySQLAnalyzer({ parserOptions })
    const { databaseUri } = config
    if (!databaseUri) {
      return
    }
    const mySQLSchema = new ts_mysql_schema_fork_1.MySQLSchema({ uri: databaseUri })
    mySQLSchema
      .getSchema()
      .then(schema => {
        this.schema = schema
        this.autocompleter = new ts_mysql_autocomplete_1.MySQLAutocomplete({
          parserOptions,
          schema,
          uppercaseKeywords: true
        })
        this.analyzer = new ts_mysql_analyzer_1.MySQLAnalyzer({ parserOptions, schema })
        this.onSchemaLoaded()
      })
      .catch(err => {
        this.logger.log('Failed to get schema: ' + err)
      })
  }
  onSchemaLoaded() {
    if (process.env.NODE_ENV !== 'test') {
      return
    }
    send_host_message_1.sendHostMessage(this.host, {
      event: 'schemaLoadingFinish',
      type: 'event'
    })
  }
  createQuickInfo(start, text, docs) {
    return {
      kind: tsserverlibrary_1.ScriptElementKind.string,
      kindModifiers: '',
      textSpan: {
        start,
        length: text.length
      },
      displayParts: [],
      documentation: [
        {
          kind: '',
          text: docs
        }
      ],
      tags: []
    }
  }
  hasFileIgnoreComment(context) {
    const contents = this.host.readFile(context.fileName)
    if (!contents) {
      return false
    }
    const firstLine = contents.split('\n')[0]
    if (firstLine.includes('@ts-mysql-plugin ignore')) {
      return true
    }
    return false
  }
  getQuickInfoAtPosition(context, position) {
    var _a
    if (this.hasFileIgnoreComment(context)) {
      return
    }
    const offset = context.toOffset(position)
    const parser = new ts_mysql_parser_1.default({ version: this.config.mySQLVersion })
    const statements = parser.splitStatements(context.text)
    const statement = parser.getStatementAtOffset(statements, offset)
    if (!statement) {
      return
    }
    const result = parser.parse(statement.text)
    const node = parser.getNodeAtOffset(result, offset - statement.start)
    if (!node) {
      return
    }
    const { start: nodeStart, type } = node
    const start = statement.start + nodeStart
    if (type === ts_mysql_parser_1.ReferenceType.KeywordRef) {
      const reference = node
      const keyword = reference.keyword
      return this.createQuickInfo(start, keyword, generate_1.generateDocumentation(keyword, 'keyword'))
    }
    if (type === ts_mysql_parser_1.ReferenceType.FunctionRef) {
      const reference = node
      const fn = reference.function
      return this.createQuickInfo(start, fn, generate_1.generateDocumentation(fn, 'function'))
    }
    const schemaTables = ((_a = this.schema) === null || _a === void 0 ? void 0 : _a.tables) || []
    if (type === ts_mysql_parser_1.ReferenceType.TableRef) {
      const reference = node
      const schemaTable = schemaTables.find(t => t.name === reference.table)
      if (schemaTable) {
        const table = create_markdown_table_1.createMarkdownTable(schemaTable.columns)
        return this.createQuickInfo(start, schemaTable.name, table)
      }
    }
    if (type === ts_mysql_parser_1.ReferenceType.ColumnRef) {
      const reference = node
      const schemaTable = schemaTables.find(t => {
        var _a
        return t.name === ((_a = reference.tableReference) === null || _a === void 0 ? void 0 : _a.table)
      })
      const schemaColumn =
        schemaTable === null || schemaTable === void 0
          ? void 0
          : schemaTable.columns.find(c => c.name === reference.column)
      if (!schemaColumn) {
        return
      }
      const table = create_markdown_table_1.createMarkdownTable([schemaColumn])
      return this.createQuickInfo(start, schemaColumn.name, table)
    }
  }
  getCompletionsAtPosition(context, position) {
    const completionInfo = {
      entries: [],
      isNewIdentifierLocation: false,
      isGlobalCompletion: false,
      isMemberCompletion: false
    }
    if (this.hasFileIgnoreComment(context)) {
      return completionInfo
    }
    const offset = context.toOffset(position)
    const parser = new ts_mysql_parser_1.default({ version: this.config.mySQLVersion })
    const statements = parser.splitStatements(context.text)
    const statement = parser.getStatementAtOffset(statements, offset)
    if (!statement) {
      return completionInfo
    }
    const candidates = this.autocompleter.autocomplete(statement.text, offset - statement.start)
    completionInfo.entries = candidates.map(({ text, type }) => {
      return {
        name: text,
        kind: get_kind_1.getKind(type),
        kindModifiers: '',
        sortText: text
      }
    })
    return completionInfo
  }
  getSemanticDiagnostics(context) {
    if (this.hasFileIgnoreComment(context)) {
      return []
    }
    const diagnostics = this.analyzer.analyze(context.text) || []
    return diagnostics.map(diagnostic => {
      const substitution = context.getSubstitution(diagnostic.start)
      const stop = substitution ? substitution.oldStop : diagnostic.stop + 1
      let start = diagnostic.start
      let length = stop - start
      // special case to highlight enclosing backticks
      if (!context.text) {
        start = -1
        length = 2
      }
      return {
        file: context.node.getSourceFile(),
        source: this.config.pluginName,
        messageText: diagnostic.message,
        category: map_severity_1.mapSeverity(diagnostic.severity),
        code: diagnostic.code,
        length,
        start
      }
    })
  }
}
exports.default = MySqlLanguageService
//# sourceMappingURL=language-service.js.map

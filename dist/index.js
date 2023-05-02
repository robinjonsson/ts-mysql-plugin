'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
const typescript_template_language_service_decorator_1 = require('typescript-template-language-service-decorator')
const language_service_1 = __importDefault(require('./language-service'))
const get_substitutions_1 = __importDefault(require('./lib/get-substitutions'))
const configuration_1 = require('./configuration')
const logger_1 = __importDefault(require('./logger'))
class MySqlPlugin {
  constructor(typescript) {
    this.config = new configuration_1.Configuration()
    this.typescript = typescript
  }
  create(info) {
    this.config.update(info.config)
    const logger = new logger_1.default(this.config, info.project)
    const templateSettings = this.getTemplateSettings(this.config, info.project)
    const service = new language_service_1.default({
      host: info.serverHost,
      config: this.config,
      logger
    })
    const plugin = typescript_template_language_service_decorator_1.decorateWithTemplateLanguageService(
      this.typescript,
      info.languageService,
      info.project,
      service,
      templateSettings,
      {
        logger
      }
    )
    return plugin
  }
  onConfigurationChanged(config) {
    this.config.update(config)
  }
  getTemplateSettings(config, project) {
    return {
      get tags() {
        return config.tags
      },
      enableForStringWithSubstitutions: true,
      getSubstitutions: node => {
        const program = project.getLanguageService().getProgram()
        const checker = program === null || program === void 0 ? void 0 : program.getTypeChecker()
        return get_substitutions_1.default(checker, node)
      }
    }
  }
}
module.exports = modules => {
  return new MySqlPlugin(modules.typescript)
}
//# sourceMappingURL=index.js.map

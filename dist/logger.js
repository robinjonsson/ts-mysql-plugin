'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
class ServiceLogger {
  constructor(config, project) {
    this.project = project
    this.config = config
  }
  log(message) {
    const payload = `[${this.config.pluginName}] ${message}`
    if (this.project) {
      this.project.projectService.logger.info(payload)
    } else {
      console.log(payload)
    }
  }
}
exports.default = ServiceLogger
//# sourceMappingURL=logger.js.map

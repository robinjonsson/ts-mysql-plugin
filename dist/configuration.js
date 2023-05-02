'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const defaultConfiguration = {
  tags: ['sql', 'SQL'],
  mySQLVersion: '5.7.12'
}
class Configuration {
  constructor() {
    this._tags = defaultConfiguration.tags
    this._mySQLVersion = defaultConfiguration.mySQLVersion
    this._databaseUri = ''
    this._pluginName = 'ts-mysql-plugin'
  }
  update(config) {
    this._tags = config.tags || defaultConfiguration.tags
    this._databaseUri = config.databaseUri || ''
    this._mySQLVersion = config.mySQLVersion || defaultConfiguration.mySQLVersion
  }
  get pluginName() {
    return this._pluginName
  }
  get tags() {
    return this._tags
  }
  get databaseUri() {
    return this._databaseUri
  }
  get mySQLVersion() {
    return this._mySQLVersion
  }
}
exports.Configuration = Configuration
//# sourceMappingURL=configuration.js.map

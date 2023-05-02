'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
function sendHostMessage(host, message) {
  const json = JSON.stringify(message)
  const len = Buffer.byteLength(json, 'utf8')
  const msg = `Content-Length: ${1 + len}\r\n\r\n${json}${host.newLine}`
  host.write(msg)
}
exports.sendHostMessage = sendHostMessage
//# sourceMappingURL=send-host-message.js.map

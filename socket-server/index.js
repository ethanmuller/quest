import http from 'http'
import socketIO from 'socket.io'
import partySocketManager from '../lib/party-socket-manager'

export default function () {
  this.nuxt.hook('render:before', (renderer) => {
    const server = http.createServer(this.nuxt.renderer.app)
    const io = socketIO(server)

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) => new Promise(resolve => server.listen(this.nuxt.options.server.port, this.nuxt.options.server.host, resolve))
    // close this server on 'close' event
    this.nuxt.hook('close', () => new Promise(server.close))

    partySocketManager(io)
  })
}

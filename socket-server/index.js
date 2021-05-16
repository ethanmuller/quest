import http from 'http'
import socketIO from 'socket.io'
import multiplayerManager from '../server/multiplayer-manager'

export default function () {
  this.nuxt.hook('render:before', (renderer) => {
    const server = http.createServer(this.nuxt.renderer.app)
    const io = socketIO(server)

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) => {
      return new Promise(resolve => {
      return server.listen(this.nuxt.options.server.port, this.nuxt.options.server.host, resolve)
    })
    }
    // close this server on 'close' event
    this.nuxt.hook('close', () => new Promise(server.close))

    multiplayerManager(io)
  })
}

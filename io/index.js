import http from 'http'
import socketIO from 'socket.io'

export default function () {
  const world = {}

  this.nuxt.hook('render:before', (renderer) => {
    const server = http.createServer(this.nuxt.renderer.app)
    const io = socketIO(server)

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) => new Promise(resolve => server.listen(this.nuxt.options.server.port, this.nuxt.options.server.host, resolve))
    // close this server on 'close' event
    this.nuxt.hook('close', () => new Promise(server.close))

    function getMembersList(fn) {
      io.fetchSockets()
        .then((sox) => {
          const members = []
          sox.forEach((socket) => {
            let member = world[socket.id]

            if (!member) {
              member = {
                id: socket.id,
                location: [0, 0],
                isClenched: false,
              }
            }

            members.push(member)
          })

          fn(members)
        })
    }

    // Add socket.io events
    const messages = []
    io.on('connection', (socket) => {
      
      socket.on('join', function (fn) {
        world[socket.id] = {
          id: socket.id,
          location: [0, 0],
          isClenched: false,
        }

        getMembersList((members) => {
          const world = members
          fn(world)
        })
      })

      socket.on('last-messages', function (fn) {
        fn(messages.slice(-50))
      })
      socket.on('send-message', function (message) {
        messages.push(message)
        socket.broadcast.emit('new-message', message)
      })
      socket.on('send-move', function(location) {
        const member = world[socket.id]
        
        if (member) {
          member.location = location
        }
        // world[socket.id].location = location

        getMembersList((members) => {
          const world = members
          socket.broadcast.emit('world-update', world)
        })
      })
      socket.on('send-clench', function(isClenched) {
        const member = world[socket.id]
        
        if (member) {
          member.isClenched = isClenched

          getMembersList((members) => {
            const world = members
            socket.broadcast.emit('world-update', world)
          })
        }
      })
    })
  })
}

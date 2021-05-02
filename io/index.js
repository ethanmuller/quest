import http from 'http'
import socketIO from 'socket.io'

export default function () {
  // every time we receive a location, we store it here.
  // to build a list of all clients,
  // we loop over all sockets, then look in this list for a location
  // otherwise provide location as [0, 0].
  // it's okay if disconnections happen because ids are unique
  const locations = {}

  this.nuxt.hook('render:before', (renderer) => {
    const server = http.createServer(this.nuxt.renderer.app)
    const io = socketIO(server)

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) => new Promise(resolve => server.listen(this.nuxt.options.server.port, this.nuxt.options.server.host, resolve))
    // close this server on 'close' event
    this.nuxt.hook('close', () => new Promise(server.close))

    // Add socket.io events
    const messages = []
    io.on('connection', (socket) => {

      // io.fetchSockets()
      //   .then((sox) => {
      //     const party = []
      //     sox.forEach((p) => party.push({id: p.id, location: locations[p.id] || [0, 0]}))
      //     socket.broadcast.emit('party-update', party)
      //   })

      function getPartyList(fn) {
        io.fetchSockets()
          .then((sox) => {
            const party = []
            sox.forEach((p) => {
              const member = {
                id: p.id,
                location: locations[p.id] || [0, 0]
              }

              party.push(member)
            })

            fn(party)

            // socket.broadcast.emit('party-update', party)
          })
      }
      
      socket.on('join', function (fn) {
        console.log('somebody just joined!')

        getPartyList((party) => {
          fn(party)
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
        // const who = socket.id;
        // const clientList = io.sockets.adapter.rooms['/'];
        // socket.broadcast.emit('new-message', message)
        locations[socket.id] = location

        getPartyList((party) => {
          socket.broadcast.emit('party-update', party)
        })
      })
    })
  })
}

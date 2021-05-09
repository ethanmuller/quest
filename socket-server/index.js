import http from 'http'
import socketIO from 'socket.io'

const players = []

function getPlayer(id) {
  return players.find(player => player.id === id)
}

function getPlayersOfParty(party) {
  return players.filter(player => player.party === party.toLowerCase())
}

function addPlayer(socket, party) {
  const player = {
    id: socket.id,
    party: party.toLowerCase(),
  }

  socket.join(player.party)

  players.push(player)

  return player
}

function deletePlayer(id) {
  const index = players.findIndex((player) => player.id === id);
  if (index !== -1) return players.splice(index, 1)[0];
}

export default function () {
  const world = {}

  this.nuxt.hook('render:before', (renderer) => {
    const server = http.createServer(this.nuxt.renderer.app)
    const io = socketIO(server)

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) => new Promise(resolve => server.listen(this.nuxt.options.server.port, this.nuxt.options.server.host, resolve))
    // close this server on 'close' event
    this.nuxt.hook('close', () => new Promise(server.close))

    io.on('connection', (socket) => {

      socket.on('party-join', function (data) {
        const player = addPlayer(socket, data.party)
        const list = getPlayersOfParty(data.party)

        console.log(`party-join in ${data.party}`, list)
        io.in(player.party).emit('party-update', list)
      })

      socket.on('party-doink', function() {
        const party = getPlayer(socket.id).party
        console.log(`doink in ${party}`)
        io.in(party).emit('party-doink')
      })

      socket.on('disconnect', function (fn) {
        const deletedPlayer = deletePlayer(socket.id)

        if (deletedPlayer) {
          const list = getPlayersOfParty(deletedPlayer.party)

          console.log(`disconnect from ${deletedPlayer.party}`, list)
          io.in(deletedPlayer.party).emit('party-update', list)
        }

      })

    })
  })
}

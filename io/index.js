import http from 'http'
import socketIO from 'socket.io'

const players = []

function getPlayer(id) {
  return players.find(player => player.id === id)
}

function getPlayersByRoom(room) {
  return players.filter(player => player.room === room)
}

function addPlayer(id, room) {
// {
//           id: socket.id,
//           location: [3, 3],
//           isClenched: false,
//           type: 'normie',
//         }
  const player = {
    id,
    room,
    isClenched: false,
    location: [-999, -999],
    type: 'normie',
  }

  // console.log('adding player', player)
  players.push(player)
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
      // socket.on('join', function (opts, fn) {
      //   world[socket.id] = {
      //     id: socket.id,
      //     location: [3, 3],
      //     isClenched: false,
      //     type: opts.type
      //   }

      //   getMembersList((members) => {
      //     const world = members
      //     fn(world)
      //   })
      // })

      socket.on('room', function (data) {
        console.log(data)
        socket.join(data.code)
        addPlayer(socket.id, data.code)
        // console.log(`${getPlayersByRoom(data.code).length} players in ${data.code}`)
        io.to(data.code).emit('world-update', getPlayersByRoom(data.code))
        // getMembersList((members) => {
        //   const world = members
        //   socket.broadcast.emit('world-update', world)
        // })
      //   getMembersList((members) => {
      //     const world = members
      //     fn(world)
      //   })

        // const clients = io.sockets.adapter.rooms.get(data.code);
        // const numClients = clients ? clients.size : 0;

        // console.log(`${socket.id} joined ${data.code}, so now there are ${numClients} members in there`)
      })
      socket.on('disconnect', function (fn) {
        const deletedPlayer = deletePlayer(socket.id)

        if (deletedPlayer) {
          socket.to(deletedPlayer.room).emit('world-update', getPlayersByRoom(deletedPlayer.room))
        }
      })
      socket.on('send-move', function(location) {
        const player = getPlayer(socket.id)
        
        if (player) {
          player.location = location
          // console.log(getPlayersByRoom(player.room))
          io.to(player.room).emit('world-update', getPlayersByRoom(player.room))
        }
      })
      // socket.on('send-clench', function(isClenched) {
      //   const member = world[socket.id]
        
      //   if (member) {
      //     member.isClenched = isClenched

      //     // getMembersList((members) => {
      //     //   const world = members
      //     //   socket.broadcast.emit('world-update', world)
      //     // })
      //   }
      // })
    })
  })
}

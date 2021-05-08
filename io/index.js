import http from 'http'
import socketIO from 'socket.io'

const players = []

function getPlayer(id) {
  return players.filter(player => player.id === id)
}

function getPlayers(room) {
  return players.filter(player => player.room === room)
}

function addPlayer(id, room) {
// {
//           id: socket.id,
//           location: [3, 3],
//           isClenched: false,
//           type: 'normie',
//         }
  players.push({
    id,
    room,
    isClenched: false,
    location: [3, 3],
    type: 'normie',
  })
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

      socket.on('last-messages', function (fn) {
        fn(messages.slice(-50))
      })
      socket.on('send-message', function (message) {
        messages.push(message)
        socket.broadcast.emit('new-message', message)
      })
      socket.on('room', async function (data) {
        const room = io.sockets.adapter.rooms.get(data.code);

        // console.log(room)

        // socket.state = {
        //   name: 'charlie',
        // }

        const player = {
          id: socket.id,
          location: [3, 3],
          isClenched: false,
          type: 'normie',
        }
        
        socket.join(data.code)
        addPlayer(socket.id, data.code)

        // console.log(players)
        console.log(`${players.length} players`)

        world[socket.id] = player

        getMembersList((members) => {
          const world = members
          socket.broadcast.emit('world-update', world)
        })
      //   getMembersList((members) => {
      //     const world = members
      //     fn(world)
      //   })

        // const clients = io.sockets.adapter.rooms.get(data.code);
        // const numClients = clients ? clients.size : 0;

        // console.log(`${socket.id} joined ${data.code}, so now there are ${numClients} members in there`)
      })
      socket.on('disconnect', function (fn) {
        deletePlayer(socket.id)
        console.log(`${players.length} players`)
      })
      socket.on('msg', function (msg) {
        console.log(msg)
        socket.to(msg.room).emit('msg', msg.msg)
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

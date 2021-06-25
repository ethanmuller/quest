import partyManager from './party-manager'

const players = []
export let io = null;

const world = {}

function getMembersList(party, fn) {
  io.fetchSockets()
    .then((sox) => {
      const members = []
      sox.forEach((socket) => {
        let member = world[socket.id]

        if (member && member.party !== party) {
          return
        }

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

function getPlayer(id) {
  return players.find(player => player.id === id)
}

function getPlayersOfParty(party) {
  return players.filter(player => player.party === party.toLowerCase())
}

function addPlayer(socket, partyCode) {
  const player = {
    id: socket.id,
    party: partyCode.toLowerCase(),
  }

  socket.join(player.party)

  players.push(player)

  const party = partyManager.partyList.find(p => player.party === p.id)
  if (party) {
    party.memberCount = party.memberCount + 1
  }

  return player
}

function deletePlayer(id) {
  const index = players.findIndex((player) => player.id === id);
  if (index !== -1) {

    const party = partyManager.partyList.find(p => players[index].party === p.id)
    if (party) {
      party.memberCount = party.memberCount - 1
    }

    return players.splice(index, 1)[0]
  }
}

export default function(socketInstance) {
  // This line feels incredibly flaky,
  // but I don't know how else to export
  // the socketInstance that is passed to this
  // function.
  io = socketInstance

  socketInstance.on('connection', (socket) => {

    socket.on('party-join', function (data) {
      const player = addPlayer(socket, data.party)
      const list = getPlayersOfParty(data.party)

      console.log(`party-join in ${data.party}`, list)
      socketInstance.in(player.party).emit('party-update', list)
    })

    socket.on('party-end', function () {
      const party = getPlayer(socket.id).party
      partyManager.endParty(party)
      socket.in(party).emit('party-end')
    })

    socket.on('send-move', function () {
      console.log('movin')
    })

    socket.on('party-set-name', function (nickname) {
      const player = getPlayer(socket.id)
      player.nickname = nickname
      const list = getPlayersOfParty(player.party)
      socketInstance.in(player.party).emit('party-update', list)
    })

    socket.on('party-set-avatar-url', function (url) {
      const player = getPlayer(socket.id)
      player.avatarUrl = url
      const list = getPlayersOfParty(player.party)
      socketInstance.in(player.party).emit('party-update', list)
    })

    socket.on('disconnect', function (fn) {
      const deletedPlayer = deletePlayer(socket.id)

      if (deletedPlayer) {
        const list = getPlayersOfParty(deletedPlayer.party)

        console.log(`disconnect from ${deletedPlayer.party}`, list)
        socketInstance.in(deletedPlayer.party).emit('party-update', list)
      }

    })

    socket.on('quest-join', function (opts, fn) {
      console.log(`a ${opts.type} joined ${opts.party}`)

      world[socket.id] = {
        id: socket.id,
        location: [3, 3],
        isClenched: false,
        type: opts.type,
        party: opts.party,
      }

      getMembersList(opts.party, (members) => {
        const world = members
        fn(world)
      })
    })

    socket.on('send-move', function(location) {
        const member = world[socket.id]

        if (member) {
          member.location = location

          getMembersList(member.party, (members) => {
              const world = members
              socket.to(member.party).emit('world-update', world)
            })
          }
    })

    socket.on('send-clench', function(isClenched) {
    })


  })
}

import partyManager from './party-manager'

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


export default function(socketInstance) {
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

    socket.on('party-set-name', function (nickname) {
      const player = getPlayer(socket.id)
      player.nickname = nickname
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

  })
}

<template>
  <div>
    <component v-bind:is="gamesMap[partyRoom.selectedGame]" :socket="socket" :isConnected="isConnected" :partyRoom="partyRoom" :people="people" ></component>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io-client.js'
import mapState from 'vuex'

export default {
  data() {
    return {
      isConnected: false,
      people: [],
      partyRoom: {},
      identitySet: false,
      socket: null,
      socketId: null,
      count: 0,
      gamesMap: {
        quest: 'GamesQuest',
        masks: 'GamesMasks',
      },
    }
  },
  
  computed: {
    avatarUrl: function() {
      this.$store.state.identity.avatarUrl
    },
  },

  created() {
    this.socket = socket
  },
    
  async fetch() {
    this.partyRoom = await fetch(`/api/party/${this.$route.params.party}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      if(res.ok) {
        return await res.json()
      } else {
        throw new Error(res.status)
      }
    })
  },
  mounted() {
    socket.on('connect', this.handleConnect)
    socket.on('disconnect', this.handleDisconnect)
    socket.on('party-update', this.receivePartyUpdate)
    socket.on('party-doink', this.receiveDoink)
    socket.on('party-end', this.receivePartyEnd)
    socket.on('test-event', this.receiveTestEvent)
    
    this.connect()
  },
  beforeDestroy() {
    this.disconnect()
    
    socket.off('connect', this.handleConnect)
    socket.off('disconnect', this.handleDisconnect)
    socket.off('party-update', this.receivePartyUpdate)
    socket.off('party-doink', this.receiveDoink)
    socket.off('party-end', this.receivePartyEnd)
    socket.off('test-event', this.receiveTestEvent)
  },
  
  methods: {
    setAvatarUrl() {
      this.identitySet = true
      socket.emit('party-set-avatar-url', this.$store.state.identity.avatarUrl)
    },
    editIdentity() {
      this.identitySet = false
    },
    endPartyButton() {
      if (confirm(`This will kick everybody out of the party. You're sure you want to do this?`)) {
        socket.emit('party-end')
        this.endParty()
      }
    },
    receiveTestEvent() {
      alert('the test worked!')
    },
    
    receivePartyEnd() {
      alert('this party is now over because somebody ended it')
      this.endParty()
    },
    endParty() {
      this.$router.push({ path: '/' })
    },
    handleConnect() {
      console.log('connect')
      this.socketId = socket.id
      this.isConnected = true

      socket.emit('party-join', { party: this.$route.params.party })
    },
    receivePartyUpdate(updatedParty) {
      console.log('received updated party')
      this.people = updatedParty
    },
    handleDisconnect() {
      console.log('disconnect')
      this.isConnected = false
      this.people = []
    },
    connect() {
      socket.connect()
    },
    disconnect() {
      socket.disconnect()
    },
  }    
}
</script>


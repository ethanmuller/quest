<template>
<div>
    <div v-if="$fetchState.pending">
      Joining party <strong>{{ $route.params.party.toUpperCase() }}</strong>...
    </div>
    <div v-else-if="$fetchState.error">
      The party <strong>{{ $route.params.party.toUpperCase() }}</strong> doesn't exist.
      Are you sure you spelled it correctly?
    </div>
    <div v-else-if="!$fetchState.pending && !$fetchState.error && partyRoom.isEnded">
      The party <strong>{{ $route.params.party.toUpperCase() }}</strong> has ended.
    </div>
    <div v-else-if="!$fetchState.pending && !$fetchState.error && !partyRoom.isEnded">
      <div v-if="isConnected">
        <div v-if="!identitySet">
          Party Code: <strong>{{ $route.params.party.toUpperCase() }}</strong>
          <IdentitySetter @doink="setAvatarUrl()" :socketId="socketId" />
        </div>
        <div v-if="identitySet">

          <div>you are in party <strong>{{ this.partyRoom.id }}</strong></div>
          <ul v-for="member in people">
            <li>
              <img v-if="member.avatarUrl" :src="member.avatarUrl" />
              <button @click="editIdentity" v-if="member.id === socketId">edit</button>
            </li>
          </ul>

          <button @click="endPartyButton()">End Party</button>

        </div>
      </div>

      <slot></slot>

      <div v-if="!isConnected">trying to connect...</div>
    </div>
</div>
</template>

<style scoped>
ul {
  list-style: none;

  display: flex;

}
</style>

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


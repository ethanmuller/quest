<template>
<div>
  <div v-if="$fetchState.pending">Joining party <strong>{{ $route.params.party.toUpperCase() }}</strong>...</div>
  <div v-else-if="$fetchState.error">The party <strong>{{ $route.params.party.toUpperCase() }}</strong> doesn't exist. Are you sure you spelled it correctly?</div>
  <div v-else-if="!$fetchState.pending && !$fetchState.error && partyRoom.isEnded">
    The party <strong>{{ $route.params.party.toUpperCase() }}</strong> has ended.
  </div>
  <div v-else-if="!$fetchState.pending && !$fetchState.error && !partyRoom.isEnded">
    <NuxtLink to="/">home</NuxtLink>

    <div v-if="isConnected">
      <div>you are in party <strong>{{ this.partyRoom.id }}</strong></div>
      <ul v-for="member in people">
        <li v-text="member.id"></li>
      </ul>

      <button @click="endPartyButton()">End Party</button>

    </div>

    <slot></slot>

    <div v-if="!isConnected">trying to connect...</div>
  </div>
</div>
</template>

<style>
</style>

<script>
import socket from '~/plugins/socket.io-client.js'

export default {
  data() {
    return {
      isConnected: false,
      people: [],
      partyRoom: {},
    }
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
    
    this.connect()
  },
  beforeDestroy() {
    this.disconnect()
    
    socket.off('connect', this.handleConnect)
    socket.off('disconnect', this.handleDisconnect)
    socket.off('party-update', this.receivePartyUpdate)
    socket.off('party-doink', this.receiveDoink)
    socket.off('party-end', this.receivePartyEnd)
  },
  
  methods: {
    endPartyButton() {
      if (confirm(`This will kick everybody out of the party. You're sure you want to do this?`)) {
        socket.emit('party-end')
        this.endParty()
      }
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


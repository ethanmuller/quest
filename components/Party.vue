<template>
<div>
  <NuxtLink to="/">home</NuxtLink>
  <div v-if="isConnected">
    <div>you are in party <strong>{{ $route.params.party }}</strong></div>
    <ul v-for="member in party">
      <li v-text="member.id"></li>
    </ul>
    <button @click="sendDoink()" :style="{ fontSize: '3rem' }">doink</button>
  </div>
  
  <slot></slot>

  <button @click="disconnect()" v-if="isConnected">disconnect</button>
    <button @click="connect()" v-if="!isConnected">connect</button>
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
      party: [],
    }
  },
  mounted() {
    socket.on('connect', this.handleConnect)
    socket.on('disconnect', this.handleDisconnect)
    socket.on('party-update', this.receivePartyUpdate)
    socket.on('party-doink', this.receiveDoink)

    this.connect()
  },
  beforeDestroy() {
    this.disconnect()

    socket.off('connect', this.handleConnect)
    socket.off('disconnect', this.handleDisconnect)
    socket.off('party-update', this.receivePartyUpdate)
    socket.off('party-doink', this.receiveDoink)
  },
  
  methods: {
    handleConnect() {
      console.log('connect')
      this.isConnected = true

      socket.emit('party-join', { party: this.$route.params.party })
    },
    receivePartyUpdate(updatedParty) {
      console.log('received updated party')
      this.party = updatedParty
    },
    receiveDoink() {
      alert('doink')
    },
    sendDoink() {
      socket.emit('party-doink')
    },
    handleDisconnect() {
      console.log('disconnect')
      this.isConnected = false
      this.party = []
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


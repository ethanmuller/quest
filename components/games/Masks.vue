<template>
  <div>
      <div v-if="isConnected">
        <div class="party-header">Party Code: <strong>{{ this.partyRoom.id.toUpperCase() }}</strong></div>
        <div v-if="!identitySet">
          <IdentitySetter @doink="setAvatarUrl()" :socketId="socket.id" />
        </div>
        <main v-if="identitySet">
          <div class="party-chunk">
            <p v-if="people.length === 1" style="opacity: 0.2">You are here by yourself.</p>
            <p v-else-if="people.length === 2">There's 1 other person here.</p>
            <p v-else-if="people.length > 2">There's {{ people.length - 1 }} other people here.</p>
            <ul class="party-list">
              <li v-for="member in people">
                <button @click="editIdentity" v-if="member.id === socket.id">
                  <img v-if="member.avatarUrl" :src="member.avatarUrl" />
                  <span class="you">YOU</span>
                </button>
                <img v-else="member.avatarUrl" :src="member.avatarUrl" />
              </li>
            </ul>
          </div>

          <div class="host-note"><button @click="endPartyButton()" class="btn btn--danger">End Party</button></div>

        </main>
      </div>

      <slot></slot>

      <div v-if="!isConnected">trying to connect...</div>
    </div>
</template>

<script>
export default {
  props: ['socket', 'party', 'isConnected', 'partyRoom', 'people'],

  data() {
    return {
      identitySet: false,
      socketId: null,
      count: 0,
    }
  },
  
  // computed: {
    // avatarUrl: function() {
      // this.$store.state.identity.avatarUrl
    // },
  // },

  // async fetch() {
  //   this.partyRoom = await fetch(`/api/party/${this.$route.params.party}`, {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   }).then(async (res) => {
  //     if(res.ok) {
  //       return await res.json()
  //     } else {
  //       throw new Error(res.status)
  //     }
  //   })
  // }
    // ,
  mounted() {
    // this.socket.on('connect', this.handleConnect)
    // this.socket.on('disconnect', this.handleDisconnect)
    // this.socket.on('party-update', this.receivePartyUpdate)
    // this.socket.on('party-doink', this.receiveDoink)
    // this.socket.on('party-end', this.receivePartyEnd)
    // this.socket.on('test-event', this.receiveTestEvent)
    
    // this.connect()
  },
  beforeDestroy() {
    // this.disconnect()
    
    // this.socket.off('connect', this.handleConnect)
    // this.socket.off('disconnect', this.handleDisconnect)
    // this.socket.off('party-update', this.receivePartyUpdate)
    // this.socket.off('party-doink', this.receiveDoink)
    // this.socket.off('party-end', this.receivePartyEnd)
    // this.socket.off('test-event', this.receiveTestEvent)
  },
  
  methods: {
    setAvatarUrl() {
      this.identitySet = true
      this.socket.emit('party-set-avatar-url', this.$store.state.identity.avatarUrl)
    },
    editIdentity() {
      this.identitySet = false
    },
    endPartyButton() {
      if (confirm(`This will kick everybody out of the party. You're sure you want to do this?`)) {
        this.socket.emit('party-end')
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
    // handleConnect() {
      // console.log('connect')
      // this.socketId = socket.id
      // this.isConnected = true

      // socket.emit('party-join', { party: this.$route.params.party })
    // },
    // receivePartyUpdate(updatedParty) {
      // console.log('received updated party')
      // this.people = updatedParty
    // },
    // handleDisconnect() {
      // console.log('disconnect')
      // this.isConnected = false
      // this.people = []
    // },
    // connect() {
      // this.socket.connect()
    // },
    // disconnect() {
      // this.socket.disconnect()
    // },
  }    
}
</script>


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
  props: ['socket', 'party', 'isConnected', 'partyRoom', 'people', 'endParty'],

  data() {
    return {
      identitySet: false,
      socketId: null,
      count: 0,
    }
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
  }
}
</script>


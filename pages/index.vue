<template>
<main>
  
  <div class="join-chunk">
    <form @submit.prevent="joinParty" class="input-and-button">
      <label>
        <span class="input-label">Party Code</span>
        <input type="text" v-model="partyCode">
        <span class="hint" v-if="partyCode.length > 4">Code should be no more than 4 characters</span>
      </label>
      <button class="btn btn--primary join-button" :disabled="partyCode.length !== 4">Join</button>
    </form>
  </div>
  
    <p class="host-note">
      <button class="btn btn--sm" @click="hostParty = createParty()">Create Party</button>
    </p>
  </main>
</template>

<script>
export default {
  data() {
    return {
      hostParty: {},
      hostPartyTicket: '',
      partyCode: '',
    }
  },
  
  mounted() {
    this.hostPartyTicket = Math.floor(Math.random() * 1000000)
  },
  
  methods: {
    async createParty() {
      const data = { ticket: this.hostPartyTicket }
      
      const response = await fetch('/api/party', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      const responseJSON = await response.json()
      
      this.$router.push({
        name: 'party-party',
        params: {
          party: responseJSON.id,
          role: 'host',
          ticket: this.hostPartyTicket,
        },
      })
      // $router.push({name: 'next-page', params: {foo: 1}})
    },
    joinParty() {
      this.$router.push({
        name: 'party-party',
        params: {
          party: this.partyCode,
          role: 'guest',
        },
      })
    }
  },
}
</script>

<style>
</style>

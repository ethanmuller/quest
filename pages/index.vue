<template>
<main>
  
  <div class="join-chunk">
    <form @submit.prevent="joinParty" class="input-and-button">
      <label>
        Party Code
        <input type="text" v-model="partyCode">
        <span class="hint" v-if="partyCode.length > 4">Code should be no more than 4 characters</span>
      </label>
      <button class="join-button" :disabled="partyCode.length !== 4">Join</button>
    </form>
  </div>
  
    <p class="host-note">
      <button @click="hostParty = createParty()">create party</button>
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
main {
  min-height: calc(100vh - 5rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.join-chunk {
  flex: 1;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.input-and-button {
  display: flex;
  align-items: flex-start;
}

.join-button {
  display: inline-block;
  padding: 0.5rem 2rem;
  margin-top: 0.75rem;
}

.host-note {
  align-self: end;
  padding-right: 3rem;
}

input {
  display: block;
}

.hint {
  max-width: 13em;
  display: inline-block;
  font-size: 0.7rem;
}
</style>

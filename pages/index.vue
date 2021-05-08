<template>
<main>
  
  <div class="join-chunk">
    <div class="input-and-button">
      <label>
        Lobby Code
        <input type="text">
      </label>
      <NuxtLink class="join-button" to="/joining">Join</NuxtLink>
    </div>
  </div>
  
    <p class="host-note">
      First one here? Maybe you want to
      <button @click="hostRoom = createRoom()">create room</button>
      {{ hostRoomTicket }}
    </p>
  </main>
</template>

<script>
export default {
  data() {
    return {
      hostRoom: {},
      hostRoomTicket: '',
    }
  },
  
  mounted() {
    this.hostRoomTicket = Math.floor(Math.random() * 1000000)
  },
  
  methods: {
    async createRoom() {
      const data = { ticket: this.hostRoomTicket }

      const response = await fetch('/api/party', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const responseJSON = await response.json()

      this.$router.push({
        name: 'party-code',
        params: {
          code: responseJSON.code,
          ticket: this.hostRoomTicket,
        },
      })
// $router.push({name: 'next-page', params: {foo: 1}})
    },
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
    align-items: flex-end;
  }

  .join-button {
  display: inline-block;
  padding: 0.5rem 2rem;
  }

  .host-note {
    align-self: end;
    padding-right: 3rem;
  }

  input {
    display: block;
  }
</style>

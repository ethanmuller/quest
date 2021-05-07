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
      <NuxtLink to="/joining">Create Room</NuxtLink>
    </p>
  </main>
</template>

<script>
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

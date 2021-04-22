<template>
  <div>
    <p>party time</p>
    <button @click="doink">yee</button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    mounted() {
      // this.socket = this.$nuxtSocket({ channel: '/index' })
    },
    methods: {
      doink() {
        // this.socket.emit('doink', { id: 'abc123' })
      },
    }
  }
</script>

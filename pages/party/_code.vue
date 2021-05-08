<template>
<div>
  <Labyrinth :room="$route.params.code" />
</div>
</template>

<script>
import socket from '~/plugins/socket.io.js'

export default {
  layout: 'party-room',
  head() {
    return {
      title: `${this.$route.params.code} - QUEST`
    }
  },
  
  methods: {
    asdf() {
      console.log('emitting msg')
      socket.emit('msg', {
        room: this.$route.params.code,
        msg: `we in ${this.$route.params.code}`,
      })
    },
    
  },
}
</script>


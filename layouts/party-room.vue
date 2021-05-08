<template>
  <div>
    its a party babyyyyy
    <Nuxt />
  </div>
</template>

<style>
</style>

<script>
import socket from '~/plugins/socket.io.js'

export default {
  asyncData () {
    return { doink: true }
    // return new Promise(function (resolve) {
    //   return socket.emit('join', { type: 'normie' }, function (data) {
    //     return resolve({ world: data })
    //   })
    // })
  },

  data() {
    return {
      thing: true,
    }
    
  },

  mounted() {
    socket.on('connect', () => {
      socket.emit('room', {
        code: this.$route.params.code,
      }) 
    })

    socket.on('msg', (msg) => {
      console.log(msg)
    })
  },
}
</script>

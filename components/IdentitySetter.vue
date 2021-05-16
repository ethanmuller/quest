<template>
  <div class="noselect" ref="root">
    <div>what do you look like?</div>
    <DrawingPad></DrawingPad>
    <button @click="saveDrawing">save</button>
  </div>
</template>

<script>
export default {
  props: [ 'socketId' ],
  methods: {
    saveDrawing(e) {
      try {
        const root = this.$refs.root
        const canvas = root.querySelector('canvas')
        
        canvas.toBlob((blob) => {
          const fd = new FormData()
          fd.append('drawling', blob, 'blob.png')
          fd.append('party', this.$route.params.party)
          fd.append('socketId', this.socketId)
          
          fetch(`/api/party/${this.$route.params.party}/upload`, {
            method: 'post',
            body: fd,
          })
            .then((response) => response.json())
            .then((res) => {
              this.setIdentity(res.url)
            })
        })
      } catch (err) {
        alert(`Oh no. Please tell Ethan an error happened. Sorry!!

The error:
${err}`)
      }
    },
    setIdentity(avatarUrl) {
      this.$store.commit('identity/setAvatarUrl', avatarUrl)
      this.$emit('doink')
    },

  }
  
}
</script>

<style scoped>
  .noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently */
  }
</style>

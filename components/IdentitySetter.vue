<template>
  <div ref="root">
    <div>what do you look like?</div>
    <div>id: {{socketId}}</div>
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

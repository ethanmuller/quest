<template>
  <div ref="root">
    <div>what do you look like?</div>
    <DrawingPad></DrawingPad>
    <button @click="saveDrawing">save</button>
  </div>
</template>

<script>
export default {
  methods: {
    saveDrawing(e) {
      try {
        const root = this.$refs.root
        const canvas = root.querySelector('canvas')
        
        canvas.toBlob((blob) => {
          const fd = new FormData()
          fd.append('drawling', blob, 'blob.png')
          fd.append('party', this.$route.params.party)
          console.log(fd)
          
          // fetch(`/api/post/${this.post._id}/upload`, {
          //   method: 'post',
          //   body: fd,
          // })
          //   .then((response) => response.json())
          //   .then((res) => {
          //     console.log(res)
          //   })
        })
      } catch (err) {
        alert(`Oh no. Please tell Ethan an error happened. Sorry!

The error:
${err}`)
      }
    },
  }
  
}
</script>

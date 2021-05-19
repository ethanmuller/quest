<template>
<div style="width: 80%; text-align: center;">
  <canvas ref="cnv" width="333" height="333"></canvas>

  <button
    style="margin-top: 1.5rem;"
    class="btn"
    aria-label="clear"
    @click="clear"
    >
    Clear
  </button>

</div>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      toolMethod: 'pencil',
      drawing: false,
      current: {},
      boundingClientRect: {},
      w: null,
      h: null,
    }
  },
  mounted() {
    this.canvas = this.$refs.cnv
    this.ctx = this.canvas.getContext('2d')
    
    this.boundingClientRect = this.$refs.cnv.getBoundingClientRect()
    
    this.$refs.cnv.addEventListener('mousedown', this.onMouseDown, false)
    this.$refs.cnv.addEventListener('mousemove', this.onMouseMove, false)
    this.$refs.cnv.addEventListener('mouseup', this.onMouseUp, false)
    this.$refs.cnv.addEventListener('mouseout', this.onMouseUp, false)
    
    this.$refs.cnv.addEventListener('touchstart', this.onMouseDown, false)
    this.$refs.cnv.addEventListener('touchmove', this.onMouseMove, false)
    this.$refs.cnv.addEventListener('touchend', this.onMouseUp, false)
    this.$refs.cnv.addEventListener('touchcancel', this.onMouseUp, false)

    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  },
  beforeDestroy() {
    this.$refs.cnv.removeEventListener('mousedown', this.onMouseDown)
    this.$refs.cnv.removeEventListener('mousemove', this.onMouseMove)
    this.$refs.cnv.removeEventListener('mouseup', this.onMouseUp)
    this.$refs.cnv.removeEventListener('mouseout', this.onMouseUp)
    this.$refs.cnv.addEventListener('touchstart', this.onMouseDown)
    this.$refs.cnv.addEventListener('touchmove', this.onMouseMove)
    this.$refs.cnv.addEventListener('touchend', this.onMouseUp)
    this.$refs.cnv.addEventListener('touchcancel', this.onMouseUp)
    window.removeEventListener('resize', this.onResize)
  },
  
  methods: {
    onResize() {
      this.$refs.cnv.width = this.$refs.cnv.parentElement.offsetWidth
      this.$refs.cnv.height = this.$refs.cnv.parentElement.offsetWidth

    },
    
    drawLine(x0, y0, x1, y1, color, emit){
      this.ctx.beginPath();
      this.ctx.moveTo(x0, y0);
      this.ctx.lineTo(x1, y1);
      this.ctx.strokeStyle = color;
      this.ctx.lineCap = 'round';
      this.ctx.lineWidth = 6;
      this.ctx.stroke();
      this.ctx.closePath();
      
    //   if (!emit) { return; }
    //   var w = canvas.width;
    //   var h = canvas.height;
      
    //   socket.emit('drawing', {
    //     x0: x0 / w,
    //     y0: y0 / h,
    //     x1: x1 / w,
    //     y1: y1 / h,
    //   color: color
    // });
    },
    onMouseDown(e) {
    this.boundingClientRect = this.$refs.cnv.getBoundingClientRect()

      this.drawing = true
      this.current.x = (e.clientX||e.touches[0].clientX) - this.boundingClientRect.x + window.scrollX;
      this.current.y = (e.clientY||e.touches[0].clientY) - this.boundingClientRect.y + window.scrollY;
    },
    
    onMouseMove(e) {
      e.preventDefault()
      
      if (!this.drawing) { return }

      const newX = (e.clientX||e.touches[0].clientX) - this.boundingClientRect.x + window.scrollX;
      const newY = (e.clientY||e.touches[0].clientY) - this.boundingClientRect.y + window.scrollY;

      this.drawLine(this.current.x, this.current.y, newX, newY, 'black', true)

      this.current.x = newX;
      this.current.y = newY;
    },
    
    onMouseUp(e) {
      if (!this.drawing) { return }

      this.drawing = false

      const newX = (e.clientX||e.touches[0].clientX) - this.boundingClientRect.x + window.scrollX;
      const newY = (e.clientY||e.touches[0].clientY) - this.boundingClientRect.y + window.scrollY;

      this.drawLine(this.current.x, this.current.y, newX, newY, 'black', true)
    },
    clear(e) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
  },
}
</script>

<style scoped>
canvas {
  background: #fff;
  border-radius: 999rem;
}
</style>

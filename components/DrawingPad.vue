<template>
  <div style="position: relative">
    <canvas ref="cnv" width="333" height="333"></canvas>
    <div class="pad-toolbar">
      <label style="margin-bottom: 0.5rem; " class="btn btn-ui">
        <input
          aria-label="needle"
          type="radio"
          name="tool"
          checked
          @change="handleChange"
        />
        <span class="tool-label-icon">✏️</span>
        <span class="tool-label">CRISPY</span>
      </label>
      <label style="margin-bottom: 0.5rem;" class="btn btn-ui">
        <input
          aria-label="pencil"
          type="radio"
          name="tool"
          checked
          @change="toolMethod = 'pencil'"
        />
        <span class="tool-label-icon">🖌️</span>
        <span class="tool-label">THICC</span>
      </label>
      <label style="margin-bottom: 0.5rem;" class="btn btn-ui">
        <input
          aria-label="eraser"
          type="radio"
          name="tool"
          @change="toolMethod = 'eraser'"
        />
        <span class="tool-label-icon">💊</span>
        <span class="tool-label">ERASER</span>
      </label>
      <label style="margin-bottom: 0.5rem;" class="btn btn-ui">
        <input
          aria-label="bzzt"
          type="radio"
          name="tool"
          @change="toolMethod = 'bzzt'"
        />
        <span class="tool-label-icon">⚡</span>
        <span class="tool-label">bzzt</span>
      </label>
      <button
        style="margin-top: auto; padding: 0.5rem"
        class="btn btn-ui"
        aria-label="clear"
        @click="clear"
      >
        💣
        <span class="tool-label">CLEAR</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      toolMethod: 'pencil',
    }
  },
  mounted() {
    this.canvas = this.$refs.cnv
    this.ctx = this.canvas.getContext('2d')

    this.$refs.cnv.addEventListener('mousemove', this.handleMouseMove)
  },
  methods: {
    handleMouseMove(e) {
      const rect = e.target.getBoundingClientRect()

      // console.log(rect, e)
      this.drawl({ x: e.clientX - rect.x, y: e.clientY - rect.y })
    },
    drawl(pos) {
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI);
      this.ctx.stroke(); 
    },
    applyTool(e) {
      this[this.toolMethod](e)
    },
    clear(e) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    handleChange(e) {
      // method = needle
      console.log(e)
    },
    needle(e) {
      const { ctx } = this
      const { x: x1, y: y1 } = e.center
      const { x: x2, y: y2 } = this.$refs.cnv.getBoundingClientRect()
      const x = x1 - x2
      const y = y1 - y2

      ctx.strokeStyle = 'black'
      ctx.lineWidth = 0.25
      ctx.globalCompositeOperation = 'source-over'

      if (e.type === 'panstart' || e.type === 'press') {
        ctx.beginPath()
        ctx.moveTo(x, y)
      }

      ctx.lineTo(x, y)
      ctx.stroke()
    },
    pencil(e) {
      const { ctx } = this
      const { x: x1, y: y1 } = e.center
      const { x: x2, y: y2 } = this.$refs.cnv.getBoundingClientRect()
      const x = x1 - x2
      const y = y1 - y2

      ctx.strokeStyle = 'black'
      ctx.lineWidth = 3
      ctx.globalCompositeOperation = 'source-over'

      if (e.type === 'panstart' || e.type === 'press') {
        ctx.beginPath()
        ctx.moveTo(x, y)
      }

      ctx.lineTo(x, y)
      ctx.stroke()
    },
    eraser(e) {
      const { ctx } = this
      const { x: x1, y: y1 } = e.center
      const { x: x2, y: y2 } = this.$refs.cnv.getBoundingClientRect()
      const x = x1 - x2
      const y = y1 - y2

      ctx.strokeStyle = 'black'
      ctx.lineWidth = 15
      ctx.globalCompositeOperation = 'destination-out'

      if (e.type === 'panstart' || e.type === 'press') {
        ctx.beginPath()
        ctx.moveTo(x, y)
      }

      ctx.lineTo(x, y)
      ctx.stroke()
    },
    bzzt(e) {
      const { ctx } = this
      const { x: x1, y: y1 } = e.center
      const { x: x2, y: y2 } = this.$refs.cnv.getBoundingClientRect()
      const x = x1 - x2
      const y = y1 - y2

      ctx.strokeStyle = 'black'
      ctx.lineWidth = 15
      ctx.globalCompositeOperation = 'destination-out'

      if (e.type === 'panstart' || e.type === 'press') {
        ctx.beginPath()
        ctx.moveTo(x, y)
      }

      ctx.lineTo(x, y)
      ctx.stroke()
    },
  },
}
</script>

<style scoped>
canvas {
  background: #eee;
}
  
.pad-toolbar {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 0.5rem;
}

.pad-toolbar label {
  display: flex;
  align-items: center;
}
.pad-toolbar input {
  margin: 0.5rem;
}
.tool-label-icon {
  margin-right: 0.5rem;
}
.tool-label {
  opacity: 0.6;
  display: none;
}
@media (min-width: 510px) {
  .tool-label {
    /* display: inline; */
  }
}
</style>

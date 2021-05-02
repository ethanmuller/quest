<template>
<article>
  <main>
    
  </main>
  <div id="controls">
    
    <div class="left">
      <Dpad @dpadRelease="dpadRelease" @dpadPress="dpadPress"></Dpad>
    </div>
    <div class="right buttons" id="r"><Btn @btnRelease="btnRelease" @btnPress="btnPress"></Btn></div>
      
    </div>
    </article>
</template>

<script>
import socket from '~/plugins/socket.io.js'

const canvasSize = 666;
const numTilesW = 8;
const numTilesH = 8;
const tileWidth = canvasSize / numTilesW;
const tileHeight = canvasSize / numTilesH;

export default {
  asyncData () {
    return new Promise(resolve =>
      socket.emit('join', data => resolve({ world: data }))
    )
  },
  data () {
    return {
      message: '',
      x: 0,
      y: 0,
      isClenched: false,
      world: [
        // [3, 3],
        // [3, 4],
      ],
    }
  },
  head: {
    title: 'Nuxt.js with Socket.io'
  },
  watch: {
  },
  beforeMount () {
    socket.on('new-message', (message) => {
      this.messages.push(message)
    })
    socket.on('world-update', (world) => {
      this.world = world
      console.log(this)
    })
  },
  mounted() {   
    let sketch = function (p5) {    
      p5.setup = _ => {      
        p5.createCanvas(canvasSize, canvasSize);      
        p5.ellipse(p5.width / 2, p5.height / 2, 500, 500);    
      }
      p5.draw = _ => {      
        p5.background(0);
        // p5.push();
        // p5.translate(0, p5.height / 2);
        // p5.ellipse(posX, y, 50, 50);
        // p5.pop();
        // posX += this.speed;
        
        // if (posX > p5.width || posX < 0) {    
        //   this.speed *= -1;      
        // }
        
        
        p5.noFill()
        p5.stroke("white")
        p5.strokeWeight(3)
        for (let i = 0; i < this.world.length; i++) {
          if (socket.id === this.world[i].id) {
            continue;
          }
          p5.ellipse(this.world[i].location[0] * tileWidth, this.world[i].location[1] * tileHeight, tileWidth, tileHeight);
        }
        
        p5.fill("white")
        p5.noStroke()
        p5.ellipse(this.x * tileWidth, this.y * tileHeight, tileWidth * (this.isClenched ? 0.5 : 1));
      }  
    }
    sketch = sketch.bind(this)
    // NOTE: Use p5 as an instance mode
    const P5 = require('p5');
    new P5(sketch);
  },
  methods: {
    btnPress() {
      this.clenchStart()
    },

    btnRelease() {
      this.clenchEnd()
    },

    clenchStart() {
      this.isClenched = true
      socket.emit('send-clench', this.isClenched)
    },
    
    clenchEnd() {
      this.isClenched = false
      socket.emit('send-clench', this.isClenched)
    },
    
    dpadPress(dir) {
      this.move(dir)
    },

    dpadRelease() {
    },
    
    move(dir) {
      this.x = this.x + dir[0]
      this.y = this.y + dir[1]
      
      // wrap
      if (this.x > numTilesW) {
        this.x = 0;
      }
      if (this.x < 0) {
        this.x = numTilesW;
      }
      if (this.y > numTilesH) {
        this.y = 0;
      }
      if (this.y < 0) {
        this.y = numTilesH;
      }
      
      socket.emit('send-move', [this.x, this.y])
    },

    sendMessage () {
      const message = {
        date: new Date().toJSON(),
        text: 'dpad pressed'
      }
      this.messages.push(message)
      this.message = ''
      socket.emit('send-message', message)
    },
  }
}
</script>
